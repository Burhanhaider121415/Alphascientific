'use client';
import Link from 'next/link';
import {useState} from 'react';
export function MobileMenu({items}:{items:string[][]}){const [open,setOpen]=useState(false);return <div className="mobile-menu"><button type="button" className="menu-trigger" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'} <span aria-hidden="true">{open?'×':'☰'}</span></button>{open&&<nav id="mobile-navigation" aria-label="Mobile navigation">{items.map(([label,url])=><Link key={url} href={url} onClick={()=>setOpen(false)}>{label}<span aria-hidden="true">↗</span></Link>)}<Link href="/contact-us?type=product" onClick={()=>setOpen(false)}>Request a Quote ↗</Link></nav>}</div>}
