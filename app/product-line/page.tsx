import Link from 'next/link';
import {SpatialStage} from '@/components/spatial-stage';
import {CategoryExhibit,Closing,SectionTop} from '@/components/sections';
export const metadata={title:'Product Line'};
export default function ProductLine(){return <><SpatialStage variant="discovery" image="/source/abacus-380-framed.png" name="Abacus 380" descriptor="Diatron / Hematology" next={{ href: "#categories", label: "Browse categories" }}>
  <p className="eyebrow">PRODUCT LINE / DISCOVERY</p>
  <h1>A world of<br/><em>precision awaits.</em></h1>
  <p>Explore instruments, reagents and consumables by the work they support.</p>
</SpatialStage><section className="section" id="categories"><SectionTop left="01 / PRODUCT LINE" right="TEN DISCIPLINES"/><div className="section-intro" data-motion="handoff"><h2>Find your<br/><em>field of focus.</em></h2><p>Start with a category, explore the product range, and carry your selection into an inquiry.</p></div><CategoryExhibit/></section><section className="section supplement deep-section"><SectionTop left="02 / SUPPLEMENTAL COLLECTION" right="HUMAN CLINICAL CHEMISTRY" light/><div className="editorial-grid"><div><h2>Clinical chemistry,<br/><em>clearly defined.</em></h2></div><div><p>Explore instruments and reagents for human clinical chemistry.</p><Link className="text-link inverted" href="/product-line/clinical-chemistry">View the collection ↗</Link></div></div></section><Closing/></>}
