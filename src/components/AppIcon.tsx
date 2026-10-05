interface Props {
  size?: number;
  className?: string;
}

export default function AppIcon({ size = 40, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="ArithmoSofia"
    >
      <defs>
        <linearGradient id="asIconBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b4965" />
          <stop offset="1" stopColor="#0b1f2a" />
        </linearGradient>
        <linearGradient id="asIconMarble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfbf7" />
          <stop offset="1" stopColor="#cbbfa6" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="14" fill="url(#asIconBg)" />

      <g transform="translate(5 5) scale(2.25)">
        <g fill="#d4a437">
          <rect x="0" y="0" width="24" height="4" />
          <rect x="18" y="0" width="4" height="24" />
          <rect x="0" y="20" width="18" height="4" />
          <rect x="0" y="4" width="4" height="16" />
          <rect x="4" y="4" width="10" height="4" />
          <rect x="14" y="8" width="4" height="12" />
        </g>
      </g>

      <g transform="translate(32 8)">
        <path d="M-11 6 Q0 -1 11 6 L9.5 9.5 H-9.5 Z" fill="url(#asIconMarble)" />
        <rect x="-8.5" y="9.5" width="17" height="2.5" fill="#d4a437" />
        <rect x="-6" y="12" width="12" height="19" fill="url(#asIconMarble)" />
        <g fill="#1b4965" opacity="0.55">
          <rect x="-3.4" y="12" width="0.9" height="19" />
          <rect x="-0.6" y="12" width="0.9" height="19" />
          <rect x="2.2" y="12" width="0.9" height="19" />
        </g>
        <rect x="-8" y="31" width="16" height="2.5" fill="#d4a437" />
        <path d="M-11 33.5 H11 L9.5 36 H-9.5 Z" fill="url(#asIconMarble)" />
      </g>

      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="10"
        fontWeight="700"
        fill="#d4a437"
        letterSpacing="1.5"
      >
        284
      </text>
    </svg>
  );
}