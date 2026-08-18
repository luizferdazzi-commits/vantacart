import {NextResponse} from 'next/server';
import {updateCatalogProduct} from '@/lib/db';

export async function PATCH(req:Request){
  try{
    const body=await req.json();
    const id=Number(body.id);
    const salePrice=Number(body.salePrice);
    const status=String(body.status);
    if(!Number.isFinite(id)||id<=0) return NextResponse.json({error:'Invalid product id'},{status:400});
    if(!Number.isFinite(salePrice)||salePrice<0) return NextResponse.json({error:'Invalid sale price'},{status:400});
    if(!['DRAFT','ACTIVE','ARCHIVED'].includes(status)) return NextResponse.json({error:'Invalid status'},{status:400});
    const product=await updateCatalogProduct(id,{salePrice,status:status as 'DRAFT'|'ACTIVE'|'ARCHIVED'});
    if(!product) return NextResponse.json({error:'Product not found'},{status:404});
    return NextResponse.json({ok:true,product});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to update product'},{status:500});}
}
