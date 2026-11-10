# Alfa Scientific Store website

A Next.js / TypeScript / Tailwind website for Alfa Scientific Store. The seven primary pages and product catalogue use content supplied in the project master. The catalogue includes ten client-defined categories and a separate human Clinical Chemistry collection.

## Development

Requires Node.js 20.9 or newer. Install with `npm ci`, run locally with `npm run dev`, check types with `npm run typecheck`, and build with `npm run build`.

`content/catalogue/catalogue.json` contains source-linked records; `content/editorial.ts` contains the intentionally empty news and career collections. Review content and source exceptions before publishing additional records. Do not infer medical product details, stock, manufacturer relationships, prices, job openings, news or delivery success.

## Contact

The inquiry form prepares a message for the visitor's own email application using the public company email supplied in the brochure. It does not send mail or prove delivery. Product and inquiry context are included in the prepared draft. A WhatsApp entry is shown only if `NEXT_PUBLIC_WHATSAPP_NUMBER` is set to a verified international number containing digits only; the sample `.env.example` is intentionally blank. Never commit secrets.

## Source and media

`source-assets/` retains the 22 supplied image files with their actual filenames. `public/assets/` contains WebP display derivatives with matching basenames, produced by resizing and encoding the source files; the original master files remain unchanged. `public/source/` contains equipment images extracted from the client-supplied brochure, and `public/partners/` contains manufacturer marks extracted from that brochure. The source catalogue identifies original paths and image roles. Several generated product images are illustrative and not model-exact; Urilyzer product views use the brochure's actual product photos. Cinematic imagery is a flat illustration, not a 3D model.

No custom-domain DNS settings, WordPress installation, live mail endpoint or automatic submission is configured by this repository.
