import Link from 'next/link';
import {SpatialStage} from '@/components/spatial-stage';
import {CategoryExhibit,Closing,PartnerExhibit,SectionTop} from '@/components/sections';
import {ExhibitIndex} from '@/components/exhibit-index';
import {catalogue,imageFor,itemHref,quoteHref} from '@/lib/catalogue';
const featuredNames=['COR 50','Abacus 380','Urilyzer 100 Pro','Urilyzer-Cell'];
const featured=featuredNames.flatMap(name=>{
  const item=catalogue.items.find(product=>product.name===name);
  const image=item&&imageFor(item);
  return item&&image?[{title:item.name,description:item.description??item.subcategory,href:itemHref(item),image,meta:item.manufacturer}]:[];
});
export default function Home(){return <>
<SpatialStage variant="home" image="/source/cor-50-framed.png" name="COR 50" descriptor="Wiener Lab / Coagulation">
  <p className="eyebrow">ALFA SCIENTIFIC STORE / SINCE 1985</p>
  <h1>Precision for<br/><em>every discovery.</em></h1>
  <p>Laboratory instruments, reagents and diagnostic solutions for Pakistan.</p>
  <div className="action-row"><Link className="button button-light" href="/product-line">Explore Product Line ↗</Link><Link className="button button-ghost" href={quoteHref()}>Request a Quote</Link></div>
  <a className="chapter-cue" href="#company"><span aria-hidden="true">↓</span> Discover Alfa</a>
</SpatialStage>
<section className="section editorial company-bridge" id="company"><SectionTop left="01 / ABOUT ALFA" right="EST. 1985"/><div className="editorial-grid"><h2>Supporting the<br/><em>work behind</em><br/>every result.</h2><div><p>Alfa Scientific Store supplies laboratory instruments, reagents and consumables to diagnostic and scientific professionals in Pakistan.</p><p>From international manufacturer relationships to technical support, we help laboratories explore products relevant to their work.</p><Link className="text-link" href="/about">Our story ↗</Link></div></div></section>
<section className="section soft-section"><SectionTop left="02 / EXPLORE" right="PRODUCT LINE"/><div className="section-intro"><div><p className="eyebrow">A COMPLETE RANGE</p><h2>Discover by<br/><em>discipline.</em></h2></div><p>From analytical instruments to laboratory consumables, explore the ten branches of Alfa’s product line.</p></div><CategoryExhibit/><div className="section-end"><Link className="text-link" href="/product-line">Explore the full product line ↗</Link></div></section>
<section className="section"><SectionTop left="03 / FEATURED" right="DIAGNOSTIC INSTRUMENTS"/><div className="section-intro"><h2>Instruments for<br/><em>the work ahead.</em></h2><p>Explore selected instruments for coagulation, hematology and urine analysis.</p></div><ExhibitIndex kind="instruments" entries={featured}/></section>
<section className="section partner-section"><SectionTop left="04 / PARTNERS" right="INTERNATIONAL MANUFACTURERS"/><div className="section-intro"><h2>Connected by<br/><em>scientific purpose.</em></h2><p>Explore the manufacturing partners connected to Alfa’s diagnostic and laboratory product range.</p></div><PartnerExhibit/><Link className="text-link" href="/partners">Explore our partners ↗</Link></section>
<section className="section deep-section"><SectionTop left="05 / WHY ALFA" right="SUPPLY & SUPPORT" light/><div className="editorial-grid"><h2>Built around<br/><em>laboratory needs.</em></h2><div><p>From diagnostic instruments and reagents to consumables, Alfa brings together a broad laboratory product range supported by established manufacturer relationships and technical support.</p><Link className="text-link inverted" href="/about">Learn about Alfa ↗</Link></div></div></section>
<section className="section"><SectionTop left="06 / WHO WE SERVE" right="THREE PATHWAYS"/><div className="section-intro"><h2>Different needs.<br/><em>One place to begin.</em></h2></div><div className="audience-grid"><article><span>01</span><h3>Laboratory specialists</h3><p>Explore diagnostic instruments and product information.</p><Link href="/product-line">Explore solutions ↗</Link></article><article><span>02</span><h3>Laboratory owners &amp; dealers</h3><p>Discuss products and make a quotation inquiry.</p><Link href={quoteHref()}>Request a Quote ↗</Link></article><article><span>03</span><h3>International manufacturers</h3><p>Discover a distinct pathway to discuss partnership.</p><Link href="/partners">Explore partnerships ↗</Link></article></div></section><Closing/>
</>}
