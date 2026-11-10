'use client';
import {useEffect,useRef} from 'react';
export function SpatialStage({image,mode='hero',label}:{image:string;mode?:'hero'|'discovery';label:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=ref.current;if(!node)return;const container=node.parentElement;if(!container)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)');let frame=0, x=0;
  const draw=()=>{frame=0;if(reduce.matches){node.style.removeProperty('--x');node.style.removeProperty('--y');node.style.removeProperty('--discovery-scale');return}const rect=node.getBoundingClientRect();node.style.setProperty('--x',`${x}px`);node.style.setProperty('--y',`${Math.max(-18,Math.min(18,-rect.top*.035))}px`);const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height)));node.style.setProperty('--discovery-scale',String(1.08-progress*.08))};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw)};
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const r=node.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*18;schedule()};
  const leave=()=>{x=0;schedule()};container.addEventListener('pointermove',move);container.addEventListener('pointerleave',leave);window.addEventListener('scroll',schedule,{passive:true});reduce.addEventListener('change',schedule);schedule();return()=>{container.removeEventListener('pointermove',move);container.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',schedule);reduce.removeEventListener('change',schedule);cancelAnimationFrame(frame)};
 },[]);
 return <div className={`spatial-stage ${mode}`} ref={ref} aria-label={label} role="img"><div className="spatial-photo" style={{backgroundImage:`url(${image})`}}/><div className="stage-ring one"/><div className="stage-ring two"/></div>
}
