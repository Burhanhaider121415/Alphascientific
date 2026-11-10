import Link from 'next/link';
import {categories,categoryArtwork,categoryDescriptions,partners,quoteHref,imageFor,itemHref} from '@/lib/catalogue';
import {ExhibitIndex} from './exhibit-index';
import type {CatalogueItem} from '@/content/catalogue/schema';
export function SectionTop({left,right='',light=false}:{left:string;right?:string;light?:boolean}){return <div className={`section-top ${light?'light':''}`}><span>{left}</span><span>{right}</span></div>}
export function SectionHeading({eyebrow,title,children}:{eyebrow?:string;title:React.ReactNode;children?:React.ReactNode}){return <div className="heading-block">{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children&&<div className="heading-copy">{children}</div>}</div>}
export function CategoryExhibit() {
  return <ExhibitIndex kind="categories" entries={categories.map(({id,name})=>({
    title:name, description:categoryDescriptions[id], href:`/product-line/${id}`, image:categoryArtwork[id]
  }))}/>;
}
export function PartnerExhibit() {
  return <ExhibitIndex kind="makers" entries={partners.map(partner=>({
    title:partner.name, description:partner.description, href:`/product-line/${partner.categories[0]}`, image:partner.image
  }))}/>;
}
export function ProductCard({item}:{item:CatalogueItem}){const image=imageFor(item);return <Link href={itemHref(item)} className={`product-card ${image?'':'text-only'}`}>{image&&<div className="product-card-image"><img src={image} alt="" loading="lazy"/></div>}<div className="product-meta">{item.manufacturer??item.kind}</div><div className="product-title"><h3>{item.name}</h3><span aria-hidden="true">↗</span></div><p>{item.description??item.subcategory}</p></Link>}
export function Closing({title='Let’s find the right solution together.',product}:{title?:string;product?:string}){return <section className="closing section"><div><p className="eyebrow">START A CONVERSATION</p><h2>{title}</h2></div><div><p>Tell us what your laboratory or business needs, and explore the right route to contact Alfa Scientific.</p><div className="action-row"><Link className="button button-light" href={quoteHref(product)}>Request a Quote ↗</Link><Link className="button button-ghost" href="/contact-us">Contact Us</Link></div></div></section>}
