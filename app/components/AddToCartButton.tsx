'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

type Product={id:string;name:string;price:number;image?:string|null};

type CartItem=Product&{qty:number};

export default function AddToCartButton({product,buyNow=false}:{product:Product;buyNow?:boolean}){
  const router=useRouter();
  const [added,setAdded]=useState(false);
  function add(){
    const raw=localStorage.getItem('vantacart_cart');
    const cart:CartItem[]=raw?JSON.parse(raw):[];
    const found=cart.find(i=>i.id===product.id);
    if(found) found.qty+=1; else cart.push({...product,qty:1});
    localStorage.setItem('vantacart_cart',JSON.stringify(cart));
    window.dispatchEvent(new Event('vantacart-cart-updated'));
    setAdded(true);
    if(buyNow) router.push('/cart');
  }
  return <button className={buyNow?'buyBtn secondary':'buyBtn'} onClick={add}>{added&&!buyNow?'Added ✓':buyNow?'Buy now':'Add to cart'}</button>;
}
