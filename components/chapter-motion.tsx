'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ChapterMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = document.querySelectorAll<HTMLElement>('main .section-top, main [data-motion]');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set<HTMLElement>();
    const arrival = new WeakMap<HTMLElement, number>();
    let frame = 0;

    function draw(now: number) {
      frame = 0;
      const viewport = window.innerHeight;
      let animate = false;
      for (const element of active) {
        const news = element.dataset.motion === 'news';
        const bounds = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (viewport - bounds.top) / (viewport + bounds.height)));
        element.style.setProperty('--motion-progress', progress.toFixed(3));
        if (news) {
          const start = arrival.get(element) ?? now;
          arrival.set(element, start);
          const phase = Math.min(1, (now - start) / 2850);
          element.style.setProperty('--news-arrival', phase.toFixed(3));
          animate ||= phase < 1;
        }
      }
      if (animate) schedule();
    }

    const schedule = () => { if (!frame && active.size) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(entries => {
      for (const {target, isIntersecting} of entries) {
        if (!(target instanceof HTMLElement)) continue;
        if (isIntersecting) {
          if (!preference.matches) target.classList.add('chapter-in-view');
          active.add(target);
        } else active.delete(target);
        if (target.dataset.motion === 'news') {
          target.toggleAttribute('data-ambient-visible', isIntersecting);
        }
      }
      schedule();
    }, { rootMargin: '75px' });

    reveal.forEach(element => observer.observe(element));
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    function preferenceChanged() {
      if (!preference.matches) active.forEach(element => element.classList.add('chapter-in-view'));
      schedule();
    }
    preference.addEventListener('change', preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', preferenceChanged);
      for (const element of reveal) {
        element.style.removeProperty('--motion-progress');
        element.removeAttribute('data-ambient-visible');
      }
    };
  }, [pathname]);

  return null;
}
