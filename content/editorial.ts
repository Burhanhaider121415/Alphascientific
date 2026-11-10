/** Only client-supplied, verified editorial entries belong here. */
export type NewsCategory = 'Company news' | 'Product announcements' | 'Events and exhibitions' | 'Company updates';
export type NewsArticle = {slug:string; title:string; category:NewsCategory; date:string; summary:string; paragraphs:string[]; image?:string; relatedHref?:string};
export type CareerOpening = {title:string; location:string; summary:string};
export const newsArticles:NewsArticle[] = [];
export const careerOpenings:CareerOpening[] = [];
