import type { Metadata } from 'next';
import { Header, Footer } from '@/components/shell';
import { WhatsAppLink } from '@/components/whatsapp';
import './globals.css';
export const metadata: Metadata = {title:{default:'Alfa Scientific Store',template:'%s | Alfa Scientific Store'},description:'Laboratory instruments, reagents and diagnostic products in Pakistan.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><WhatsAppLink floating/></body></html>}
