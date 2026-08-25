import { NextResponse } from 'next/server';
import { getHotmartAccessToken, hotmartConfigured } from '../../../../lib/hotmart';

export const dynamic='force-dynamic';

export async function GET(){
  if(!hotmartConfigured()) return NextResponse.json({ok:false,network:'hotmart',configured:false,error:'Hotmart credentials are not configured'},{status:503});
  try{
    const token=await getHotmartAccessToken();
    return NextResponse.json({ok:true,network:'hotmart',configured:true,authenticated:Boolean(token),tokenType:'Bearer'});
  }catch(error:any){
    return NextResponse.json({ok:false,network:'hotmart',configured:true,authenticated:false,error:error?.message||'Hotmart authentication failed'},{status:502});
  }
}
