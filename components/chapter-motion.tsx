'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ChapterMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = document.querySelectorAll<HTMLElement>('main .section-top, main [data-motion]');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set<HTMLElement>();
    let frame = 0;

    function draw() {
      frame = 0;
      if (preference.matches) return;
      const viewport = window.innerHeight;
      for (const element of active) {
        if (!element.hasAttribute('data-motion')) continue;
        const bounds = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (viewport - bounds.top) / (viewport + bounds.height)));
        element.style.setProperty('--motion-progress', progress.toFixed(3));
      }
    }

    const schedule = () => { if (!frame && active.size) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(entries => {
      for (const {target, isIntersecting} of entries) {
        if (!(target instanceof HTMLElement)) continue;
        if (isIntersecting) {
          if (!preference.matches) target.classList.add('chapter-in-view');
          active.add(target);
        } else active.delete(target);
      }
      schedule();
    }, { rootMargin: '75px' });

    reveal.forEach(element => observer.observe(element));
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    function preferenceChanged() {
      if (preference.matches) {
        for (const element of reveal) element.style.removeProperty('--motion-progress');
      } else {
        active.forEach(element => element.classList.add('chapter-in-view'));
        schedule();
      }
    }
    preference.addEventListener('change', preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', preferenceChanged);
      for (const element of reveal) element.style.removeProperty('--motion-progress');
    };
  }, [pathname]);

  return null;
}
