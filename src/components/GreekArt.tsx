/** Public asset URLs must respect the configured Vite `base`. */
const MEANDER_URL = `${import.meta.env.BASE_URL}meander.svg`;

const meanderStyle = (height: number): React.CSSProperties => ({
  backgroundImage: `url('${MEANDER_URL}')`,
  backgroundRepeat: 'repeat-x',
  backgroundSize: `auto ${height}px`,
  backgroundPosition: 'center',
});

export const MarbleDivider = () => (
  <div
    aria-hidden="true"
    className="w-full overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950 border-t border-stone-200 dark:border-stone-800"
  >
    <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-center gap-4">
      <div className="flex-1 h-[6px] opacity-70" style={meanderStyle(6)} />
      <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0 text-amber-600 dark:text-amber-500">
        <path fill="currentColor" d="M12 2.2 14.6 8l6.2.6-4.7 4.2 1.4 6.1L12 15.6 6.5 18.9l1.4-6.1L3.2 8.6 9.4 8z" />
      </svg>
      <div className="flex-1 h-[6px] opacity-70" style={meanderStyle(6)} />
    </div>
  </div>
);

export const MeanderBand = ({ className = '' }: { className?: string }) => (
  <div aria-hidden="true" className={`w-full h-[10px] ${className}`} style={meanderStyle(10)} />
);

export const GreekKeyDivider = () => (
  <div aria-hidden="true" className="flex items-center gap-3 justify-center my-4">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-stone-400 dark:via-stone-700 dark:to-stone-600" />
    <svg width="14" height="14" viewBox="0 0 24 24" className="text-amber-600 dark:text-amber-500 shrink-0">
      <path fill="currentColor" d="M12 2.5 14.4 8.4 20.5 9l-4.4 4.1 1.1 6.1L12 16.3 6.8 19.2l1.1-6.1L3.5 9l6.1-.6z" />
    </svg>
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-300 to-stone-400 dark:via-stone-700 dark:to-stone-600" />
  </div>
);

export const LaurelBranch = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} aria-hidden="true">
    <path d="M6 34 Q60 4 114 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {[
      [16, 28, -32],
      [28, 22, -26],
      [42, 16, -22],
      [58, 12, -16],
      [74, 13, 16],
      [88, 18, 22],
      [102, 25, 28],
    ].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx="7" ry="3.4" transform={`rotate(${r} ${x} ${y})`} fill="currentColor" opacity="0.85" />
    ))}
    <circle cx="60" cy="10" r="3" fill="currentColor" />
    <circle cx="52" cy="14" r="2.2" fill="currentColor" opacity="0.8" />
    <circle cx="68" cy="14" r="2.2" fill="currentColor" opacity="0.8" />
  </svg>
);

export const OwlOfAthena = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 5c-3 0-5 1.2-6 2.4-2-1.2-4-2.4-7-2.4 0 4 1.2 7 3.2 9-3 2-5 5-6 9-2 8 1 15.6 7 18.6 3.4 1.8 5.6 1 8.8 1s5.4.8 8.8-1c6-3 9-10.6 7-18.6-1-4-3-7-6-9 2-2 3.2-5 3.2-9-3 0-5 1.2-7 2.4C29 6.2 27 5 24 5z" />
    <circle cx="17.5" cy="22" r="5" />
    <circle cx="30.5" cy="22" r="5" />
    <circle cx="17.5" cy="22" r="1.6" fill="currentColor" />
    <circle cx="30.5" cy="22" r="1.6" fill="currentColor" />
    <path d="M24 26.5 27.5 30 24 33 20.5 30z" />
    <path d="M15 39.5 24 35l9 4.5" />
    <path d="M19 42 24 39l5 3" />
  </svg>
);

export const LaurelCrown = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
    <path d="M8 34 Q32 6 56 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {[12, 20, 28, 36, 44, 52].map((x, i) => {
      const y = 34 - Math.abs(x - 32) * 0.62;
      return <ellipse key={x} cx={x} cy={y} rx="6" ry="3" transform={`rotate(${i < 3 ? -34 : 34} ${x} ${y})`} fill="currentColor" opacity="0.85" />;
    })}
    <circle cx="32" cy="9" r="2.6" fill="currentColor" />
  </svg>
);

export const Amphora = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 64" className={className} aria-hidden="true">
    <path fill="currentColor" d="M18 4h12v6c0 4 6 6 8 12 3 9 3 22-2 30-2 4-6 6-12 6s-10-2-12-6c-5-8-5-21-2-30 2-6 8-8 8-12z" opacity="0.9" />
    <path fill="#0b1f2a" d="M18 10h12v3H18z" />
    <g stroke="#0b1f2a" strokeWidth="1.5" fill="none" opacity="0.8">
      <path d="M11 26h26" />
      <path d="M10 32c4-3 8 3 12 0s8 3 12 0" />
      <path d="M10 40c4-3 8 3 12 0s8 3 12 0" />
      <path d="M13 48c3-2 6 2 9 0s6 2 9 0" />
    </g>
  </svg>
);

export const AcropolisScene = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 640 200" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="asAegSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="currentColor" stopOpacity="0.02" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id="asAegStone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="currentColor" stopOpacity="0.85" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="640" height="200" fill="url(#asAegSky)" />

    {/* distant hills */}
    <path d="M0 132 Q90 100 170 126 T340 118 T520 128 T640 112 V200 H0 Z" fill="currentColor" opacity="0.12" />
    {/* the sea */}
    <path d="M0 152 Q120 148 240 153 T480 150 T640 154 V200 H0 Z" fill="currentColor" opacity="0.08" />

    {/* Acropolis rock */}
    <path d="M150 168 L260 118 L470 120 L560 168 Z" fill="currentColor" opacity="0.22" />

    {/* Parthenon */}
    <g fill="url(#asAegStone)">
      <rect x="258" y="150" width="200" height="6" />
      <rect x="252" y="156" width="212" height="6" />
      <rect x="266" y="120" width="184" height="8" />
      <path d="M358 88 L268 120 H448 Z" />
      {[280, 306, 332, 384, 410, 436].map((x) => (
        <rect key={x} x={x - 6} y="128" width="12" height="22" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={`f${i}`} x={272 + i * 16} y="128" width="4" height="22" opacity="0.6" />
      ))}
    </g>

    {/* Erechtheion columns */}
    <g fill="currentColor" opacity="0.55">
      <rect x="486" y="142" width="52" height="4" />
      {[492, 506, 520, 534].map((x) => (
        <rect key={x} x={x - 3} y="146" width="6" height="14" />
      ))}
    </g>

    {/* olive trees */}
    <g fill="currentColor" opacity="0.4">
      <path d="M196 176c0-14 8-24 18-24s18 10 18 24z" />
      <rect x="211" y="176" width="6" height="10" />
      <path d="M556 180c0-12 7-20 15-20s15 8 15 20z" />
      <rect x="568" y="180" width="6" height="8" />
    </g>

    {/* Acropolis walls */}
    <g fill="currentColor" opacity="0.3">
      <rect x="120" y="170" width="110" height="18" />
      <rect x="470" y="168" width="90" height="20" />
    </g>
  </svg>
);

export const ParthenonBanner = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 400 70" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="asSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8fafc" stopOpacity="0" />
        <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g fill="currentColor">
      <path d="M20 62h360v4H20z" opacity="0.5" />
      <path d="M40 44h320v6H40z" opacity="0.7" />
      <path d="M52 26h296v18H52z" opacity="0.85" />
      <path d="M200 8 60 26h280z" />
      {[64, 96, 128, 160, 240, 272, 304, 336].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="44" width="12" height="18" />
          <rect x={x - 9} y="40" width="18" height="5" />
          <rect x={x - 9} y="62" width="18" height="4" />
        </g>
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={`f${i}`} x={56 + i * 24} y="28" width="5" height="16" />
      ))}
    </g>
  </svg>
);

export default { MarbleDivider, MeanderBand, GreekKeyDivider, LaurelBranch, LaurelCrown, OwlOfAthena, Amphora, ParthenonBanner };