'use client';

import { useEffect, useState } from 'react';

type Lang='pt'|'en';
const CACHE_KEY='vantacart_active_affiliate_campaigns_v5';

export default function ActivePartnerCount({lang}:{lang:Lang}){
  const [count,setCount]=useState<number|null>(null);

  useEffect(()=>{
    const readCache=()=>{
      try{
        const cached=localStorage.getItem(CACHE_KEY);
        if(!cached)return null;
        const items=JSON.parse(cached);
        return Array.isArray(items)?items.length:null;
      }catch{return null}
    };
    const cachedCount=readCache();
    if(cachedCount!==null)setCount(cachedCount);

    const onCount=(event:Event)=>{
      const value=(event as CustomEvent<number>).detail;
      if(Number.isFinite(value))setCount(value);
    };
    window.addEventListener('vantacart:campaign-count',onCount as EventListener);

    let cancelled=false;
    Promise.allSettled([
      fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()),
      fetch('/api/hotmart/offers',{cache:'no-store'}).then(r=>r.json()),
    ]).then(results=>{
      if(cancelled)return;
      const impactOk=results[0].status==='fulfilled'&&results[0].value?.ok;
      const hotmartOk=results[1].status==='fulfilled'&&results[1].value?.ok;
      if(!impactOk&&!hotmartOk)return;
      const cached=readCache();
      let cachedItems:any[]=[];
      try{
        const raw=localStorage.getItem(CACHE_KEY);
        if(raw)cachedItems=JSON.parse(raw);
      }catch{}
      const cachedImpact=cachedItems.filter((x:any)=>x.network==='impact').length;
      const cachedHotmart=cachedItems.filter((x:any)=>x.network==='hotmart').length;
      const impact=impactOk?results[0].value.campaigns.filter((x:any)=>x.status==='Active'&&x.trackingLink).length:cachedImpact;
      const hotmart=hotmartOk?results[1].value.offers.filter((x:any)=>x.active&&x.hotlink).length:cachedHotmart;
      setCount(impact+hotmart);
    }).finally(()=>{});

    return()=>{
      cancelled=true;
      window.removeEventListener('vantacart:campaign-count',onCount as EventListener);
    };
  },[]);

  return <div>
    <b>{count===null?'—':count}</b>
    <span>{lang==='pt'?'parceiros ativos':'active partners'}</span>
  </div>;
}
