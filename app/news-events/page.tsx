import {Closing,SectionTop} from '@/components/sections';
import {EditorialArt} from '@/components/editorial-art';
import {NewsList} from '@/components/news-list';
import {newsArticles} from '@/content/editorial';
export const metadata={title:'News & Events'};
export default function News(){return <><section className="page-intro light-intro split-intro editorial-hero news-intro"><div><p className="eyebrow">NEWS &amp; EVENTS</p><h1>Ideas, updates<br/><em>and discoveries.</em></h1><p>A place for Alfa Scientific’s company news, product announcements and event updates.</p></div><EditorialArt/></section><section className="section"><SectionTop left="01 / LATEST" right="NEWS & EVENTS"/><NewsList articles={newsArticles}/></section><Closing/></>}
