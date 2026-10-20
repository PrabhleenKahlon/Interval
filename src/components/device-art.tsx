export function Wearable({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 820"
      className={className}
      role="img"
      aria-label="Interval, a space-grey temporary wearable"
    >
      <defs>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f5f7" stopOpacity="0.18" />
          <stop offset="68%" stopColor="#f5f5f7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1c1c1e" />
          <stop offset="22%" stopColor="#8e8e93" />
          <stop offset="50%" stopColor="#3a3a3c" />
          <stop offset="78%" stopColor="#aeaeb2" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>
        <linearGradient id="case" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f5f5f7" />
          <stop offset="12%" stopColor="#d1d1d6" />
          <stop offset="34%" stopColor="#8e8e93" />
          <stop offset="62%" stopColor="#3a3a3c" />
          <stop offset="100%" stopColor="#1d1d1f" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2c" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="320" cy="760" rx="150" ry="22" fill="url(#floor)" />
      <ellipse cx="320" cy="400" rx="132" ry="268" fill="none" stroke="url(#band)" strokeWidth="46" />
      <ellipse cx="320" cy="400" rx="132" ry="268" fill="none" stroke="#f5f5f7" strokeOpacity="0.18" strokeWidth="1.5" />
      <rect x="186" y="214" width="268" height="372" rx="62" fill="#0a0a0a" />
      <rect x="176" y="204" width="288" height="392" rx="68" fill="url(#case)" />
      <rect x="196" y="228" width="248" height="344" rx="48" fill="url(#glass)" />
      <rect x="196" y="228" width="248" height="344" rx="48" fill="url(#inner)" />
      <text
        x="320"
        y="292"
        textAnchor="middle"
        fill="#86868b"
        fontSize="13"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="4"
      >
        INTERVAL
      </text>
      <path
        d="M250 390h34l16-32 26 64 14-32h50"
        fill="none"
        stroke="#f5f5f7"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
      <circle cx="320" cy="500" r="3.5" fill="#f5f5f7" opacity="0.85" />
      <rect x="188" y="214" width="70" height="14" rx="7" fill="#fff" opacity="0.28" />
    </svg>
  );
}

export function MacroArt() {
  return (
    <svg viewBox="0 0 800 800" className="h-full w-full" role="img" aria-label="Close view of the Interval sensor">
      <defs>
        <radialGradient id="macroGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5f5f7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="macroMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c7c7cc" />
          <stop offset="35%" stopColor="#636366" />
          <stop offset="100%" stopColor="#1d1d1f" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#0a0a0a" />
      <circle cx="400" cy="360" r="280" fill="url(#macroGlow)" />
      <rect x="140" y="160" width="520" height="480" rx="80" fill="url(#macroMetal)" />
      <rect x="190" y="210" width="420" height="380" rx="48" fill="#0c0c0d" />
      <circle cx="400" cy="390" r="78" fill="none" stroke="#f5f5f7" strokeOpacity="0.35" strokeWidth="2" />
      <circle cx="400" cy="390" r="8" fill="#f5f5f7" />
      <path d="M250 560h300" stroke="#f5f5f7" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

export function SignalArt() {
  return (
    <svg viewBox="0 0 1200 700" className="h-full w-full" role="img" aria-label="A quiet recovery trace">
      <rect width="1200" height="700" fill="#000" />
      <path
        d="M40 380h180l40-90 50 180 36-120 70 40h160l30-70 44 140 28-80h120l26-50 40 90h216"
        fill="none"
        stroke="#f5f5f7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
      <path
        d="M40 430h1120"
        stroke="#86868b"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

export function HomeArt() {
  return (
    <svg viewBox="0 0 1200 800" className="h-full w-full" role="img" aria-label="A quiet room prepared for the wear window">
      <defs>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f5f5f7" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#1d1d1f" />
      <rect x="760" y="80" width="280" height="420" fill="url(#window)" />
      <rect x="888" y="80" width="8" height="420" fill="#1d1d1f" />
      <rect x="760" y="270" width="280" height="8" fill="#1d1d1f" />
      <rect x="120" y="520" width="420" height="16" rx="8" fill="#3a3a3c" />
      <rect x="180" y="430" width="120" height="90" rx="28" fill="#2c2c2e" />
      <rect x="198" y="448" width="84" height="54" rx="12" fill="#0a0a0a" />
    </svg>
  );
}

export function PhoneArt() {
  return (
    <svg viewBox="0 0 520 860" className="h-full w-full" role="img" aria-label="A review request on the companion phone">
      <rect width="520" height="860" fill="#000" />
      <rect x="70" y="40" width="380" height="780" rx="56" fill="#1d1d1f" />
      <rect x="88" y="58" width="344" height="744" rx="44" fill="#0a0a0a" />
      <text x="260" y="280" textAnchor="middle" fill="#86868b" fontSize="18" fontFamily="ui-sans-serif, system-ui">
        INTERVAL
      </text>
      <text x="260" y="360" textAnchor="middle" fill="#f5f5f7" fontSize="34" fontFamily="ui-sans-serif, system-ui">
        Review
      </text>
      <text x="260" y="404" textAnchor="middle" fill="#f5f5f7" fontSize="34" fontFamily="ui-sans-serif, system-ui">
        requested
      </text>
      <text x="260" y="470" textAnchor="middle" fill="#86868b" fontSize="18" fontFamily="ui-sans-serif, system-ui">
        Not a diagnosis
      </text>
    </svg>
  );
}
