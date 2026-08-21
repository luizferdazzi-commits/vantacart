import {NextResponse} from 'next/server';
import {getCjBalance} from '../../../../lib/cj';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
  try{return NextResponse.json({ok:true,balance:await getCjBalance()});}
  catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:String(e)},{status:500});}
}
