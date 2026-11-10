/** Stage 02 content contract; no external CMS or runtime behavior is assumed. */
export type Source = { document: string; page: number; note?: string };
export type ImageRole = 'product-draft' | 'category-editorial' | 'cinematic-still' | 'concept' | 'logo' | 'people-editorial';
export type Media = { id: string; filename: string; role: ImageRole; status: string; intendedFor: string; sources: Source[] };
export type Branch = { id: string; label: string; children?: Branch[]; note?: string };
export type Category = { id: string; name: string; kind: 'primary' | 'supplemental'; tree: Branch[]; sources: Source[] };
export type CatalogueItem = {
  id: string; name: string; categoryId: string | null; subcategory: string; kind: 'instrument' | 'reagent' | 'test' | 'control' | 'consumable' | 'media' | 'family';
  manufacturer?: string; description?: string; specifications?: string[]; variants?: string[]; mediaIds?: string[];
  source: Source; downloads?: { label: string; path: string; source: Source }[]; relatedItemIds?: string[]; routeSlug?: string; verification?: string; inquiryContext: { product: string; categoryId: string | null };
};
export type Catalogue = { categories: Category[]; manufacturers: { id: string; name: string; sources: Source[] }[]; media: Media[]; items: CatalogueItem[] };
