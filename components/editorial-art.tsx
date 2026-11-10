export function EditorialArt() {
  return (
    <figure className="editorial-visual art-news" data-motion="news">
      <svg aria-hidden="true" viewBox="0 0 680 560" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="news-light">
            <stop stopColor="#448d77" stopOpacity=".76" /><stop offset="1" stopColor="#12372f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="news-grid-fade">
            <stop offset=".44" stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="news-grid-mask"><rect width="680" height="560" fill="url(#news-grid-fade)" /></mask>
          <pattern id="news-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="#b5eed9" strokeOpacity=".17"/>
          </pattern>
        </defs>
        <rect width="680" height="560" fill="url(#news-light)" />
        <rect width="680" height="560" fill="url(#news-grid)" mask="url(#news-grid-mask)" />
        <g transform="translate(345 271)">
          <g className="news-orbits" fill="none" stroke="#b5f7dd">
            <ellipse rx="238" ry="121" strokeOpacity=".57" />
            <ellipse rx="209" ry="88" strokeOpacity=".65" />
            <ellipse rx="175" ry="56" strokeOpacity=".40" />
            <circle cx="216" cy="50" r="9" fill="#cdf7df" />
            <circle cx="-151" cy="-60" r="7" fill="#80cdb1" />
          </g>
          <g className="news-core" fill="none" stroke="#d2fbea" strokeWidth="1.5">
            <circle r="129" fill="#6db49a" fillOpacity=".29"/>
            <ellipse rx="65" ry="129"/>
            <ellipse rx="107" ry="129" strokeOpacity=".45"/>
            <ellipse rx="129" ry="52"/>
            <path d="M-129 0H129 M0 -129V129" strokeOpacity=".5"/>
          </g>
        </g>
        <path d="M63 102V65H100 M580 65H617V102 M63 458V495H100 M580 495H617V458" stroke="#afe6d2" fill="none" strokeOpacity=".7"/>
      </svg>
      <figcaption>FIELD NOTES / ALFA SCIENTIFIC</figcaption>
    </figure>
  );
}
