import { NextResponse } from 'next/server';
import { saveDraft } from '@/lib/db';

export async function POST(request:Request){
  try{
    const body=await request.json();
    const cjProductId=String(body.cjProductId||'').trim();
    const name=String(body.name||'').trim();
    const imageUrl=String(body.imageUrl||'').trim();
    const cost=Number(body.cost||0);
    const price=Number(body.price||0);
    if(!cjProductId||!name) return NextResponse.json({ok:false,error:'Missing product data'},{status:400});
    const product=await saveDraft({cjProductId,name,imageUrl,cost,price});
    return NextResponse.json({ok:true,product});
  }catch(e){
    return NextResponse.json({ok:false,error:e instanceof Error?e.message:'Catalog import failed'},{status:500});
  }
}
