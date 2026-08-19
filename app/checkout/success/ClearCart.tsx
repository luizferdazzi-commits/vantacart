'use client';
import {useEffect} from 'react';
export default function ClearCart(){
  useEffect(()=>{
    localStorage.removeItem('vantacart_cart');
    window.dispatchEvent(new Event('vantacart-cart-updated'));
  },[]);
  return null;
}
