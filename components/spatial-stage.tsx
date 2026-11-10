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
  const photograph = useRef<HTMLImageElement>(null);
  const settings = useRef({model, angle});
  const ambientEnabled = variant !== 'inspection';
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
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
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
    let ambientTime = 0;
    let lastAmbientFrame = 0;

    function draw(now: number) {
      frame = 0;
      if (!section || !visual || !visible) return;
      const headerHeight = header?.offsetHeight ?? 86;
      const bounds = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const reduced = preference.matches;
      const pinned = isPinned(variant) && stickyLayout.matches && !reduced;
      const visualBounds = visual.getBoundingClientRect();
      const available = Math.max(250, bounds.height - (viewport - headerHeight));
      const progress = clamp(pinned
        ? (headerHeight - bounds.top) / available
        : stickyLayout.matches && variant !== 'inspection'
          ? (headerHeight - bounds.top) / Math.min(reduced ? 380 : 490, bounds.height * .76)
          : (viewport * .88 - visualBounds.top) / Math.max(430, viewport * .80));
      const drift = Math.sin(progress * Math.PI);
      const elapsed = last ? Math.min(now - last, 34) : 16;
      const blend = 1 - Math.exp(-elapsed / (reduced ? 48 : 70));
      last = now;
      cameraX += (x - cameraX) * blend;
      cameraY += (y - cameraY) * blend;
      currentModel += ((settings.current.model && scene ? 1 : 0) - currentModel) * blend;
      currentAngle += (settings.current.angle + turn - currentAngle) * blend;
      if (!firstDraw) firstDraw = now;
      const entrance = clamp((now - firstDraw) / (reduced ? 2700 : 3400));
      const opening = Math.sin(entrance * Math.PI);
      const runAmbient = ambientEnabled && !document.hidden;
      if (runAmbient && lastAmbientFrame) {
        ambientTime += Math.min(now - lastAmbientFrame, 72);
      }
      lastAmbientFrame = runAmbient ? now : 0;
      const ambient = ambientTime * (Math.PI * 2 / 10400);
      const sweep = Math.sin(ambient);
      const amplitude = reduced ? .34 : 1;
      const direction = variant === 'discovery' ? 1 : -1;
      const distance = Math.min(visualBounds.width * .17, 112);
      const lift = Math.min(visualBounds.height * .20, 116);
      visual.style.setProperty('--progress', progress.toFixed(3));
      section.style.setProperty('--chapter-progress', progress.toFixed(3));
      visual.style.setProperty('--scan-arrival', opening.toFixed(3));
      visual.style.setProperty('--scan-position', String((entrance * .72 + progress * .28) * 100));
      visual.style.setProperty('--idle-scan-offset', `${sweep * (reduced ? 7 : 17)}%`);
      visual.style.setProperty('--idle-scan-opacity', String(ambientEnabled ? (reduced ? .14 : .25) + sweep * .055 : 0));
      visual.style.setProperty('--equipment-x', `${(direction * (drift * distance + progress * 14) + cameraX * 20) * amplitude}px`);
      visual.style.setProperty('--equipment-y', `${(progress * -lift + cameraY * 13 - opening * 12) * amplitude}px`);
      visual.style.setProperty('--equipment-scale', String(1 + (drift * .13 - progress * .14) * amplitude));
      visual.style.setProperty('--equipment-angle', `${(direction * (drift * 19 + progress * 7) + cameraX * 11 + currentAngle * 39) * amplitude}deg`);
      visual.style.setProperty('--graphic-angle', `${progress * 93 + cameraX * 16}deg`);
      visual.style.setProperty('--model-mix', currentModel.toFixed(3));
      visual.dataset.step = progress >= .74 ? '3' : progress >= .26 ? '2' : '1';
      if (scene?.draw({
        progress, x:cameraX * amplitude, y:cameraY * amplitude, entrance,
        model:currentModel, angle:currentAngle, reduced, ambient,
      })) {
        visual.dataset.geometry = 'active';
        if (scene.hasSurface()) visual.dataset.surface = 'depth';
      }
      const settling = Math.abs(x - cameraX) + Math.abs(y - cameraY) > .008 ||
        Math.abs((settings.current.model && scene ? 1 : 0) - currentModel) > .008 ||
        Math.abs(settings.current.angle + turn - currentAngle) > .008;
      if (entrance < 1 || settling || runAmbient) schedule();
    }

    function schedule() { if (!frame && visible) frame = requestAnimationFrame(draw); }
    const move = (event: PointerEvent) => {
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
      if (event.target instanceof Element && event.target.closest('button')) return;
      if ((!settings.current.model && !scene?.hasSurface()) || !scene || !event.isPrimary || event.button !== 0) return;
      drag = {id:event.pointerId, start:event.clientX, turn};
      visual.setPointerCapture(event.pointerId);
    };
    const stopDrag = () => { drag = undefined; };
    const turnByKey = (event: KeyboardEvent) => {
      if (event.target !== visual || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
      event.preventDefault();
      turn = clamp(turn + (event.key === 'ArrowLeft' ? -.12 : .12), -.52, .52);
      schedule();
    };
    const reset = () => { x = 0; y = 0; schedule(); };
    const loadScene = () => {
      if (attempted || !visible) return;
      attempted = true;
      const version = ++request;
      void import('./scene-geometry').then(({mountScene}) => {
        if (disposed || version !== request) return;
        try {
          scene = mountScene(surface, variant, photograph.current, () => {
            firstDraw = 0;
            visual.tabIndex = 0;
            visual.setAttribute('role', 'group');
            visual.setAttribute('aria-label', `${name} spatial view. Drag or use the left and right arrow keys to turn.`);
            schedule();
          });
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
      if (visible) {
        loadScene();
        schedule();
      } else {
        lastAmbientFrame = 0;
        cancelAnimationFrame(frame);
        frame = 0;
      }
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
      delete visual?.dataset.surface;
      visual?.removeAttribute('tabindex');
      visual?.removeAttribute('role');
      visual?.removeAttribute('aria-label');
    }
    const contextLost = (event: Event) => {
      event.preventDefault();
      clearScene();
      visual.dataset.geometry = 'fallback';
      schedule();
    };
    function preferenceChanged() {
      reset();
      loadScene();
    }
    refresh.current = (resetTurn = false) => {
      if (resetTurn) turn = 0;
      schedule();
    };
    function visibilityChanged() {
      lastAmbientFrame = 0;
      if (!document.hidden) schedule();
    }
    document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('scroll', schedule, { passive: true });
    pointerArea.addEventListener('pointermove', move);
    pointerArea.addEventListener('pointerleave', reset);
    visual.addEventListener('pointerdown', startDrag);
    visual.addEventListener('pointerup', stopDrag);
    visual.addEventListener('pointercancel', stopDrag);
    visual.addEventListener('keydown', turnByKey);
    surface.addEventListener('webglcontextlost', contextLost);
    surface.addEventListener('webglcontextrestored', loadScene);
    preference.addEventListener('change', preferenceChanged);
    schedule();

    return () => {
      disposed = true;
      refresh.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
      window.removeEventListener('scroll', schedule);
      pointerArea.removeEventListener('pointermove', move);
      pointerArea.removeEventListener('pointerleave', reset);
      visual.removeEventListener('pointerdown', startDrag);
      visual.removeEventListener('pointerup', stopDrag);
      visual.removeEventListener('pointercancel', stopDrag);
      visual.removeEventListener('keydown', turnByKey);
      surface.removeEventListener('webglcontextlost', contextLost);
      surface.removeEventListener('webglcontextrestored', loadScene);
      preference.removeEventListener('change', preferenceChanged);
      clearScene();
    };
  }, [ambientEnabled, image, name, variant]);

  return (
    <section className={`spatial-chapter spatial-${variant}`} ref={chapter} data-signature={variant}>
      <div className="spatial-frame">
        <div className="spatial-copy">
          {children}
          {next && <div className="stage-path">
            <span className="chapter-cue"><span aria-hidden="true">↓</span> Scroll to explore</span>
            <a className="stage-next" href={next.href}>{next.label} ↗</a>
          </div>}
        </div>
        <div className="equipment-stage" ref={artwork} data-stage={variant} data-inspect={model || undefined}>
          <div className="equipment-grid" aria-hidden="true" />
          <div className="equipment-reticle" aria-hidden="true" />
          <div className="equipment-scan" aria-hidden="true" />
          <canvas ref={canvas} aria-hidden="true" />
          {image && <div className="equipment-lift"><img ref={photograph} src={image} alt={name} fetchPriority={variant !== 'inspection' ? 'high' : 'auto'} /></div>}
          {next && <div className="equipment-sequence" aria-hidden="true">
            <span>01 &nbsp; Approach</span><span>02 &nbsp; Focus</span><span>03 &nbsp; Explore</span>
          </div>}
          <div className="equipment-caption">
            <strong>{name}</strong><span>{descriptor}</span>
            <span className="equipment-drag" aria-hidden="true">Drag to turn</span>
            {model && <span className="equipment-fallback-label">Instrument photograph</span>}
          </div>
          <span className="equipment-scale" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
