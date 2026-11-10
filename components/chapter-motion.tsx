'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ChapterMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      'main .section-top, main .editorial-visual, main .careers-image, main .exhibit-display, main .relationship-list'
    );
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('chapter-in-view');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .17 });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
