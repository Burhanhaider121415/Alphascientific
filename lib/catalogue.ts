import raw from '@/content/catalogue/catalogue.json';
import type { Catalogue, CatalogueItem, Category } from '@/content/catalogue/schema';

export const catalogue = raw as unknown as Catalogue;
export const categories = catalogue.categories.filter(c => c.kind === 'primary');
export const clinicalChemistry = catalogue.categories.find(c => c.id === 'clinical-chemistry')!;
export const partners = [
  {name:'Wiener Lab', image:'/partners/wiener-lab.png', categories:['coagulation','clinical-chemistry'], description:'Coagulation and clinical chemistry'},
  {name:'Diatron', image:'/partners/diatron.png', categories:['hematology'], description:'Hematology'},
  {name:'BioCheck', image:'/partners/biocheck.png', categories:['ict'], description:'Rapid diagnostic tests'},
  {name:'Analyticon', image:'/partners/analyticon.png', categories:['urinalysis'], description:'Urinalysis'},
  {name:'Arena BioScien', image:'/partners/arena-bioscien.png', categories:['microbial-culture-media'], description:'Microbial culture media'},
  {name:'Chaoran Medical', image:'/partners/chaoran.png', categories:['blood-collection'], description:'Blood collection'},
];
export const categoryArtwork: Record<string,string> = {
 animal:'/assets/ALFA_17_ANIMAL_CHEMISTRY_EDITORIAL_DRAFT_cleaned.webp', coagulation:'/source/cor-50.png', hematology:'/source/abacus-380.png', immunology:'/assets/ALFA_16_IMMUNOLOGY_ASSAY_CATEGORY_EDITORIAL_DRAFT_cleaned.webp', urinalysis:'/source/urilyzer-cell.png', esr:'/assets/ALFA_12_ESR_EQUIPMENT_CATEGORY_SOURCE_BASED_DRAFT_cleaned.webp', ict:'/assets/ALFA_13_ICT_BIOCHECK_CATEGORY_SOURCE_BASED_DRAFT_cleaned.webp', 'blood-glucose-monitoring':'/assets/ALFA_11_GLUCOSE_H1-100_CATALOG_CONCEPT_DRAFT_cleaned.webp', 'blood-collection':'/assets/ALFA_14_BLOOD_COLLECTION_TUBES_CHAORAN_CATEGORY_DRAFT_cleaned.webp', 'microbial-culture-media':'/assets/ALFA_15_CULTURE_MEDIA_ARENA_CATEGORY_SOURCE_BASED_DRAFT_cleaned.webp', 'clinical-chemistry':'/assets/ALFA_05_CHEM_CM250_CATALOG_DRAFT_cleaned.webp'
};
export const categoryDescriptions: Record<string,string> = {
 animal:'Chemistry products for the animal diagnostics branch of the supplied catalogue.',
 coagulation:'Instruments and reagents for coagulation testing.', hematology:'Hematology instruments, reagents and controls.',
 immunology:'Explore the immunology instrument category.', urinalysis:'Urine analysis instruments, test strips and controls.',
 esr:'Equipment information for erythrocyte sedimentation testing.', ict:'Rapid diagnostic test families and devices.',
 'blood-glucose-monitoring':'Glucose meter information, including H1-100.', 'blood-collection':'Blood collection products and tube formats.',
 'microbial-culture-media':'Culture media and associated laboratory products.', 'clinical-chemistry':'A separately identified human clinical chemistry collection from the company brochure.'
};
const officialImages: Record<string,string> = {
 'COR 50':'/source/cor-50.png','Abacus 380':'/source/abacus-380.png','Urilyzer 100 Pro':'/source/urilyzer-100-pro.png','Urilyzer 500 Pro':'/source/urilyzer-500-pro.png','Urilyzer-Cell':'/source/urilyzer-cell.png'
};
const uncertain = /Transcribed as printed|unusual spelling or notation/i;
export function isPublic(item: CatalogueItem) { return item.categoryId !== null && !uncertain.test(item.verification ?? ''); }
export function itemsFor(id: string) { return catalogue.items.filter(x => x.categoryId === id && isPublic(x)); }
export function getCategory(id:string): Category | undefined { return catalogue.categories.find(c => c.id===id); }
export function getItem(category:string,id:string) { return catalogue.items.find(x => x.id===id && x.categoryId===category && isPublic(x)); }
export function imageFor(item:CatalogueItem): {src:string; illustrative:boolean}|null {
 if (officialImages[item.name]) return {src:officialImages[item.name],illustrative:false};
 const media=item.mediaIds?.find(id => ['alfa-03','alfa-04','alfa-05','alfa-06','alfa-11'].includes(id));
 if (media) { const asset=catalogue.media.find(entry=>entry.id===media); if(asset)return {src:`/assets/${asset.filename.split('/').pop()?.replace(/\.png$/i,'.webp')}`,illustrative:true}; }
 return null;
}
export function itemHref(item:CatalogueItem) { return `/product-line/${item.categoryId}/${item.id}`; }
export const quoteHref = (product?:string, type='product') => `/contact-us?type=${encodeURIComponent(type)}${product ? `&product=${encodeURIComponent(product)}` : ''}`;
