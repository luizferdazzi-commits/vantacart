'use client';

import { useEffect, useState } from 'react';

type Lang='pt'|'en';
const CACHE_KEY='vantacart_active_affiliate_campaigns_v5';

export default function ActivePartnerCount({lang}:{lang:Lang}){
  const [count,setCount]=useState<number|null>(null);

  useEffect(()=>{
    let cancelled=false;
    const cachedItems=()=>{
      try{
        const raw=localStorage.getItem(CACHE_KEY);
        const items=raw?JSON.parse(raw):[];
        return Array.isArray(items)?items:[];
      }catch{return []}
    };
    const initial=cachedItems();
    if(initial.length)setCount(initial.length);

    Promise.allSettled([
      fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()),
      fetch('/api/hotmart/offers',{cache:'no-store'}).then(r=>r.json())
    ]).then((results:any[])=>{
      if(cancelled)return;
      const cache=cachedItems();
      const impactOk=results[0]?.status==='fulfilled'&&results[0]?.value?.ok;
      const hotmartOk=results[1]?.status==='fulfilled'&&results[1]?.value?.ok;
      const impact=impactOk
        ? results[0].value.campaigns.filter((x:any)=>x.status==='Active'&&x.trackingLink).length
        : cache.filter((x:any)=>x.network==='impact').length;
      const hotmart=hotmartOk
        ? results[1].value.offers.filter((x:any)=>x.active&&x.hotlink).length
        : cache.filter((x:any)=>x.network==='hotmart').length;
      const total=impact+hotmart;
      if(total>0)setCount(total);
    });

    const timer=window.setInterval(()=>{
      if(cancelled)return;
      const items=cachedItems();
      if(items.length)setCount(items.length);
    },1500);

    return()=>{cancelled=true;window.clearInterval(timer)};
  },[]);

  return <div>
    <b>{count===null?'…':count}</b>
    <span>{lang==='pt'?'parceiros ativos':'active partners'}</span>
  </div>;
}
