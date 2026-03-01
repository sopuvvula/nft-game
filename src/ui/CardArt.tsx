// Character silhouette art with SVG gradients — hand cards (54px) and board units (30px)

import { getCardTheme } from './theme';

interface CardArtProps {
  templateId: string;
  accent: string;
  size?: number;
}

export function CardArt({ templateId, accent, size = 54 }: CardArtProps) {
  const theme = getCardTheme(templateId);
  const a = theme.accent;
  const h = theme.highlight;
  const d = 54;
  const id = templateId.replace('-', ''); // safe id for gradients
  const svgStyle: React.CSSProperties = { display: 'block', width: size, height: size };

  if (templateId === 'vanguard') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.9" />
            <stop offset="100%" stopColor={a} stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="50%" cy="25%" r="60%">
            <stop offset="0%" stopColor={h} stopOpacity="0.25" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}Shield`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.5" />
            <stop offset="100%" stopColor={a} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Background glow */}
        <ellipse cx="27" cy="28" rx="22" ry="24" fill={`url(#${id}Glow)`} />
        {/* Shield */}
        <path d="M11 24 L11 42 Q11 50 22 52 L22 24 Z" fill={`url(#${id}Shield)`} stroke={a} strokeWidth="0.8" opacity="0.9" />
        <line x1="16.5" y1="26" x2="16.5" y2="46" stroke={a} strokeWidth="0.6" opacity="0.3" />
        <line x1="11" y1="36" x2="22" y2="36" stroke={a} strokeWidth="0.6" opacity="0.3" />
        <circle cx="16.5" cy="36" r="1.8" fill={a} opacity="0.3" />
        {/* Body */}
        <path d="M27 7 C23 7 21 10 21 13 C21 16 23 18 24 19 L22 21 L18 23 L16 27 L16 42 L19 44 L19 48 L23 50 L23 44 L27 44 L31 44 L31 50 L35 48 L35 44 L38 42 L38 27 L36 23 L32 21 L30 19 C31 18 33 16 33 13 C33 10 31 7 27 7 Z"
          fill={`url(#${id}Body)`} />
        {/* Pauldrons */}
        <path d="M18 23 C13 22 11 25 12 28 L16 27 Z" fill={a} opacity="0.6" />
        <path d="M36 23 C41 22 43 25 42 28 L38 27 Z" fill={a} opacity="0.6" />
        {/* Sword */}
        <line x1="34" y1="5" x2="39" y2="24" stroke={h} strokeWidth="2" opacity="0.6" />
        <path d="M33 4 L35 1 L37 5 Z" fill={h} opacity="0.8" />
        <line x1="33" y1="6" x2="37" y2="6" stroke={h} strokeWidth="1" opacity="0.6" />
        {/* Chest V */}
        <path d="M22 22 L27 30 L32 22" stroke={h} strokeWidth="0.5" fill="none" opacity="0.2" />
        {/* Belt */}
        <rect x="18" y="36" width="18" height="2.5" rx="0.5" fill={a} opacity="0.25" />
        <rect x="25" y="35.5" width="4" height="3.5" rx="0.5" fill={h} opacity="0.3" />
        {/* Visor glow — brightest element */}
        <rect x="23" y="11" width="8" height="2.2" rx="1" fill={h} opacity="1" />
        <rect x="24" y="11.5" width="6" height="1.2" rx="0.5" fill="#fff" opacity="0.4" />
        {/* Knee guards */}
        <ellipse cx="23" cy="44" rx="2.5" ry="1.8" fill={a} opacity="0.35" />
        <ellipse cx="31" cy="44" rx="2.5" ry="1.8" fill={a} opacity="0.35" />
        {/* Boots */}
        <rect x="19" y="48" width="7" height="3" rx="1.5" fill={a} opacity="0.4" />
        <rect x="28" y="48" width="7" height="3" rx="1.5" fill={a} opacity="0.4" />
        {/* Ground reflection */}
        <ellipse cx="27" cy="52" rx="12" ry="2" fill={a} opacity="0.08" />
      </svg>
    );
  }

  if (templateId === 'striker') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.85" />
            <stop offset="100%" stopColor={a} stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="60%" cy="30%" r="55%">
            <stop offset="0%" stopColor={h} stopOpacity="0.2" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}Cloak`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} stopOpacity="0.4" />
            <stop offset="100%" stopColor={a} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <ellipse cx="30" cy="30" rx="20" ry="22" fill={`url(#${id}Glow)`} />
        {/* Cloak */}
        <path d="M30 14 C32 16 36 20 38 28 C40 36 44 42 48 46 C44 48 40 46 36 42 C32 44 28 46 24 44 C22 40 20 34 20 28 C20 22 24 16 28 14 Z"
          fill={`url(#${id}Cloak)`} />
        <path d="M46 44 C48 46 50 50 52 48 C50 52 46 52 44 50 Z" fill={a} opacity="0.15" />
        <path d="M42 48 C44 52 46 54 42 54 Z" fill={a} opacity="0.1" />
        {/* Hood */}
        <path d="M24 9 C21 7 19 9 19 13 C19 16 21 18 24 18 L28 18 C31 18 33 16 35 13 C35 9 33 7 30 9 Z"
          fill={a} opacity="0.7" />
        <path d="M25 7 L27 3 L29 7 Z" fill={a} opacity="0.6" />
        {/* Head + Torso */}
        <path d="M26 11 C24 11 22 13 22 16 C22 18 24 20 26 20 L28 20 C30 20 32 18 32 16 C32 13 30 11 28 11 Z"
          fill={`url(#${id}Body)`} />
        <path d="M24 20 L20 24 L18 34 L22 36 L30 36 L34 34 L32 24 L28 20 Z"
          fill={`url(#${id}Body)`} />
        {/* Legs */}
        <path d="M22 36 L15 46 L17 48 L24 42 Z" fill={a} opacity="0.7" />
        <path d="M30 36 L37 48 L39 46 L33 40 Z" fill={a} opacity="0.7" />
        {/* Arm + dagger */}
        <path d="M32 24 L40 19 L43 17" stroke={h} strokeWidth="2" fill="none" opacity="0.75" />
        <path d="M43 17 L50 12 L49 15 L52 10 Z" fill={h} opacity="1" />
        {/* Off-hand */}
        <path d="M20 24 L14 30" stroke={a} strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M14 30 L11 34 L12 31 Z" fill={a} opacity="0.5" />
        {/* Eyes — key identifier */}
        <circle cx="25" cy="14.5" r="1.3" fill={h} opacity="1" />
        <circle cx="29" cy="14.5" r="1.3" fill={h} opacity="1" />
        <circle cx="25" cy="14.5" r="0.5" fill="#fff" opacity="0.5" />
        <circle cx="29" cy="14.5" r="0.5" fill="#fff" opacity="0.5" />
        {/* Eye glow haze */}
        <ellipse cx="27" cy="14.5" rx="5" ry="2" fill={h} opacity="0.12" />
        {/* Dagger tip glow */}
        <circle cx="52" cy="10" r="2.5" fill={h} opacity="0.7" />
        <circle cx="52" cy="10" r="5" fill={h} opacity="0.1" />
        {/* Boots */}
        <path d="M15 46 L13 48 L17 48 Z" fill={a} opacity="0.4" />
        <path d="M37 46 L35 48 L39 48 Z" fill={a} opacity="0.4" />
        <ellipse cx="30" cy="52" rx="12" ry="2" fill={a} opacity="0.06" />
      </svg>
    );
  }

  if (templateId === 'glass-cannon') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.8" />
            <stop offset="100%" stopColor={a} stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id={`${id}Orb`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="30%" stopColor={h} stopOpacity="0.7" />
            <stop offset="100%" stopColor={a} stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id={`${id}Glow`} cx="50%" cy="20%" r="70%">
            <stop offset="0%" stopColor={h} stopOpacity="0.25" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="27" cy="24" rx="24" ry="26" fill={`url(#${id}Glow)`} />
        {/* Robes */}
        <path d="M27 18 L17 24 L10 44 L12 50 L21 52 L27 50 L33 52 L42 50 L44 44 L37 24 Z"
          fill={a} opacity="0.45" />
        <path d="M27 22 L22 34 L19 48 L27 46 L35 48 L32 34 Z" fill={a} opacity="0.2" />
        <path d="M12 50 C16 48 20 50 24 48 C28 50 32 48 36 50 C38 48 42 50 42 50" stroke={a} strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Torso */}
        <path d="M25 14 C23 14 22 16 22 18 L22 22 L32 22 L32 18 C32 16 31 14 29 14 Z"
          fill={`url(#${id}Body)`} />
        {/* Hat */}
        <path d="M21 14 L27 1 L33 14 Z" fill={`url(#${id}Body)`} />
        <path d="M19 15 L35 15 L33 14 L21 14 Z" fill={a} opacity="0.45" />
        <line x1="19" y1="15" x2="35" y2="15" stroke={h} strokeWidth="0.8" opacity="0.5" />
        {/* Arms raised */}
        <path d="M22 22 L13 9 L11 7 L9 9 L15 20 Z" fill={`url(#${id}Body)`} />
        <path d="M32 22 L41 9 L43 7 L45 9 L39 20 Z" fill={`url(#${id}Body)`} />
        {/* Energy orb — the star of the show */}
        <circle cx="27" cy="7" r="7" fill={a} opacity="0.06" />
        <circle cx="27" cy="7" r="5" fill={`url(#${id}Orb)`} />
        <circle cx="27" cy="7" r="2" fill="#fff" opacity="0.6" />
        {/* Lightning */}
        <path d="M23 7 L17 5 L19 7 L14 8" stroke={h} strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d="M31 7 L37 5 L35 7 L40 8" stroke={h} strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d="M27 2 L25 -1 L27 0 L29 -1 L27 2" stroke={h} strokeWidth="0.5" fill="none" opacity="0.5" />
        {/* Hand glow */}
        <circle cx="11" cy="7" r="2.5" fill={h} opacity="0.7" />
        <circle cx="43" cy="7" r="2.5" fill={h} opacity="0.7" />
        {/* Eyes */}
        <circle cx="25.5" cy="16.5" r="0.9" fill={h} opacity="0.95" />
        <circle cx="28.5" cy="16.5" r="0.9" fill={h} opacity="0.95" />
        {/* Sparkles */}
        <circle cx="16" cy="14" r="0.7" fill={h} opacity="0.5" />
        <circle cx="38" cy="14" r="0.7" fill={h} opacity="0.5" />
        <circle cx="20" cy="4" r="0.5" fill={h} opacity="0.4" />
        <circle cx="34" cy="4" r="0.5" fill={h} opacity="0.4" />
        <ellipse cx="27" cy="52" rx="14" ry="2" fill={a} opacity="0.08" />
      </svg>
    );
  }

  if (templateId === 'sentinel') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.85" />
            <stop offset="50%" stopColor={a} stopOpacity="0.7" />
            <stop offset="100%" stopColor={a} stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={h} stopOpacity="0.2" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="27" cy="30" rx="24" ry="24" fill={`url(#${id}Glow)`} />
        {/* Head */}
        <path d="M27 4 C23 4 21 6 21 9 C21 12 23 14 26 14 L28 14 C31 14 33 12 33 9 C33 6 31 4 27 4 Z"
          fill={`url(#${id}Body)`} />
        <path d="M25 4 L27 1 L29 4" stroke={h} strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Massive torso */}
        <path d="M26 14 L12 18 L8 20 L8 26 L10 28 L12 30 L12 42 L16 44 L16 50 L22 53 L22 44 L27 44 L32 44 L32 53 L38 50 L38 44 L42 42 L42 30 L44 28 L46 26 L46 20 L42 18 L28 14 Z"
          fill={`url(#${id}Body)`} />
        {/* T-visor */}
        <rect x="21" y="7.5" width="12" height="2.2" rx="0.5" fill={h} opacity="1" />
        <rect x="25" y="7.5" width="4" height="6" rx="0.5" fill={h} opacity="1" />
        <rect x="22" y="8" width="10" height="1.2" rx="0.5" fill="#fff" opacity="0.35" />
        {/* Visor glow */}
        <ellipse cx="27" cy="9" rx="8" ry="3" fill={h} opacity="0.12" />
        {/* Chest plate */}
        <path d="M18 22 L27 19 L36 22 L36 32 L27 34 L18 32 Z"
          fill={a} opacity="0.15" stroke={h} strokeWidth="0.6" />
        <line x1="27" y1="19" x2="27" y2="34" stroke={h} strokeWidth="0.5" opacity="0.2" />
        {/* Shoulder plates */}
        <path d="M12 18 L8 20 L8 26 L12 24 Z" fill={h} opacity="0.45" />
        <path d="M42 18 L46 20 L46 26 L42 24 Z" fill={h} opacity="0.45" />
        <circle cx="10" cy="22" r="1.2" fill={h} opacity="0.35" />
        <circle cx="44" cy="22" r="1.2" fill={h} opacity="0.35" />
        {/* Fists */}
        <circle cx="12" cy="32" r="3.5" fill={a} opacity="0.6" />
        <circle cx="42" cy="32" r="3.5" fill={a} opacity="0.6" />
        <circle cx="12" cy="32" r="1.5" fill={h} opacity="0.25" />
        <circle cx="42" cy="32" r="1.5" fill={h} opacity="0.25" />
        {/* Belt */}
        <rect x="14" y="37" width="26" height="3" rx="1" fill={a} opacity="0.3" />
        <rect x="24" y="36.5" width="6" height="4" rx="1" fill={h} opacity="0.35" />
        {/* Boots */}
        <rect x="14" y="50" width="12" height="3" rx="1.5" fill={a} opacity="0.4" />
        <rect x="28" y="50" width="12" height="3" rx="1.5" fill={a} opacity="0.4" />
        <ellipse cx="27" cy="54" rx="16" ry="2" fill={a} opacity="0.08" />
      </svg>
    );
  }

  if (templateId === 'phantom') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.75" />
            <stop offset="60%" stopColor={a} stopOpacity="0.5" />
            <stop offset="100%" stopColor={a} stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="50%" cy="25%" r="65%">
            <stop offset="0%" stopColor={h} stopOpacity="0.2" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="27" cy="26" rx="24" ry="22" fill={`url(#${id}Glow)`} />
        {/* Wisp trails — dissolving lower body */}
        <path d="M21 36 C19 40 17 46 14 52" stroke={h} strokeWidth="1.2" fill="none" opacity="0.25" />
        <path d="M27 38 C26 44 25 50 23 54" stroke={a} strokeWidth="1.5" fill="none" opacity="0.2" />
        <path d="M33 36 C35 40 37 46 40 52" stroke={h} strokeWidth="1.2" fill="none" opacity="0.25" />
        <path d="M27 40 C28 46 29 50 31 54" stroke={a} strokeWidth="0.8" fill="none" opacity="0.12" />
        <path d="M24 38 C22 44 20 50 18 54" stroke={a} strokeWidth="0.6" fill="none" opacity="0.1" />
        {/* Body — fades to nothing */}
        <path d="M27 7 C21 7 17 11 17 17 L17 24 C17 30 19 34 21 36 C23 38 25 40 27 46 C29 40 31 38 33 36 C35 34 37 30 37 24 L37 17 C37 11 33 7 27 7 Z"
          fill={`url(#${id}Body)`} />
        {/* Hood */}
        <path d="M19 12 C17 7 19 3 27 3 C35 3 37 7 35 12 C33 9 30 7 27 7 C24 7 21 9 19 12 Z"
          fill={a} opacity="0.6" />
        <path d="M25 3 L27 0 L29 3 Z" fill={a} opacity="0.5" />
        {/* Tattered edges */}
        <path d="M17 24 L13 26 L15 24 L11 28 L14 26 L10 30" stroke={a} strokeWidth="0.7" fill="none" opacity="0.3" />
        <path d="M37 24 L41 26 L39 24 L43 28 L40 26 L44 30" stroke={a} strokeWidth="0.7" fill="none" opacity="0.3" />
        {/* Clawed hand */}
        <path d="M37 20 L43 16 L46 14" stroke={h} strokeWidth="1.5" fill="none" opacity="0.65" />
        <path d="M46 14 L49 11" stroke={h} strokeWidth="0.8" fill="none" opacity="0.85" />
        <path d="M46 14 L50 14" stroke={h} strokeWidth="0.8" fill="none" opacity="0.85" />
        <path d="M46 14 L49 17" stroke={h} strokeWidth="0.8" fill="none" opacity="0.85" />
        {/* Claw glows */}
        <circle cx="49" cy="11" r="1.5" fill={h} opacity="0.9" />
        <circle cx="50" cy="14" r="1.2" fill={h} opacity="0.8" />
        <circle cx="49" cy="17" r="1.2" fill={h} opacity="0.8" />
        <circle cx="48" cy="14" r="5" fill={h} opacity="0.08" />
        {/* Left arm */}
        <path d="M17 22 L12 28" stroke={a} strokeWidth="1.2" fill="none" opacity="0.35" />
        {/* Eyes — blazing */}
        <ellipse cx="23.5" cy="9.5" rx="2.8" ry="2" fill="#000" opacity="0.7" />
        <ellipse cx="30.5" cy="9.5" rx="2.8" ry="2" fill="#000" opacity="0.7" />
        <circle cx="23.5" cy="9.5" r="1.8" fill={h} opacity="1" />
        <circle cx="30.5" cy="9.5" r="1.8" fill={h} opacity="1" />
        <circle cx="23.5" cy="9.5" r="0.7" fill="#fff" opacity="0.5" />
        <circle cx="30.5" cy="9.5" r="0.7" fill="#fff" opacity="0.5" />
        {/* Eye glow trails */}
        <ellipse cx="27" cy="9.5" rx="7" ry="3" fill={h} opacity="0.1" />
        {/* Spectral wisps */}
        <path d="M19 30 C15 28 13 32 17 34" stroke={h} strokeWidth="0.6" fill="none" opacity="0.2" />
        <path d="M35 28 C39 26 41 30 37 32" stroke={h} strokeWidth="0.6" fill="none" opacity="0.2" />
      </svg>
    );
  }

  if (templateId === 'bulwark') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Shield`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.5" />
            <stop offset="50%" stopColor={a} stopOpacity="0.3" />
            <stop offset="100%" stopColor={a} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="50%" cy="15%" r="60%">
            <stop offset="0%" stopColor={h} stopOpacity="0.2" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="27" cy="28" rx="24" ry="26" fill={`url(#${id}Glow)`} />
        {/* Tower shield */}
        <path d="M8 8 L8 42 Q8 54 27 54 Q46 54 46 42 L46 8 Z"
          fill={`url(#${id}Shield)`} stroke={a} strokeWidth="1.5" />
        {/* Inner border */}
        <path d="M11 11 L11 40 Q11 51 27 51 Q43 51 43 40 L43 11 Z"
          fill={a} opacity="0.06" stroke={a} strokeWidth="0.6" />
        {/* Reinforcement bands */}
        <line x1="8" y1="18" x2="46" y2="18" stroke={h} strokeWidth="0.8" opacity="0.25" />
        <line x1="8" y1="28" x2="46" y2="28" stroke={h} strokeWidth="0.8" opacity="0.25" />
        <line x1="10" y1="38" x2="44" y2="38" stroke={h} strokeWidth="0.8" opacity="0.2" />
        {/* Center vertical */}
        <line x1="27" y1="12" x2="27" y2="48" stroke={h} strokeWidth="0.8" opacity="0.2" />
        {/* Diamond emblem */}
        <polygon points="27,19 35,28 27,37 19,28" fill={a} opacity="0.1" stroke={h} strokeWidth="0.6" />
        <circle cx="27" cy="28" r="3" fill={h} opacity="0.3" />
        <circle cx="27" cy="28" r="1.2" fill={h} opacity="0.6" />
        {/* Rivets */}
        <circle cx="12" cy="12" r="1.8" fill={h} opacity="0.5" />
        <circle cx="42" cy="12" r="1.8" fill={h} opacity="0.5" />
        <circle cx="12" cy="32" r="1.8" fill={h} opacity="0.45" />
        <circle cx="42" cy="32" r="1.8" fill={h} opacity="0.45" />
        <circle cx="12" cy="12" r="0.7" fill="#fff" opacity="0.2" />
        <circle cx="42" cy="12" r="0.7" fill="#fff" opacity="0.2" />
        {/* Eyes over shield */}
        <ellipse cx="22" cy="6" rx="3" ry="2.5" fill={a} opacity="0.55" />
        <ellipse cx="32" cy="6" rx="3" ry="2.5" fill={a} opacity="0.55" />
        <circle cx="22" cy="6" r="1.5" fill={h} opacity="1" />
        <circle cx="32" cy="6" r="1.5" fill={h} opacity="1" />
        <circle cx="22" cy="6" r="0.5" fill="#fff" opacity="0.4" />
        <circle cx="32" cy="6" r="0.5" fill="#fff" opacity="0.4" />
        <ellipse cx="27" cy="6" rx="8" ry="2.5" fill={h} opacity="0.1" />
        {/* Helmet */}
        <path d="M19 6 C19 2 23 0 27 0 C31 0 35 2 35 6"
          fill={a} opacity="0.6" stroke={h} strokeWidth="0.5" />
        {/* Arms at edges */}
        <path d="M8 26 L4 28 L4 34 L8 32 Z" fill={a} opacity="0.45" />
        <path d="M46 26 L50 28 L50 34 L46 32 Z" fill={a} opacity="0.45" />
      </svg>
    );
  }

  if (templateId === 'lancer') {
    return (
      <svg viewBox={`0 0 ${d} ${d}`} style={svgStyle}>
        <defs>
          <linearGradient id={`${id}Body`} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor={h} stopOpacity="0.85" />
            <stop offset="100%" stopColor={a} stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id={`${id}Glow`} cx="40%" cy="30%" r="55%">
            <stop offset="0%" stopColor={h} stopOpacity="0.2" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}Lance`} x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={a} stopOpacity="0.6" />
            <stop offset="100%" stopColor={h} stopOpacity="1" />
          </linearGradient>
        </defs>
        <ellipse cx="24" cy="28" rx="22" ry="22" fill={`url(#${id}Glow)`} />
        {/* Motion lines */}
        <line x1="42" y1="18" x2="52" y2="16" stroke={h} strokeWidth="0.5" opacity="0.15" />
        <line x1="40" y1="25" x2="54" y2="23" stroke={h} strokeWidth="0.4" opacity="0.12" />
        <line x1="42" y1="32" x2="50" y2="31" stroke={h} strokeWidth="0.3" opacity="0.08" />
        {/* Cape */}
        <path d="M29 17 C31 19 35 23 39 30 C41 34 45 40 48 44 C44 46 40 42 36 38 C32 36 30 34 28 30 Z"
          fill={a} opacity="0.3" />
        <path d="M46 42 C48 44 50 48 52 46 C50 50 46 50 44 48 Z" fill={a} opacity="0.18" />
        {/* Head */}
        <path d="M27 7 C25 7 23 9 23 12 C23 15 25 16 27 16 C29 16 31 15 31 12 C31 9 29 7 27 7 Z"
          fill={`url(#${id}Body)`} />
        {/* Helmet */}
        <path d="M23 7 C22 5 24 3 27 3 C30 3 32 5 31 7 Z" fill={a} opacity="0.7" />
        {/* Plume */}
        <path d="M30 4 C33 2 37 1 40 3 C38 3 35 4 33 5" fill={h} opacity="0.5" />
        <path d="M37 2 C40 0 43 1 43 3 C41 2 39 2 37 2 Z" fill={h} opacity="0.3" />
        {/* Torso */}
        <path d="M25 16 L21 19 L19 30 L23 34 L31 34 L35 30 L33 19 L29 16 Z"
          fill={`url(#${id}Body)`} />
        {/* Legs */}
        <path d="M23 34 L16 44 L14 46 L16 48 L20 44 L23 40 Z" fill={a} opacity="0.7" />
        <path d="M31 34 L38 48 L40 50 L42 48 L38 42 L34 38 Z" fill={a} opacity="0.7" />
        {/* Lance arm */}
        <path d="M21 19 L15 17 L10 15" stroke={h} strokeWidth="2" fill="none" opacity="0.65" />
        {/* Lance shaft */}
        <line x1="10" y1="15" x2="0" y2="9" stroke={`url(#${id}Lance)`} strokeWidth="2.5" />
        {/* Lance diamond tip */}
        <path d="M0 9 L-2 7 L0 2 L2 7 Z" fill={h} opacity="1" />
        {/* Lance glow */}
        <circle cx="0" cy="5" r="2.5" fill={h} opacity="0.85" />
        <circle cx="0" cy="5" r="5" fill={h} opacity="0.12" />
        {/* Shoulders */}
        <path d="M21 19 L17 17 L17 21 L21 21 Z" fill={h} opacity="0.45" />
        <path d="M33 19 L37 17 L37 21 L33 21 Z" fill={h} opacity="0.45" />
        {/* Belt */}
        <rect x="20" y="30" width="14" height="2" rx="0.5" fill={a} opacity="0.3" />
        {/* Visor */}
        <rect x="24" y="10" width="6" height="1.8" rx="0.5" fill={h} opacity="1" />
        <rect x="24.5" y="10.3" width="5" height="1" rx="0.5" fill="#fff" opacity="0.3" />
        {/* Boots */}
        <path d="M14 46 L12 48 L16 48 Z" fill={a} opacity="0.4" />
        <path d="M40 48 L38 50 L42 50 Z" fill={a} opacity="0.4" />
        <ellipse cx="27" cy="52" rx="14" ry="2" fill={a} opacity="0.06" />
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
