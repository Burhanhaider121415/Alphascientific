import Link from 'next/link';
import {notFound} from 'next/navigation';
import {newsArticles} from '@/content/editorial';
import {Closing} from '@/components/sections';
export function generateStaticParams(){return newsArticles.map(a=>({slug:a.slug}))}
export default async function Article({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=newsArticles.find(a=>a.slug===slug);if(!article)notFound();return <><article><header className="page-intro light-intro"><p className="eyebrow">{article.category} / {article.date}</p><h1>{article.title}</h1><p>{article.summary}</p></header>{article.image&&<div className="editorial-image"><img src={article.image} alt=""/></div>}<div className="section article-body">{article.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}{article.relatedHref&&<Link className="text-link" href={article.relatedHref}>Explore related information ↗</Link>}</div></article><Closing/></>}
