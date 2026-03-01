import './ArenaBackground.css';

// Star positions — pre-computed for the upper 30% of viewport
const STARS = [
  { x: 8, y: 5, r: 1.2, o: 0.35, d: 3.2 },
  { x: 15, y: 12, r: 1.0, o: 0.25, d: 4.1 },
  { x: 22, y: 3, r: 1.5, o: 0.45, d: 2.8 },
  { x: 30, y: 18, r: 1.0, o: 0.2, d: 5.0 },
  { x: 35, y: 7, r: 1.3, o: 0.3, d: 3.5 },
  { x: 42, y: 14, r: 1.0, o: 0.25, d: 4.4 },
  { x: 48, y: 2, r: 1.8, o: 0.5, d: 2.5 },
  { x: 55, y: 10, r: 1.1, o: 0.3, d: 3.9 },
  { x: 62, y: 5, r: 1.4, o: 0.35, d: 3.0 },
  { x: 68, y: 20, r: 1.0, o: 0.2, d: 5.2 },
  { x: 72, y: 8, r: 1.2, o: 0.4, d: 2.7 },
  { x: 78, y: 15, r: 1.0, o: 0.25, d: 4.6 },
  { x: 83, y: 4, r: 1.6, o: 0.5, d: 2.3 },
  { x: 88, y: 12, r: 1.0, o: 0.3, d: 3.7 },
  { x: 92, y: 6, r: 1.3, o: 0.35, d: 3.1 },
  { x: 96, y: 18, r: 1.0, o: 0.2, d: 4.8 },
  { x: 5, y: 22, r: 0.8, o: 0.15, d: 5.5 },
  { x: 50, y: 16, r: 0.9, o: 0.2, d: 4.2 },
];

// Ember particle configs
const EMBERS = [
  { left: 5, size: 2, color: '#ff8c00', dur: 7, delay: 0 },
  { left: 12, size: 1.5, color: '#ff5500', dur: 8, delay: 1.2 },
  { left: 18, size: 2.5, color: '#ffd700', dur: 6.5, delay: 0.5 },
  { left: 25, size: 1, color: '#ff8c00', dur: 9, delay: 2.0 },
  { left: 33, size: 2, color: '#ff5500', dur: 7.5, delay: 0.8 },
  { left: 40, size: 1.5, color: '#ffd700', dur: 8.5, delay: 1.5 },
  { left: 48, size: 2, color: '#ff8c00', dur: 6, delay: 0.3 },
  { left: 55, size: 1, color: '#ff5500', dur: 9.5, delay: 2.5 },
  { left: 62, size: 2.5, color: '#ffd700', dur: 7, delay: 1.0 },
  { left: 70, size: 1.5, color: '#ff8c00', dur: 8, delay: 0.7 },
  { left: 78, size: 2, color: '#ff5500', dur: 6.5, delay: 1.8 },
  { left: 85, size: 1, color: '#ffd700', dur: 9, delay: 0.2 },
  { left: 90, size: 2, color: '#ff8c00', dur: 7.5, delay: 2.2 },
  { left: 95, size: 1.5, color: '#ff5500', dur: 8.5, delay: 1.3 },
  { left: 3, size: 3, color: '#ffd700', dur: 6, delay: 0.9 },
  { left: 97, size: 2, color: '#ff8c00', dur: 7, delay: 1.6 },
];

// Floating rune positions (edges only)
const RUNES = [
  { x: 5, y: 32, size: 22, dur: 9, delay: 0, rot: 15 },
  { x: 93, y: 40, size: 20, dur: 11, delay: 2, rot: -10 },
  { x: 3, y: 62, size: 18, dur: 8, delay: 1, rot: 20 },
  { x: 95, y: 58, size: 24, dur: 10, delay: 3, rot: -15 },
  { x: 7, y: 78, size: 20, dur: 12, delay: 0.5, rot: 8 },
  { x: 91, y: 75, size: 16, dur: 9.5, delay: 1.8, rot: -12 },
];

function TorchSconce({ style }: { style: React.CSSProperties }) {
  return (
    <div className="arena-torch" style={style}>
      <div className="torch-glow" />
      <div className="torch-glow-outer" />
      <svg viewBox="0 0 24 40" width="20" height="32">
        {/* Bracket */}
        <rect x="9" y="22" width="6" height="18" fill="#2a1e10" rx="1" />
        <rect x="7" y="20" width="10" height="5" fill="#3d2c18" rx="1.5" />
        <rect x="6" y="24" width="12" height="2" fill="#4a3520" rx="0.5" opacity="0.6" />
        {/* Oil cup */}
        <ellipse cx="12" cy="20" rx="5" ry="2" fill="#3d2c18" />
        {/* Outer flame */}
        <path d="M8 20 Q9 6 12 2 Q15 6 16 20 Q14 16 12 14 Q10 16 8 20 Z"
          fill="#ff6b00" opacity="0.85" className="torch-flame" />
        {/* Mid flame */}
        <path d="M9 20 Q10 10 12 5 Q14 10 15 20 Q13 17 12 15 Q11 17 9 20 Z"
          fill="#ff9500" opacity="0.9" className="torch-flame-mid" />
        {/* Inner flame */}
        <path d="M10.5 20 Q11 12 12 8 Q13 12 13.5 20 Q12.5 18 12 16 Q11.5 18 10.5 20 Z"
          fill="#ffd700" opacity="0.95" className="torch-flame-inner" />
        {/* Flame tip */}
        <circle cx="12" cy="6" r="1.5" fill="#fff8e0" opacity="0.6" className="torch-flame-inner" />
      </svg>
    </div>
  );
}

export function ArenaBackground() {
  return (
    <div className="arena-bg">
      {/* Layer 1: Sky with nebula */}
      <div className="arena-sky">
        {/* Nebula color patches */}
        <div className="arena-nebula nebula-1" />
        <div className="arena-nebula nebula-2" />
        {/* Moon glow */}
        <div className="arena-moon" />
        {/* Stars */}
        {STARS.map((s, i) => (
          <div
            key={i}
            className="arena-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r * 2,
              height: s.r * 2,
              opacity: s.o,
              animationDuration: `${s.d}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 2: Stone Architecture */}
      <svg
        className="arena-architecture"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left pillar — main */}
        <rect x="10" y="50" width="100" height="750" fill="#10121a" stroke="#1e2030" strokeWidth="2" />
        <rect x="0" y="30" width="120" height="35" fill="#14161e" stroke="#1e2030" strokeWidth="1.5" />
        {/* Left pillar stone texture */}
        <rect x="25" y="65" width="25" height="750" fill="#181c28" opacity="0.4" />
        <rect x="75" y="65" width="18" height="750" fill="#0c0e14" opacity="0.4" />
        {/* Left pillar horizontal stone lines */}
        <line x1="10" y1="140" x2="110" y2="140" stroke="#1e2030" strokeWidth="1" opacity="0.5" />
        <line x1="10" y1="230" x2="110" y2="230" stroke="#1e2030" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="320" x2="110" y2="320" stroke="#1e2030" strokeWidth="1" opacity="0.3" />
        <line x1="10" y1="440" x2="110" y2="440" stroke="#1e2030" strokeWidth="1" opacity="0.3" />
        <line x1="10" y1="560" x2="110" y2="560" stroke="#1e2030" strokeWidth="1" opacity="0.2" />
        {/* Left pillar capital — ornate */}
        <rect x="5" y="65" width="110" height="8" fill="#1e2030" />
        <rect x="8" y="73" width="104" height="4" fill="#1a1c28" />
        <rect x="2" y="80" width="116" height="3" fill="#1e2030" opacity="0.6" />

        {/* Right pillar — main */}
        <rect x="1090" y="50" width="100" height="750" fill="#10121a" stroke="#1e2030" strokeWidth="2" />
        <rect x="1080" y="30" width="120" height="35" fill="#14161e" stroke="#1e2030" strokeWidth="1.5" />
        {/* Right pillar stone texture */}
        <rect x="1100" y="65" width="25" height="750" fill="#181c28" opacity="0.4" />
        <rect x="1160" y="65" width="18" height="750" fill="#0c0e14" opacity="0.4" />
        {/* Right pillar horizontal stone lines */}
        <line x1="1090" y1="140" x2="1190" y2="140" stroke="#1e2030" strokeWidth="1" opacity="0.5" />
        <line x1="1090" y1="230" x2="1190" y2="230" stroke="#1e2030" strokeWidth="1" opacity="0.4" />
        <line x1="1090" y1="320" x2="1190" y2="320" stroke="#1e2030" strokeWidth="1" opacity="0.3" />
        <line x1="1090" y1="440" x2="1190" y2="440" stroke="#1e2030" strokeWidth="1" opacity="0.3" />
        <line x1="1090" y1="560" x2="1190" y2="560" stroke="#1e2030" strokeWidth="1" opacity="0.2" />
        {/* Right pillar capital */}
        <rect x="1085" y="65" width="110" height="8" fill="#1e2030" />
        <rect x="1088" y="73" width="104" height="4" fill="#1a1c28" />
        <rect x="1082" y="80" width="116" height="3" fill="#1e2030" opacity="0.6" />

        {/* Grand arch */}
        <path d="M110 50 Q600 -80 1090 50" fill="none" stroke="#1e2030" strokeWidth="14" />
        <path d="M110 50 Q600 -65 1090 50" fill="none" stroke="#14161e" strokeWidth="9" />
        {/* Arch keystone */}
        <path d="M585 -18 L600 -28 L615 -18 L610 -8 L590 -8 Z" fill="#1e2030" opacity="0.7" />

        {/* Inner left decorative column */}
        <rect x="150" y="160" width="45" height="640" fill="#10121a" stroke="#1a1c28" strokeWidth="1" opacity="0.6" />
        <rect x="145" y="148" width="55" height="18" fill="#14161e" stroke="#1a1c28" strokeWidth="1" opacity="0.6" />
        <rect x="148" y="166" width="49" height="4" fill="#1a1c28" opacity="0.4" />

        {/* Inner right decorative column */}
        <rect x="1005" y="160" width="45" height="640" fill="#10121a" stroke="#1a1c28" strokeWidth="1" opacity="0.6" />
        <rect x="1000" y="148" width="55" height="18" fill="#14161e" stroke="#1a1c28" strokeWidth="1" opacity="0.6" />
        <rect x="1003" y="166" width="49" height="4" fill="#1a1c28" opacity="0.4" />

        {/* Hanging chains — left */}
        <path d="M60 80 Q58 120 62 160 Q58 200 60 240" stroke="#1a1c28" strokeWidth="2" fill="none" opacity="0.35" />
        <path d="M60 240 Q62 260 58 280 Q62 300 60 320" stroke="#1a1c28" strokeWidth="1.5" fill="none" opacity="0.25" />
        {/* Hanging chains — right */}
        <path d="M1140 80 Q1142 120 1138 160 Q1142 200 1140 240" stroke="#1a1c28" strokeWidth="2" fill="none" opacity="0.35" />
        <path d="M1140 240 Q1138 260 1142 280 Q1138 300 1140 320" stroke="#1a1c28" strokeWidth="1.5" fill="none" opacity="0.25" />

        {/* Stone banner above battlefield */}
        <rect x="400" y="380" width="400" height="6" rx="2" fill="#14161e" opacity="0.3" />
        <rect x="420" y="386" width="360" height="3" rx="1" fill="#1a1c28" opacity="0.2" />
      </svg>

      {/* Layer 3: Stone Floor */}
      <div className="arena-floor" />

      {/* Layer 4: Torches — 6 total */}
      <div className="arena-torches">
        <TorchSconce style={{ left: '7%', top: '18%' }} />
        <TorchSconce style={{ left: '7%', top: '48%' }} />
        <TorchSconce style={{ left: '7%', top: '72%' }} />
        <TorchSconce style={{ right: '7%', top: '18%' }} />
        <TorchSconce style={{ right: '7%', top: '48%' }} />
        <TorchSconce style={{ right: '7%', top: '72%' }} />
      </div>

      {/* Layer 5: Fog Wisps — varied opacity and speed */}
      <div className="arena-fog-wisp fog-thick" style={{ top: '35%', animationDuration: '18s' }} />
      <div className="arena-fog-wisp" style={{ top: '48%', animationDuration: '25s', animationDelay: '3s' }} />
      <div className="arena-fog-wisp fog-thick" style={{ top: '60%', animationDuration: '20s', animationDelay: '6s' }} />
      <div className="arena-fog-wisp" style={{ top: '75%', animationDuration: '16s', animationDelay: '10s' }} />

      {/* Layer 6: Floating Runes */}
      {RUNES.map((r, i) => (
        <div
          key={i}
          className="arena-rune"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: r.size,
            height: r.size,
            animationDuration: `${r.dur}s`,
            animationDelay: `${r.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            {i % 4 === 0 && (
              <>
                <circle cx="12" cy="12" r="9" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.15" />
                <polygon points="12,4 20,18 4,18" stroke="#fbbf24" strokeWidth="0.8" fill="none" opacity="0.12" />
                <circle cx="12" cy="12" r="2" fill="#fbbf24" opacity="0.08" />
              </>
            )}
            {i % 4 === 1 && (
              <>
                <polygon points="12,2 22,12 12,22 2,12" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.15" />
                <line x1="12" y1="6" x2="12" y2="18" stroke="#fbbf24" strokeWidth="0.6" opacity="0.1" />
                <line x1="6" y1="12" x2="18" y2="12" stroke="#fbbf24" strokeWidth="0.6" opacity="0.1" />
              </>
            )}
            {i % 4 === 2 && (
              <>
                <circle cx="12" cy="12" r="8" stroke="#fbbf24" strokeWidth="0.8" fill="none" opacity="0.12" />
                <circle cx="12" cy="12" r="4" stroke="#fbbf24" strokeWidth="0.6" fill="none" opacity="0.1" />
                <line x1="12" y1="4" x2="12" y2="20" stroke="#fbbf24" strokeWidth="0.5" opacity="0.08" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="#fbbf24" strokeWidth="0.5" opacity="0.08" />
              </>
            )}
            {i % 4 === 3 && (
              <>
                <polygon points="12,3 15,10 22,10 16,14 18,21 12,17 6,21 8,14 2,10 9,10" stroke="#fbbf24" strokeWidth="0.7" fill="none" opacity="0.12" />
                <circle cx="12" cy="12" r="3" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.08" />
              </>
            )}
          </svg>
        </div>
      ))}

      {/* Layer 7: Ember Particles */}
      {EMBERS.map((e, i) => (
        <div
          key={i}
          className="arena-ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 2}px ${e.color}60`,
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}

      {/* Layer 8: Vignette overlay */}
      <div className="arena-vignette" />
    </div>
  );
}
