'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

export type Exhibit = {
  title: string;
  description: string;
  href: string;
  image: string;
  meta?: string;
  crop?: boolean;
  range?: { label: string; href: string }[];
  productImage?: string;
};

export function ExhibitIndex({ entries, kind }: { entries: Exhibit[]; kind: 'categories' | 'instruments' | 'makers' }) {
  const [selected, setSelected] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const current = entries[selected];
  if (!current) return null;
  const makers = kind === 'makers';

  function choose(index: number) {
    setSelected(index);
    if (matchMedia('(max-width: 700px)').matches) {
      panel.current?.scrollIntoView({
        block: 'nearest',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }

  return (
    <div className={`exhibit-index exhibit-${kind}`}>
      <ol className="exhibit-list" aria-label={makers ? 'Manufacturers' : 'Catalogue preview'}>
        {entries.map((item, index) => (
          <li key={item.href} className={selected === index ? 'exhibit-active' : undefined}>
            <button type="button" onPointerEnter={event => {
              if (event.pointerType === 'mouse') setSelected(index);
            }} onFocus={() => setSelected(index)} onClick={() => choose(index)} aria-pressed={selected === index}>
              {makers
                ? <span className="maker-list-mark"><img src={item.image} alt="" loading="lazy" /></span>
                : <span className="exhibit-number">{String(index + 1).padStart(2, '0')}</span>}
              <span><strong>{item.title}</strong>{makers && <small>{item.description}</small>}</span>
            </button>
            <Link href={item.href} className="exhibit-arrow" aria-label={`Open ${item.title} product range`}>↗</Link>
          </li>
        ))}
      </ol>
      <div className="exhibit-display" ref={panel} data-motion="exhibit">
        <div className="exhibit-sheet" key={current.title}>
          <div className="exhibit-visual" data-crop={current.crop || undefined}>
            {makers ? <>
              <div className="maker-field" aria-hidden="true" />
              <img className="maker-product" src={current.productImage} alt="" loading="eager" />
              <div className="maker-feature-mark"><img src={current.image} alt="" loading="eager" /></div>
            </> : <img src={current.image} alt="" loading="eager" />}
          </div>
          <div className="exhibit-caption">
            <span>{current.meta ?? `${String(selected + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`}</span>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            {current.range ? <div className="maker-ranges">{current.range.map(range=>
              <Link key={range.href} href={range.href}>{range.label} ↗</Link>
            )}</div> : <Link href={current.href}>View details ↗</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
