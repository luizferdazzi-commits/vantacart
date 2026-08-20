'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
type Product={id:string;name:string;price:number;image?:string|null;vid?:string;variant?:string};
type CartItem=Product&{qty:number;key?:string};
export default function AddToCartButton({product,buyNow=false}:{product:Product;buyNow?:boolean}){const router=useRouter();const [added,setAdded]=useState(false);function add(){const key=product.vid?`${product.id}:${product.vid}`:product.id;const item={...product,key,qty:1};if(buyNow){localStorage.setItem('vantacart_cart',JSON.stringify([item]));window.dispatchEvent(new Event('vantacart-cart-updated'));router.push('/cart');return;}const raw=localStorage.getItem('vantacart_cart');const cart:CartItem[]=raw?JSON.parse(raw):[];const found=cart.find(i=>(i.key||i.id)===key);if(found)found.qty=Math.max(1,Number(found.qty)||1)+1;else cart.push(item);localStorage.setItem('vantacart_cart',JSON.stringify(cart));window.dispatchEvent(new Event('vantacart-cart-updated'));setAdded(true);}return <button className={buyNow?'buyBtn secondary':'buyBtn'} onClick={add}>{added&&!buyNow?'Added ✓':buyNow?'Buy now':'Add to cart'}</button>}
