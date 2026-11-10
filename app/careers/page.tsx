import Link from 'next/link';
import {Closing,SectionTop} from '@/components/sections';
import {careerOpenings} from '@/content/editorial';
export const metadata={title:'Careers'};
export default function Careers(){return <><section className="careers-intro editorial-green"><div className="careers-copy"><p className="eyebrow">CAREERS / ALFA SCIENTIFIC</p><h1>Work close to<br/><em>discovery.</em></h1><p>Explore opportunities connected to laboratory diagnostics, scientific instruments and technical support.</p></div><div className="careers-image" data-motion="portrait"><img src="/assets/ALFA_22_CAREERS_SCIENTIFIC_WORKPLACE_EDITORIAL_DRAFT_cleaned.webp" alt="Laboratory professionals collaborating"/></div></section><section className="section"><SectionTop left="01 / WORKING IN SCIENTIFIC SUPPLY" right="CAREERS"/><div className="editorial-grid"><h2>Supporting the<br/><em>science of tomorrow.</em></h2><div><p>Scientific supply connects diagnostic laboratories with instruments, reagents, consumables and the technical support that helps them do their work.</p></div></div></section><section className="section careers-opportunities" data-motion="opportunities">
  <SectionTop left="02 / CAREERS" right="CURRENT OPENINGS"/>
  <div className="opportunity-layout">
    <h2>Opportunities.</h2>
    {careerOpenings.length?<div className="opening-list">{careerOpenings.map(job=><article key={`${job.title}:${job.location}`}><h3>{job.title}</h3><p>{job.location} · {job.summary}</p><Link className="text-link" href={`/contact-us?type=careers&product=${encodeURIComponent(job.title)}#inquiry`}>Inquire about this opportunity ↗</Link></article>)}</div>:
      <div className="opportunity-card">
        <p className="opportunity-status"><span aria-hidden="true"/>No current openings</p>
        <p>For general questions about careers at Alfa Scientific, use the careers inquiry form.</p>
        <Link className="button button-dark" href="/contact-us?type=careers#inquiry">Careers inquiries ↗</Link>
      </div>}
  </div>
</section><Closing/></>}
