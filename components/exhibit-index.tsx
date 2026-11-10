'use client';

import Link from 'next/link';
import { useState } from 'react';

export type Exhibit = {
  title: string;
  description: string;
  href: string;
  image: string;
  meta?: string;
};

export function ExhibitIndex({ entries, kind }: { entries: Exhibit[]; kind: 'categories' | 'instruments' | 'makers' }) {
  const [selected, setSelected] = useState(0);
  const current = entries[selected];
  if (!current) return null;

  return (
    <div className={`exhibit-index exhibit-${kind}`}>
      <ol className="exhibit-list">
        {entries.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onPointerEnter={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              className={selected === index ? 'exhibit-active' : undefined}
            >
              <span className="exhibit-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
              <span className="exhibit-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="exhibit-display">
        <div className="exhibit-visual" key={current.image}>
          <img src={current.image} alt={kind === 'makers' ? current.title : ''} loading="lazy" />
        </div>
        <div className="exhibit-caption" key={current.title}>
          <span>{current.meta ?? `${String(selected + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`}</span>
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          <Link href={current.href}>{kind === 'makers' ? 'Explore the range' : 'View details'} ↗</Link>
        </div>
      </div>
    </div>
  );
}
