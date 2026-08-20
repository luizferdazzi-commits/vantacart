import {NextResponse} from 'next/server';
import {getCjOrderDetail,getCjTracking} from '../../../../lib/cj';
import {listOrders,syncCjOrderState} from '../../../../lib/orders';

export const dynamic='force-dynamic';

async function runSync(){
  const orders=await listOrders(100);
  const pending=orders.filter((o:any)=>o.cj_order_id&&!['DELIVERED','CANCELLED'].includes(String(o.fulfillment_status||'')));
  const results=[] as any[];
  for(const order of pending){
    try{
      const detail=await getCjOrderDetail(String(order.cj_order_id));
      const track=String(detail?.trackNumber||detail?.trackingNumber||detail?.logisticInfo?.trackNumber||'');
      const tracking=track?await getCjTracking(track):null;
      await syncCjOrderState(order.public_id,detail,tracking);
      results.push({orderId:order.public_id,cjOrderId:order.cj_order_id,status:detail?.orderStatus||null,trackNumber:track||null,ok:true});
    }catch(e){results.push({orderId:order.public_id,cjOrderId:order.cj_order_id,ok:false,error:e instanceof Error?e.message:String(e)});}
  }
  return results;
}

export async function GET(req:Request){
  const secret=process.env.CRON_SECRET;
  if(!secret)return NextResponse.json({error:'Cron is not configured.'},{status:503});
  const auth=req.headers.get('authorization');
  if(auth!==`Bearer ${secret}`)return NextResponse.json({error:'Unauthorized'},{status:401});
  const results=await runSync();
  return NextResponse.json({ok:true,synced:results.length,results});
}

export async function POST(req:Request){return GET(req);}
