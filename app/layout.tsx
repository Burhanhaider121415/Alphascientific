import type { Metadata } from 'next';
import { Header, Footer } from '@/components/shell';
import { WhatsAppLink } from '@/components/whatsapp';
import { BackToTop } from '@/components/back-to-top';
import { ChapterMotion } from '@/components/chapter-motion';
import './globals.css';
import './creative.css';
export const metadata: Metadata = {title:{default:'Alfa Scientific Store',template:'%s | Alfa Scientific Store'},description:'Laboratory instruments, reagents and diagnostic products in Pakistan.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" data-scroll-behavior="smooth"><body><BackToTop/><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}<ChapterMotion/></main><Footer/><WhatsAppLink floating/></body></html>}
