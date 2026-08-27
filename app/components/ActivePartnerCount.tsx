'use client';

import { useEffect, useState } from 'react';

type Lang='pt'|'en';

export default function ActivePartnerCount({lang}:{lang:Lang}){
  const [count,setCount]=useState<number|null>(null);

  useEffect(()=>{
    let cancelled=false;
    fetch('/api/partners/count',{cache:'no-store'})
      .then(r=>r.json())
      .then(data=>{if(!cancelled&&data?.ok&&Number.isFinite(data.activePartners))setCount(data.activePartners)})
      .catch(()=>{});
    return()=>{cancelled=true};
  },[]);

  return <div>
    <b>{count===null?'…':count}</b>
    <span>{lang==='pt'?'parceiros ativos':'active partners'}</span>
  </div>;
}
