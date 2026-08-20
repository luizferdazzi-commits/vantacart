import {NextRequest,NextResponse} from 'next/server';

function unauthorized(){
  return new NextResponse('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
}

export function middleware(req:NextRequest){
  if(!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
  if(process.env.VERCEL_ENV!=='production') return NextResponse.next();

  const user=process.env.ADMIN_USERNAME;
  const pass=process.env.ADMIN_PASSWORD;
  if(!user||!pass) return unauthorized();

  const auth=req.headers.get('authorization');
  if(!auth?.startsWith('Basic ')){
    return new NextResponse('Authentication required',{status:401,headers:{'WWW-Authenticate':'Basic realm="VantaCart Admin"','Cache-Control':'no-store'}});
  }
  try{
    const decoded=Buffer.from(auth.slice(6),'base64').toString('utf8');
    const index=decoded.indexOf(':');
    const suppliedUser=index>=0?decoded.slice(0,index):'';
    const suppliedPass=index>=0?decoded.slice(index+1):'';
    if(suppliedUser===user&&suppliedPass===pass) return NextResponse.next();
  }catch{}
  return new NextResponse('Authentication required',{status:401,headers:{'WWW-Authenticate':'Basic realm="VantaCart Admin"','Cache-Control':'no-store'}});
}

export const config={matcher:['/admin/:path*']};
