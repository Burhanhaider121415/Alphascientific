'use client';

import { useEffect, useRef } from 'react';
import type { mountLaboratoryStudy } from './laboratory-study';

export function CompanyVisual() {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = frame.current;
    const surface = canvas.current;
    if (!element || !surface) return;

    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let study: ReturnType<typeof mountLaboratoryStudy> | undefined;
    let visible = false;
    let requested = false;
    let disposed = false;
    let pendingFrame = 0;

    function draw() {
      pendingFrame = 0;
      if (!study || !element || !visible) return;
      const bounds = element.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
      if (study.draw(progress, preference.matches)) element.dataset.rendered = 'true';
    }

    const schedule = () => {
      if (visible && study && !pendingFrame) pendingFrame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !requested) {
        requested = true;
        void import('./laboratory-study').then(({ mountLaboratoryStudy }) => {
          if (disposed) return;
          study = mountLaboratoryStudy(surface);
          schedule();
        }).catch(() => {
          // Keep the CSS illustration when WebGL is unavailable.
        });
      }
      schedule();
    }, { rootMargin: '90px' });
    const resize = new ResizeObserver(schedule);

    function lostContext() {
      delete element?.dataset.rendered;
    }

    observer.observe(element);
    resize.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    surface.addEventListener('webglcontextlost', lostContext);
    surface.addEventListener('webglcontextrestored', schedule);
    return () => {
      disposed = true;
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(pendingFrame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      surface.removeEventListener('webglcontextlost', lostContext);
      surface.removeEventListener('webglcontextrestored', schedule);
      study?.dispose();
      delete element.dataset.rendered;
    };
  }, []);

  return (
    <div className="company-visual" ref={frame} aria-hidden="true">
      <div className="company-visual-fallback"><span /></div>
      <canvas ref={canvas} />
    </div>
  );
}
