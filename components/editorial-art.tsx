export function EditorialArt({ variant }: { variant: 'news' | 'contact' }) {
  const news = variant === 'news';
  return (
    <figure className={`editorial-visual art-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 680 560" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`glass-${variant}`} x2="100%" y2="100%">
            <stop stopColor="#ddfff3" stopOpacity=".85" />
            <stop offset=".45" stopColor="#51b59b" stopOpacity=".25" />
            <stop offset="1" stopColor="#07543c" stopOpacity=".52" />
          </linearGradient>
          <pattern id={`grid-${variant}`} width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M38 0H0V38" fill="none" stroke="#93d9c6" strokeOpacity=".21" />
          </pattern>
        </defs>
        <rect width="680" height="560" fill={`url(#grid-${variant})`} />
        <path d="M42 480V74H638V480Z M42 274H638 M340 74V480" fill="none" stroke="#8ddbc4" strokeOpacity=".48" />
        {news ? (
          <g className="art-object" transform="translate(340 276) rotate(-27)">
            <ellipse rx="224" ry="110" fill="none" stroke="#9dedcf" strokeOpacity=".6" />
            <ellipse rx="197" ry="72" fill="none" stroke="#9dedcf" strokeOpacity=".42" />
            <circle r="137" fill="url(#glass-news)" stroke="#b6f5df" strokeWidth="2" />
            <ellipse rx="137" ry="70" fill="none" stroke="#c5fbea" strokeWidth="2" />
            <ellipse rx="61" ry="137" fill="none" stroke="#c5fbea" strokeWidth="2" />
            <circle cx="195" cy="52" r="18" fill="#c6ffee" />
            <circle cx="-178" cy="-62" r="10" fill="#70d6b3" />
          </g>
        ) : (
          <g className="art-object" fill="url(#glass-contact)" stroke="#b2f1dc" strokeWidth="2">
            <path d="M115 340L311 226 567 317 372 432Z M115 340V370L372 463 567 348V317 M372 432V463" />
            <path d="M185 271L325 190 495 250 355 332Z M185 271V300L355 363 495 281V250 M355 332V363" />
            <path d="M254 202L342 150 425 179 337 232Z M254 202V232L337 262 425 209V179 M337 232V262" />
            <path d="M342 110V340" strokeDasharray="5 8" />
          </g>
        )}
        <circle cx="42" cy="74" r="4" fill="#c6ffee" /><circle cx="638" cy="480" r="4" fill="#c6ffee" />
      </svg>
      <figcaption>{news ? 'FIELD NOTES / ALFA SCIENTIFIC' : 'LABORATORY SUPPLY / PAKISTAN'}</figcaption>
    </figure>
  );
}
