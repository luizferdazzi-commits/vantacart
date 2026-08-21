import {NextResponse} from 'next/server';
import {claimOrderForFulfillment,markOrderCjSubmitted,markOrderFulfillmentFailed} from '../../../../../lib/orders';
import {createCjOrderV2} from '../../../../../lib/cj';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const TARGET_ORDER='VC-MT27KWDO-ZL24N';

export async function GET(){
  const order=await claimOrderForFulfillment(TARGET_ORDER);
  if(!order)return NextResponse.json({ok:false,orderId:TARGET_ORDER,status:'NOT_CLAIMED'});
  try{
    const address:any=order.customer_address||{};
    const items=(order.items||[]).map((item:any)=>({
      productId:String(item.cj_product_id||''),
      variantId:String(item.cj_variant_id||''),
      quantity:Number(item.quantity||1),
      lineItemId:String(item.id)
    }));
    if(items.some((x:any)=>!x.variantId))throw new Error('Order contains an item without a CJ variant ID');
    const result=await createCjOrderV2({
      orderNumber:order.public_id,
      items,
      logisticName:String(order.shipping_method||''),
      sandbox:false,
      shipping:{
        countryCode:String(address.country||order.destination_country||''),
        country:String(address.country||order.destination_country||''),
        province:String(address.state||''),
        city:String(address.city||''),
        address:String(address.line1||''),
        address2:String(address.line2||''),
        zip:String(address.postal_code||order.destination_postal_code||''),
        name:String(address.name||order.customer_name||''),
        phone:String(address.phone||order.customer_phone||''),
        email:String(order.customer_email||''),
        taxId:String(order.tax_id||'')
      }
    });
    await markOrderCjSubmitted(TARGET_ORDER,result);
    return NextResponse.json({ok:true,orderId:TARGET_ORDER,status:'SUBMITTED',cjOrderId:result?.data?.orderId||result?.data?.id||null});
  }catch(e){
    const message=e instanceof Error?e.message:'CJ fulfillment failed';
    await markOrderFulfillmentFailed(TARGET_ORDER,message);
    return NextResponse.json({ok:false,orderId:TARGET_ORDER,status:'FAILED',error:message},{status:500});
  }
}
