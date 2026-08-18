import {NextRequest,NextResponse} from 'next/server';
import {searchCjProducts} from '@/lib/cj';

export const dynamic='force-dynamic';

export async function GET(req:NextRequest){
  try{
    const q=req.nextUrl.searchParams.get('q') || 'trending';
    const rawSize=Number(req.nextUrl.searchParams.get('size') || 20);
    const size=Number.isFinite(rawSize)?Math.min(Math.max(rawSize,1),30):20;
    const data=await searchCjProducts(q,size);
    return NextResponse.json({ok:true,...data});
  }catch(error){
    const message=error instanceof Error?error.message:'CJ integration error';
    console.error('CJ products error',message);
    return NextResponse.json({ok:false,error:message},{status:502});
  }
}
