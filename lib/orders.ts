import { neon } from '@neondatabase/serverless';

export type OrderItemInput={
  id:string;
  name:string;
  price:number;
  qty:number;
  vid?:string;
  variant?:string;
};

function sqlClient(){
  const url=process.env.DATABASE_URL;
  if(!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export async function ensureOrders(){
  const sql=sqlClient();
  await sql`CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    public_id TEXT UNIQUE NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    fulfillment_status TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    currency TEXT NOT NULL DEFAULT 'usd',
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    destination_country TEXT,
    destination_postal_code TEXT,
    shipping_method TEXT,
    customer_email TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address JSONB,
    stripe_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    cj_product_id TEXT NOT NULL,
    cj_variant_id TEXT,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status)`;
}

export async function createPendingOrder(input:{items:OrderItemInput[];shipping:number;country:string;zip:string;shippingMethod:string}){
  await ensureOrders();
  const sql=sqlClient();
  const subtotal=input.items.reduce((sum,item)=>sum+(item.price*item.qty),0);
  const total=subtotal+input.shipping;
  const publicId=`VC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const rows=await sql`INSERT INTO orders (public_id,payment_status,fulfillment_status,currency,subtotal,shipping_amount,total_amount,destination_country,destination_postal_code,shipping_method)
    VALUES (${publicId},'PENDING','AWAITING_PAYMENT','usd',${subtotal},${input.shipping},${total},${input.country},${input.zip},${input.shippingMethod}) RETURNING id,public_id`;
  const order=rows[0] as {id:number;public_id:string};
  for(const item of input.items){
    await sql`INSERT INTO order_items (order_id,cj_product_id,cj_variant_id,product_name,variant_name,unit_price,quantity)
      VALUES (${order.id},${item.id},${item.vid||null},${item.name},${item.variant||null},${item.price},${item.qty})`;
  }
  return order;
}

export async function attachStripeSession(publicId:string,sessionId:string){
  await ensureOrders();
  const sql=sqlClient();
  await sql`UPDATE orders SET stripe_session_id=${sessionId},updated_at=NOW() WHERE public_id=${publicId}`;
}

export async function markOrderCheckoutFailed(publicId:string,payload:unknown){
  await ensureOrders();
  const sql=sqlClient();
  await sql`UPDATE orders SET payment_status='CHECKOUT_FAILED',stripe_payload=${JSON.stringify(payload)},updated_at=NOW() WHERE public_id=${publicId}`;
}

export async function markOrderPaidFromSession(session:any){
  await ensureOrders();
  const sql=sqlClient();
  const publicId=String(session?.metadata?.order_id||session?.client_reference_id||'');
  const sessionId=String(session?.id||'');
  if(!publicId&&!sessionId) throw new Error('Stripe session has no order reference');
  const customer=session?.customer_details||{};
  const address=customer?.address||session?.collected_information?.shipping_details?.address||null;
  const rows=await sql`UPDATE orders SET
    stripe_session_id=COALESCE(${sessionId||null},stripe_session_id),
    stripe_payment_intent_id=${session?.payment_intent?String(session.payment_intent):null},
    payment_status=${session?.payment_status==='paid'?'PAID':'PENDING'},
    fulfillment_status=${session?.payment_status==='paid'?'READY_FOR_FULFILLMENT':'AWAITING_PAYMENT'},
    total_amount=${Number(session?.amount_total||0)/100},
    customer_email=${customer?.email||null},
    customer_name=${customer?.name||null},
    customer_phone=${customer?.phone||null},
    customer_address=${address?JSON.stringify(address):null},
    stripe_payload=${JSON.stringify(session)},
    paid_at=${session?.payment_status==='paid'?new Date().toISOString():null},
    updated_at=NOW()
    WHERE (${publicId}<>'' AND public_id=${publicId}) OR (${sessionId}<>'' AND stripe_session_id=${sessionId})
    RETURNING public_id,payment_status,fulfillment_status,total_amount,customer_email`;
  return rows[0] as {public_id:string;payment_status:string;fulfillment_status:string;total_amount:number;customer_email:string|null}|undefined;
}

export async function getOrderBySession(sessionId:string){
  await ensureOrders();
  const sql=sqlClient();
  const rows=await sql`SELECT public_id,payment_status,fulfillment_status,total_amount,currency,customer_email,created_at,paid_at FROM orders WHERE stripe_session_id=${sessionId} LIMIT 1`;
  return rows[0] as any|undefined;
}

export async function listOrders(limit=50){
  await ensureOrders();
  const sql=sqlClient();
  const rows=await sql`SELECT o.id,o.public_id,o.payment_status,o.fulfillment_status,o.total_amount,o.currency,o.customer_email,o.customer_name,o.destination_country,o.destination_postal_code,o.shipping_method,o.created_at,o.paid_at,
    COALESCE((SELECT json_agg(json_build_object('product_name',oi.product_name,'variant_name',oi.variant_name,'quantity',oi.quantity,'unit_price',oi.unit_price,'cj_product_id',oi.cj_product_id,'cj_variant_id',oi.cj_variant_id) ORDER BY oi.id) FROM order_items oi WHERE oi.order_id=o.id),'[]'::json) AS items
    FROM orders o ORDER BY o.created_at DESC LIMIT ${limit}`;
  return rows as any[];
}
