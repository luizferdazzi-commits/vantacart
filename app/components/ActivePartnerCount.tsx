'use client';

import { useEffect, useState } from 'react';

type Lang='pt'|'en';

export default function ActivePartnerCount({lang}:{lang:Lang}){
  const [count,setCount]=useState<number|null>(null);

  useEffect(()=>{
    let cancelled=false;
    Promise.allSettled([
      fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()),
      fetch('/api/hotmart/offers',{cache:'no-store'}).then(r=>r.json()),
    ]).then(results=>{
      if(cancelled)return;
      const impact=results[0].status==='fulfilled'&&results[0].value?.ok
        ? results[0].value.campaigns.filter((c:any)=>c.status==='Active'&&c.trackingLink).length
        : 0;
      const hotmart=results[1].status==='fulfilled'&&results[1].value?.ok
        ? results[1].value.offers.filter((o:any)=>o.active&&o.hotlink).length
        : 0;
      setCount(impact+hotmart);
    }).catch(()=>{if(!cancelled)setCount(null)});
    return()=>{cancelled=true};
  },[]);

  return <div>
    <b>{count===null?'—':count}</b>
    <span>{lang==='pt'?'parceiros ativos':'active partners'}</span>
  </div>;
}
