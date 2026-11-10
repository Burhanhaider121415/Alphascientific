'use client';

import { useState } from 'react';
import { SpatialStage } from './spatial-stage';

export function Inspector() {
  const [view, setView] = useState<'overview' | 'details'>('overview');
  return (
    <SpatialStage variant="inspection" image="/source/urilyzer-cell-framed.png"
      name="Urilyzer-Cell" descriptor={view === 'overview' ? 'Urine sediment analysis' : 'Automated microscopy and image processing'}
      angle={view === 'overview' ? 0 : -10}>
      <p className="eyebrow">ANALYTICON / URINALYSIS</p>
      <h2>A closer look at<br />urine analysis.</h2>
      <p>A cuvette-based system for automated microscopy and image processing in urine sediment analysis.</p>
      <div className="inspect-controls" role="group" aria-label="Product view">
        <button type="button" className={view === 'overview' ? 'selected' : ''} aria-pressed={view === 'overview'} onClick={() => setView('overview')}>Overview</button>
        <button type="button" className={view === 'details' ? 'selected' : ''} aria-pressed={view === 'details'} onClick={() => setView('details')}>How it works</button>
      </div>
      <p className="inspect-note" aria-live="polite">
        {view === 'overview' ? 'An instrument for the urine sediment analysis pathway.' : 'Cuvette-based automatic microscopy and image processing.'}
      </p>
    </SpatialStage>
  );
}
