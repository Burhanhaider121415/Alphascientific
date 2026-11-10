export function WhatsAppLink({product, floating=false}:{product?:string;floating?:boolean}){
 const number=process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
 if(!number||!/^\d{8,15}$/.test(number))return null;
 const message=product?`Hello, I would like to ask about ${product}.`:'Hello, I would like to contact Alfa Scientific.';
 return <a className={floating?'whatsapp-float':'text-link'} href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label={product?`Ask about ${product} on WhatsApp`:'Contact Alfa Scientific on WhatsApp'}>WhatsApp <span aria-hidden="true">↗</span></a>
}
