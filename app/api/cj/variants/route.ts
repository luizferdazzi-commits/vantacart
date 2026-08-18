import {NextResponse} from 'next/server';
import {getCjVariants} from '@/lib/cj';
export async function GET(req:Request){try{const pid=new URL(req.url).searchParams.get('pid')?.trim()||'';if(!pid)return NextResponse.json({error:'pid is required'},{status:400});const variants=await getCjVariants(pid);return NextResponse.json({ok:true,variants});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load variants'},{status:500});}}
