'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function SaveDraftButton(props:{cjProductId:string;name:string;imageUrl?:string;cost:number;price:number}){
  const [state,setState]=useState<'idle'|'saving'|'error'>('idle');
  const router=useRouter();
  async function save(){
    setState('saving');
    const res=await fetch('/api/catalog/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(props)});
    if(!res.ok){setState('error');return;}
    router.push('/admin/products');
    router.refresh();
  }
  return <button className="btn dark" onClick={save} disabled={state==='saving'}>{state==='saving'?'Saving…':state==='error'?'Try again':'Save to Catalog'}</button>;
}
