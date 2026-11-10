'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { mountScene } from './scene-geometry';

type Props = {
  variant: 'home' | 'discovery' | 'inspection';
  image: string;
  name: string;
  descriptor: string;
  children: ReactNode;
  angle?: number;
};

export function SpatialStage({ variant, image, name, descriptor, children, angle = 0 }: Props) {
  const chapter = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = chapter.current;
    const visual = artwork.current;
    const surface = canvas.current;
    if (!section || !visual || !surface) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const stickyLayout = matchMedia('(min-width: 861px) and (min-height: 690px)');
    let scene: ReturnType<typeof mountScene> | undefined;
    let frame = 0;
    let x = 0;
    let y = 0;
    let visible = true;
    let disposed = false;
    let attempted = false;

    function draw() {
      frame = 0;
      if (!section || !visual || !visible) return;
      const bounds = section.getBoundingClientRect();
      const pinned = variant !== 'inspection' && stickyLayout.matches;
      const progress = motion.matches ? 0 : Math.min(1, Math.max(0,
        pinned ? (86 - bounds.top) / Math.max(240, bounds.height - (window.innerHeight - 86))
          : (window.innerHeight * .73 - bounds.top) / Math.max(430, bounds.height)
      ));
      const direction = variant === 'discovery' ? -1 : 1;
      visual.style.setProperty('--progress', progress.toFixed(3));
      visual.style.setProperty('--equipment-x', `${direction * (progress * 34 + x * 18)}px`);
      visual.style.setProperty('--equipment-y', `${progress * -72 + y * 14}px`);
      visual.style.setProperty('--equipment-scale', String(1 + progress * .14));
      visual.style.setProperty('--equipment-angle', `${direction * (progress * 12 + x * 8)}deg`);
      visual.style.setProperty('--graphic-angle', `${progress * 62 + x * 10}deg`);
      scene?.draw(progress, x, y);
    }

    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(draw); };
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== 'mouse') return;
      const bounds = visual.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      schedule();
    };
    const reset = () => { x = 0; y = 0; schedule(); };
    const loadScene = () => {
      if (attempted || motion.matches || !visible) return;
      attempted = true;
      void import('./scene-geometry').then(({ mountScene }) => {
        if (disposed || motion.matches) { attempted = false; return; }
        try {
          scene = mountScene(surface, variant);
          visual.dataset.geometry = 'active';
          schedule();
        } catch {
          visual.dataset.geometry = 'fallback';
        }
      }).catch(() => { visual.dataset.geometry = 'fallback'; });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { loadScene(); schedule(); }
    }, { rootMargin: '100px' });
    observer.observe(section);
    const resize = new ResizeObserver(schedule);
    resize.observe(visual);
    function preferenceChanged() {
      reset();
      if (motion.matches) {
        scene?.dispose();
        scene = undefined;
        attempted = false;
        delete visual?.dataset.geometry;
      } else loadScene();
    }
    window.addEventListener('scroll', schedule, { passive: true });
    visual.addEventListener('pointermove', move);
    visual.addEventListener('pointerleave', reset);
    motion.addEventListener('change', preferenceChanged);
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      visual.removeEventListener('pointermove', move);
      visual.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', preferenceChanged);
      scene?.dispose();
    };
  }, [variant]);

  return (
    <section className={`spatial-chapter spatial-${variant}`} ref={chapter} data-signature={variant}>
      <div className="spatial-frame">
        <div className="spatial-copy">{children}</div>
        <div className="equipment-stage" ref={artwork} data-stage={variant} style={{ '--view-angle': `${angle}deg` } as CSSProperties}>
          <div className="equipment-grid" aria-hidden="true" />
          <div className="equipment-reticle" aria-hidden="true" />
          <canvas ref={canvas} aria-hidden="true" />
          <div className="equipment-lift"><img src={image} alt={name} fetchPriority={variant === 'inspection' ? 'auto' : 'high'} /></div>
          <div className="equipment-caption"><strong>{name}</strong><span>{descriptor}</span></div>
          <span className="equipment-scale" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
