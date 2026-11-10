'use client';

import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * .75);
    update();
    window.addEventListener('scroll', update, {passive:true});
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <>
    <span id="top" className="page-top-anchor" tabIndex={-1} />
    <a className="back-to-top" href="#top" hidden={!visible} aria-label="Back to top">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 19V5m-6 6 6-6 6 6" />
      </svg>
    </a>
  </>;
}
