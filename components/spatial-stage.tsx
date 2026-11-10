'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { mountScene, SceneVariant } from './scene-geometry';

type Props = {
  variant: SceneVariant;
  image?: string;
  name: string;
  descriptor: string;
  children: ReactNode;
  next?: { href: string; label: string };
  model?: boolean;
  angle?: number;
};

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const isPinned = (variant: SceneVariant) => variant === 'home' || variant === 'discovery';
const desktopStage = '(min-width: 861px) and (min-height: 690px)';

export function SpatialStage({ variant, image, name, descriptor, children, next, model = false, angle = 0 }: Props) {
  const chapter = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const settings = useRef({model, angle});
  const refresh = useRef<(resetTurn?: boolean) => void>(() => {});

  useEffect(() => {
    const resetTurn = angle !== settings.current.angle;
    settings.current = {model, angle};
    refresh.current(resetTurn);
  }, [model, angle]);

  useEffect(() => {
    const section = chapter.current;
    const visual = artwork.current;
    const surface = canvas.current;
    if (!section || !visual || !surface) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointerArea = isPinned(variant) ? visual.parentElement ?? visual : visual;
    const stickyLayout = matchMedia(desktopStage);
    const header = document.querySelector<HTMLElement>('.site-header');
    let scene: ReturnType<typeof mountScene> | undefined;
    let frame = 0;
    let x = 0;
    let y = 0;
    let drag: {id: number; start: number; turn: number} | undefined;
    let turn = 0;
    let cameraX = 0;
    let cameraY = 0;
    let currentModel = 0;
    let currentAngle = 0;
    let visible = true;
    let disposed = false;
    let attempted = false;
    let request = 0;
    let firstDraw = 0;
    let last = 0;

    function draw(now: number) {
      frame = 0;
      if (!section || !visual || !visible) return;
      const headerHeight = header?.offsetHeight ?? 86;
      const bounds = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const pinned = isPinned(variant) && stickyLayout.matches;
      const visualBounds = visual.getBoundingClientRect();
      const available = Math.max(250, bounds.height - (viewport - headerHeight));
      const progress = motion.matches ? 0 : clamp(pinned
        ? (headerHeight - bounds.top) / available
        : variant === 'contact' && stickyLayout.matches
          ? (headerHeight - bounds.top) / Math.min(490, bounds.height * .76)
          : (viewport * .88 - visualBounds.top) / Math.max(430, viewport * .80));
      const drift = Math.sin(progress * Math.PI);
      const elapsed = last ? Math.min(now - last, 34) : 16;
      const blend = 1 - Math.exp(-elapsed / 70);
      last = now;
      cameraX += (x - cameraX) * blend;
      cameraY += (y - cameraY) * blend;
      currentModel += ((settings.current.model && scene ? 1 : 0) - currentModel) * blend;
      currentAngle += (settings.current.angle + turn - currentAngle) * blend;
      if (!firstDraw && scene) firstDraw = now;
      const entrance = firstDraw ? clamp((now - firstDraw) / 1450) : 1;
      const direction = variant === 'discovery' ? 1 : -1;
      const distance = Math.min(visualBounds.width * .22, 150);
      const lift = Math.min(visualBounds.height * .24, 135);
      visual.style.setProperty('--progress', progress.toFixed(3));
      section.style.setProperty('--chapter-progress', progress.toFixed(3));
      visual.style.setProperty('--equipment-x', `${direction * (drift * distance + progress * 14) + cameraX * 20}px`);
      visual.style.setProperty('--equipment-y', `${progress * -lift + cameraY * 13}px`);
      visual.style.setProperty('--equipment-scale', String(1 + drift * .18 - progress * .16));
      visual.style.setProperty('--equipment-angle', `${direction * (drift * 19 + progress * 7) + cameraX * 11}deg`);
      visual.style.setProperty('--graphic-angle', `${progress * 93 + cameraX * 16}deg`);
      visual.style.setProperty('--model-mix', (motion.matches ? 0 : currentModel).toFixed(3));
      visual.dataset.step = progress >= .74 ? '3' : progress >= .26 ? '2' : '1';
      if (scene?.draw({progress, x:cameraX, y:cameraY, entrance, model:currentModel, angle:currentAngle})) {
        visual.dataset.geometry = 'active';
      }
      if (!motion.matches && (entrance < 1 || Math.abs(x - cameraX) + Math.abs(y - cameraY) > .008 ||
        Math.abs((settings.current.model && scene ? 1 : 0) - currentModel) > .008 ||
        Math.abs(settings.current.angle + turn - currentAngle) > .008)) schedule();
    }

    function schedule() { if (!frame && visible) frame = requestAnimationFrame(draw); }
    const move = (event: PointerEvent) => {
      if (motion.matches) return;
      if (drag?.id === event.pointerId) {
        turn = clamp(drag.turn + (event.clientX - drag.start) * .006, -.60, .60);
        schedule();
      }
      if (event.pointerType !== 'mouse') return;
      const bounds = pointerArea.getBoundingClientRect();
      x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
      schedule();
    };
    const startDrag = (event: PointerEvent) => {
      if (!settings.current.model || !scene || motion.matches || !event.isPrimary || event.button !== 0) return;
      drag = {id:event.pointerId, start:event.clientX, turn};
      visual.setPointerCapture(event.pointerId);
    };
    const stopDrag = () => { drag = undefined; };
    const reset = () => { x = 0; y = 0; schedule(); };
    const loadScene = () => {
      if (attempted || motion.matches || !visible) return;
      attempted = true;
      const version = ++request;
      void import('./scene-geometry').then(({mountScene}) => {
        if (disposed || motion.matches || version !== request) return;
        try {
          scene = mountScene(surface, variant);
          firstDraw = 0;
          schedule();
        } catch {
          visual.dataset.geometry = 'fallback';
        }
      }).catch(() => {
        if (!disposed && request === version) visual.dataset.geometry = 'fallback';
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { loadScene(); schedule(); }
    }, { rootMargin: '120px' });
    observer.observe(visual);
    const resize = new ResizeObserver(schedule);
    resize.observe(visual);
    function clearScene() {
      request++;
      scene?.dispose();
      scene = undefined;
      attempted = false;
      currentModel = 0;
    }
    const contextLost = (event: Event) => {
      event.preventDefault();
      clearScene();
      visual.dataset.geometry = 'fallback';
      schedule();
    };
    function preferenceChanged() {
      reset();
      if (motion.matches) {
        clearScene();
        if (visual) delete visual.dataset.geometry;
        visual?.style.setProperty('--model-mix', '0');
      } else loadScene();
    }
    refresh.current = (resetTurn = false) => {
      if (resetTurn) turn = 0;
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    pointerArea.addEventListener('pointermove', move);
    pointerArea.addEventListener('pointerleave', reset);
    visual.addEventListener('pointerdown', startDrag);
    visual.addEventListener('pointerup', stopDrag);
    visual.addEventListener('pointercancel', stopDrag);
    surface.addEventListener('webglcontextlost', contextLost);
    surface.addEventListener('webglcontextrestored', loadScene);
    motion.addEventListener('change', preferenceChanged);
    schedule();

    return () => {
      disposed = true;
      refresh.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      pointerArea.removeEventListener('pointermove', move);
      pointerArea.removeEventListener('pointerleave', reset);
      visual.removeEventListener('pointerdown', startDrag);
      visual.removeEventListener('pointerup', stopDrag);
      visual.removeEventListener('pointercancel', stopDrag);
      surface.removeEventListener('webglcontextlost', contextLost);
      surface.removeEventListener('webglcontextrestored', loadScene);
      motion.removeEventListener('change', preferenceChanged);
      clearScene();
    };
  }, [variant]);

  function startChapter() {
    const section = chapter.current;
    const visual = artwork.current;
    if (!section || !visual || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86;
    const pinned = matchMedia(desktopStage).matches;
    const bounds = section.getBoundingClientRect();
    const target = pinned
      ? window.scrollY + bounds.top - headerHeight + (bounds.height - window.innerHeight + headerHeight) * .54
      : window.scrollY + visual.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({top: target, behavior: 'smooth'});
  }

  return (
    <section className={`spatial-chapter spatial-${variant}`} ref={chapter} data-signature={variant}>
      <div className="spatial-frame">
        <div className="spatial-copy">
          {children}
          {next && <div className="stage-path">
            <button className="chapter-cue" type="button" onClick={startChapter}><span aria-hidden="true">↓</span> Explore {name}</button>
            <a className="stage-next" href={next.href}>{next.label} ↗</a>
          </div>}
        </div>
        <div className="equipment-stage" ref={artwork} data-stage={variant} data-inspect={model || undefined}>
          <div className="equipment-grid" aria-hidden="true" />
          <div className="equipment-reticle" aria-hidden="true" />
          <div className="equipment-scan" aria-hidden="true" />
          <canvas ref={canvas} aria-hidden="true" />
          {image && <div className="equipment-lift"><img src={image} alt={name} fetchPriority={isPinned(variant) ? 'high' : 'auto'} /></div>}
          {next && <div className="equipment-sequence" aria-hidden="true">
            <span>01 &nbsp; Approach</span><span>02 &nbsp; Focus</span><span>03 &nbsp; Explore</span>
          </div>}
          <div className="equipment-caption">
            <strong>{name}</strong><span>{descriptor}</span>
            {model && <span className="equipment-fallback-label">Instrument photograph</span>}
          </div>
          <span className="equipment-scale" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
