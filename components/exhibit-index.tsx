'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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
  const [displayed, setDisplayed] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const current = entries[displayed];
  useEffect(() => {
    const next = entries[selected];
    if (selected === displayed || !next) return;
    let cancelled = false;
    const images = next.productImage ? [next.image, next.productImage] : [next.image];
    void Promise.all(images.map(src => {
      const image = new Image();
      image.src = src;
      return image.decode();
    })).catch(() => {
      // The entry and its links must still work if its photo is unavailable.
    }).then(() => {
      if (!cancelled) setDisplayed(selected);
    });
    return () => { cancelled = true; };
  }, [displayed, entries, selected]);
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
      <div className="exhibit-display" ref={panel} data-motion="exhibit" aria-busy={selected !== displayed}>
        <div className="exhibit-sheet" key={current.title}>
          <div className="exhibit-visual" data-crop={current.crop || undefined}>
            {makers ? <>
              <div className="maker-field" aria-hidden="true" />
              <img className="maker-product" src={current.productImage} alt="" loading="lazy" />
              <div className="maker-feature-mark"><img src={current.image} alt="" loading="lazy" /></div>
            </> : <img src={current.image} alt="" loading="lazy" />}
          </div>
          <div className="exhibit-caption">
            <span>{current.meta ?? `${String(displayed + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`}</span>
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
