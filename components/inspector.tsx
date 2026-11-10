'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SpatialStage } from './spatial-stage';
import { quoteHref } from '@/lib/catalogue';

export function Inspector() {
  const [model, setModel] = useState(true);
  const [angle, setAngle] = useState(0);
  return (
    <div id="urilyzer-inspection"><SpatialStage variant="inspection" image="/source/urilyzer-cell-framed.webp"
      name="Urilyzer-Cell" descriptor={model ? 'Exterior study' : 'Instrument photograph'} model={model} angle={angle}>
      <p className="eyebrow">ANALYTICON / URINALYSIS</p>
      <h2>Inspect the exterior.</h2>
      <p>Urilyzer-Cell uses automated microscopy and image processing to assess urine sediment.</p>
      <div className="inspect-controls" role="group" aria-label="Product view">
        <button type="button" aria-pressed={model} onClick={() => setModel(true)}>Exterior study</button>
        <button type="button" aria-pressed={!model} onClick={() => setModel(false)}>Instrument photo</button>
      </div>
      <div className="inspect-turn" role="group" aria-label="Exterior viewing angle">
        <button type="button" aria-label="Turn left" disabled={!model} onClick={() => setAngle(-.58)}>Left</button>
        <button type="button" aria-label="Centre view" disabled={!model} onClick={() => setAngle(.30)}>Front</button>
        <button type="button" aria-label="Turn right" disabled={!model} onClick={() => setAngle(.90)}>Right</button>
        <span>Or drag to turn</span>
      </div>
      <p className="inspect-note">The exterior study highlights the pipetting recess and lower waste bin. View the instrument photo for surface details.</p>
      <Link className="text-link inverted" href={quoteHref('Urilyzer-Cell')}>Request a quote ↗</Link>
    </SpatialStage></div>
  );
}
