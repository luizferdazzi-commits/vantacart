'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ProductEditor({id,price,status}:{id:number;price:number;status:string}){
 const router=useRouter(); const [salePrice,setSalePrice]=useState(price.toFixed(2)); const [state,setState]=useState(status); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('');
 async function save(){setSaving(true);setMsg('');try{const r=await fetch('/api/catalog/products',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({id,salePrice:Number(salePrice),status:state})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Update failed');setMsg(state==='ACTIVE'?'Published':'Saved');router.refresh();}catch(e){setMsg(e instanceof Error?e.message:'Update failed');}finally{setSaving(false);}}
 return <div style={{marginTop:14,display:'grid',gap:8}}><label className="meta">Sale price ($)<input value={salePrice} onChange={e=>setSalePrice(e.target.value)} type="number" min="0" step="0.01" style={{display:'block',width:'100%',padding:10,border:'1px solid #ddd',borderRadius:10,marginTop:5}}/></label><label className="meta">Status<select value={state} onChange={e=>setState(e.target.value)} style={{display:'block',width:'100%',padding:10,border:'1px solid #ddd',borderRadius:10,marginTop:5}}><option value="DRAFT">DRAFT</option><option value="ACTIVE">ACTIVE — publish</option><option value="ARCHIVED">ARCHIVED</option></select></label><button className="btn dark" onClick={save} disabled={saving}>{saving?'Saving…':'Save changes'}</button>{msg&&<div className="meta">{msg}</div>}</div>;
}
