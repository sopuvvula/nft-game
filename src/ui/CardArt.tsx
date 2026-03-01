// SVG art per card template — used in hand cards and board mini-units

interface CardArtProps {
  templateId: string;
  accent: string;
  size?: number;
}

export function CardArt({ templateId, accent, size = 54 }: CardArtProps) {
  const a = accent;
  const d = 54; // viewBox is always 54×54

  const svgStyle: React.CSSProperties = { display: 'block', width: size, height: size };

  if (templateId === 'vanguard') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <path d="M27 4 L48 12 L48 30 Q48 44 27 52 Q6 44 6 30 L6 12 Z"
          fill="none" stroke={a} strokeWidth="1.5" opacity="0.5" />
        <path d="M27 9 L43 16 L43 30 Q43 41 27 47 Q11 41 11 30 L11 16 Z"
          fill={a} opacity="0.07" stroke={a} strokeWidth="1" />
        <line x1="27" y1="18" x2="27" y2="38" stroke={a} strokeWidth="2" opacity="0.8" />
        <line x1="17" y1="28" x2="37" y2="28" stroke={a} strokeWidth="2" opacity="0.8" />
        <circle cx="27" cy="18" r="1.5" fill={a} opacity="0.9" />
        <circle cx="27" cy="38" r="1.5" fill={a} opacity="0.9" />
        <circle cx="17" cy="28" r="1.5" fill={a} opacity="0.9" />
        <circle cx="37" cy="28" r="1.5" fill={a} opacity="0.9" />
      </svg>
    );
  }

  if (templateId === 'striker') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <circle cx="27" cy="27" r="18" fill={a} opacity="0.05" />
        <circle cx="27" cy="27" r="12" fill={a} opacity="0.06" />
        <path d="M32 6 L18 28 L27 28 L22 50 L38 24 L29 24 Z"
          fill={a} opacity="0.85" stroke={a} strokeWidth="0.5" />
        <line x1="8" y1="20" x2="15" y2="20" stroke={a} strokeWidth="1" opacity="0.3" />
        <line x1="6" y1="27" x2="14" y2="27" stroke={a} strokeWidth="1" opacity="0.3" />
        <line x1="8" y1="34" x2="15" y2="34" stroke={a} strokeWidth="1" opacity="0.3" />
      </svg>
    );
  }

  if (templateId === 'glass-cannon') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <polygon points="27,5 46,16 46,38 27,49 8,38 8,16"
          fill="none" stroke={a} strokeWidth="1.5" opacity="0.4" />
        <polygon points="27,11 40,19 40,35 27,43 14,35 14,19"
          fill={a} opacity="0.1" stroke={a} strokeWidth="1" />
        <polygon points="27,17 36,22 36,32 27,37 18,32 18,22"
          fill={a} opacity="0.2" />
        <line x1="27" y1="17" x2="27" y2="37" stroke={a} strokeWidth="0.8" opacity="0.6" />
        <line x1="18" y1="22" x2="36" y2="32" stroke={a} strokeWidth="0.8" opacity="0.6" />
        <line x1="36" y1="22" x2="18" y2="32" stroke={a} strokeWidth="0.8" opacity="0.6" />
        <circle cx="27" cy="27" r="2" fill={a} opacity="0.9" />
      </svg>
    );
  }

  if (templateId === 'sentinel') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <rect x="8" y="44" width="38" height="4" rx="1" fill={a} opacity="0.5" />
        <rect x="14" y="22" width="26" height="24" rx="1"
          fill={a} opacity="0.1" stroke={a} strokeWidth="1.2" />
        <rect x="14" y="15" width="6" height="9" rx="1" fill={a} opacity="0.6" />
        <rect x="24" y="15" width="6" height="9" rx="1" fill={a} opacity="0.6" />
        <rect x="34" y="15" width="6" height="9" rx="1" fill={a} opacity="0.6" />
        <rect x="24" y="28" width="6" height="10" rx="1" fill={a} opacity="0.25" stroke={a} strokeWidth="0.8" />
        <line x1="27" y1="5" x2="27" y2="16" stroke={a} strokeWidth="1" opacity="0.7" />
        <path d="M27 5 L38 9 L27 13 Z" fill={a} opacity="0.7" />
      </svg>
    );
  }

  if (templateId === 'phantom') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <ellipse cx="27" cy="35" rx="14" ry="5" fill={a} opacity="0.08" />
        <path d="M27 6 C27 6 38 18 36 28 C34 36 30 38 27 50 C24 38 20 36 18 28 C16 18 27 6 27 6 Z"
          fill={a} opacity="0.7" />
        <path d="M27 16 C27 16 33 24 32 30 C31 35 29 37 27 44 C25 37 23 35 22 30 C21 24 27 16 27 16 Z"
          fill={a} opacity="0.9" />
        <path d="M18 30 C18 30 14 26 16 22 C18 20 20 24 18 30 Z" fill={a} opacity="0.4" />
        <path d="M36 30 C36 30 40 26 38 22 C36 20 34 24 36 30 Z" fill={a} opacity="0.4" />
        <circle cx="27" cy="32" r="3" fill="#000" opacity="0.4" />
        <circle cx="27" cy="32" r="1.5" fill={a} opacity="1" />
      </svg>
    );
  }

  if (templateId === 'bulwark') {
    // Fortress wall with gatehouse
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        {/* Base wall */}
        <rect x="4" y="28" width="46" height="18" rx="1" fill={a} opacity="0.1" stroke={a} strokeWidth="1.2" />
        {/* Wall stones pattern */}
        <line x1="4" y1="34" x2="50" y2="34" stroke={a} strokeWidth="0.6" opacity="0.3" />
        <line x1="4" y1="40" x2="50" y2="40" stroke={a} strokeWidth="0.6" opacity="0.3" />
        {/* Left tower */}
        <rect x="4" y="18" width="10" height="28" rx="1" fill={a} opacity="0.15" stroke={a} strokeWidth="1" />
        <rect x="2" y="12" width="4" height="8" rx="1" fill={a} opacity="0.6" />
        <rect x="8" y="12" width="4" height="8" rx="1" fill={a} opacity="0.6" />
        {/* Right tower */}
        <rect x="40" y="18" width="10" height="28" rx="1" fill={a} opacity="0.15" stroke={a} strokeWidth="1" />
        <rect x="40" y="12" width="4" height="8" rx="1" fill={a} opacity="0.6" />
        <rect x="46" y="12" width="4" height="8" rx="1" fill={a} opacity="0.6" />
        {/* Center gate */}
        <path d="M22 46 L22 34 Q27 28 32 34 L32 46 Z" fill={a} opacity="0.2" stroke={a} strokeWidth="0.8" />
        {/* Portcullis lines */}
        <line x1="25" y1="34" x2="25" y2="46" stroke={a} strokeWidth="0.6" opacity="0.5" />
        <line x1="27" y1="33" x2="27" y2="46" stroke={a} strokeWidth="0.6" opacity="0.5" />
        <line x1="29" y1="34" x2="29" y2="46" stroke={a} strokeWidth="0.6" opacity="0.5" />
        {/* Top flag */}
        <line x1="27" y1="4" x2="27" y2="18" stroke={a} strokeWidth="1" opacity="0.6" />
        <path d="M27 4 L36 8 L27 12 Z" fill={a} opacity="0.5" />
      </svg>
    );
  }

  if (templateId === 'lancer') {
    // Crossed spear/lance
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        {/* Left lance */}
        <line x1="8" y1="48" x2="38" y2="6" stroke={a} strokeWidth="2" opacity="0.7" />
        <path d="M38 6 L42 4 L40 12 Z" fill={a} opacity="0.9" />
        {/* Right lance */}
        <line x1="46" y1="48" x2="16" y2="6" stroke={a} strokeWidth="2" opacity="0.7" />
        <path d="M16 6 L12 4 L14 12 Z" fill={a} opacity="0.9" />
        {/* Center shield/emblem */}
        <circle cx="27" cy="27" r="8" fill={a} opacity="0.1" stroke={a} strokeWidth="1.2" />
        <circle cx="27" cy="27" r="4" fill={a} opacity="0.25" />
        <circle cx="27" cy="27" r="1.5" fill={a} opacity="0.9" />
        {/* Cross guard accents */}
        <line x1="22" y1="22" x2="32" y2="32" stroke={a} strokeWidth="0.8" opacity="0.4" />
        <line x1="32" y1="22" x2="22" y2="32" stroke={a} strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
      <circle cx="27" cy="27" r="18" fill="none" stroke={a} strokeWidth="1.5" opacity="0.4" />
      <circle cx="27" cy="27" r="10" fill="none" stroke={a} strokeWidth="0.8" opacity="0.2" />
      <circle cx="27" cy="27" r="4" fill={a} opacity="0.6" />
    </svg>
  );
}
