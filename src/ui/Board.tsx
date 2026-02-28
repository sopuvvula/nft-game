import { GameState, UnitInstance, Player, Row } from '../engine/types';
import { isExposed, getTauntLanes } from '../engine/rules';

// Per-template color themes — same map used by Hand cards
const THEMES: Record<string, { accent: string }> = {
  'vanguard':      { accent: '#4a9eff' },
  'striker':       { accent: '#9060ff' },
  'glass-cannon':  { accent: '#ff5050' },
  'sentinel':      { accent: '#2080d0' },
  'phantom':       { accent: '#d08030' },
  'bulwark':       { accent: '#40a060' },
  'lancer':        { accent: '#cc4444' },
};
function accent(templateId: string) {
  return THEMES[templateId]?.accent ?? '#555';
}

const KEYWORD_COLORS: Record<string, string> = {
  taunt: '#f59e0b',
  shield: '#38bdf8',
  piercing: '#ef4444',
};

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, current / max);
  const color = pct > 0.55 ? '#22c55e' : pct > 0.3 ? '#eab308' : '#ef4444';
  return (
    <div style={{ width: '100%', height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.3s' }} />
    </div>
  );
}

interface LaneProps {
  unit: UnitInstance | null;
  laneIndex: number;
  isSelected: boolean;
  isAttacker: boolean;
  isProtected: boolean;
  onClick: () => void;
}

function Lane({ unit, laneIndex, isSelected, isAttacker, isProtected, onClick }: LaneProps) {
  let border = '1.5px solid #161616';
  let bg = '#080808';
  let shadow = 'inset 0 1px 4px #00000060';

  if (isSelected)      { border = '1.5px solid #ffd700'; bg = '#12100a'; shadow = '0 0 10px #ffd70050'; }
  else if (isAttacker) { border = '1.5px solid #3b82f6'; bg = '#08090f'; shadow = '0 0 8px #3b82f620'; }
  else if (unit)       { border = '1.5px solid #1e1e1e'; bg = '#0c0c0c'; shadow = '0 1px 3px #00000040'; }

  return (
    <div
      onClick={isProtected ? undefined : onClick}
      style={{
        flex: 1,
        borderRadius: 6,
        border,
        background: bg,
        boxShadow: shadow,
        opacity: isProtected ? 0.25 : 1,
        cursor: isProtected ? 'default' : 'pointer',
        padding: '6px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        transition: 'opacity 0.2s, border-color 0.15s, box-shadow 0.15s',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Colored accent stripe at top */}
      {unit && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: accent(unit.templateId), opacity: 0.7, borderRadius: '6px 6px 0 0',
        }} />
      )}

      <div style={{ fontSize: 8, color: '#252525', letterSpacing: 1 }}>{laneIndex + 1}</div>

      {unit ? (
        <>
          <div style={{ fontWeight: 700, fontSize: 11, color: '#d1d5db', textAlign: 'center', lineHeight: 1.2 }}>
            {unit.name}
          </div>
          <div style={{ display: 'flex', gap: 5, fontSize: 10 }}>
            <span style={{ color: '#fca5a5' }}>⚔{unit.atk}</span>
            <span style={{ color: '#86efac' }}>♥{unit.currentHp}</span>
          </div>
          <HpBar current={unit.currentHp} max={unit.maxHp} />
          {unit.keywords.length > 0 && (
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {unit.keywords.map(kw => (
                <span key={kw} style={{
                  fontSize: 7, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                  color: KEYWORD_COLORS[kw] ?? '#888',
                  padding: '0 2px',
                }}>
                  {kw}
                </span>
              ))}
            </div>
          )}
          {unit.shieldActive && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 6, border: '1.5px solid #38bdf850',
              boxShadow: 'inset 0 0 8px #38bdf830',
              pointerEvents: 'none',
            }} />
          )}
          {unit.hasAttacked && (
            <div style={{ fontSize: 8, color: '#ef4444', fontWeight: 700, letterSpacing: 1 }}>SPENT</div>
          )}
        </>
      ) : (
        <div style={{ color: '#1c1c1c', fontSize: 18, lineHeight: 1 }}>+</div>
      )}
    </div>
  );
}

function RowLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <div style={{
      fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase',
      color: active ? '#374151' : '#1a1a1a', fontWeight: 600,
      flexShrink: 0, padding: '1px 2px',
    }}>
      {label}
    </div>
  );
}

interface BoardProps {
  state: GameState;
  onLaneClick: (player: Player, row: Row, laneIndex: number) => void;
}

export function Board({ state, onLaneClick }: BoardProps) {
  const { players, activePlayer, phase, selectedAttackerLane, selectedAttackerRow } = state;

  function renderRow(p: Player, row: Row) {
    const pl = players[p];
    const inCombat = phase === 'combat' && p === activePlayer;
    return (
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {pl[row].map((unit, i) => {
          const protected_ = row === 'backline' && !isExposed(i, pl);
          const canAtk = inCombat && !!unit && !unit.hasAttacked && !protected_;
          const isSel = inCombat && selectedAttackerLane === i && selectedAttackerRow === row;
          return (
            <Lane
              key={i}
              unit={unit}
              laneIndex={i}
              isSelected={isSel}
              isAttacker={canAtk}
              isProtected={protected_}
              onClick={() => onLaneClick(p, row, i)}
            />
          );
        })}
      </div>
    );
  }

  function PlayerInfo({ p }: { p: Player }) {
    const pl = players[p];
    const active = p === activePlayer;
    const hpPct = pl.coreHp / 15;
    const hpColor = hpPct > 0.55 ? '#22c55e' : hpPct > 0.3 ? '#eab308' : '#ef4444';
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '5px 2px', flexShrink: 0,
      }}>
        <span style={{
          fontSize: 12, fontWeight: active ? 700 : 400,
          color: active ? '#e5e7eb' : '#374151', minWidth: 72,
        }}>
          Player {p} {active && '▶'}
        </span>

        {/* HP bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <span style={{ fontSize: 9, color: '#4b5563' }}>♥</span>
          <div style={{ flex: 1, height: 5, background: '#111', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${hpPct * 100}%`, height: '100%', background: hpColor, borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 11, color: hpColor, fontWeight: 700, minWidth: 22, textAlign: 'right' }}>
            {pl.coreHp}
          </span>
        </div>

        {/* Energy pips */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i < pl.energy ? '#fbbf24' : '#181818',
              border: `1px solid ${i < pl.energy ? '#d97706' : '#222'}`,
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    );
  }

  const bActive = activePlayer === 'B';
  const aActive = activePlayer === 'A';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PlayerInfo p="B" />
      <RowLabel label="Backline" active={bActive} />
      {renderRow('B', 'backline')}
      <RowLabel label="Frontline" active={bActive} />
      {renderRow('B', 'frontline')}

      {/* Center divider */}
      <div style={{
        flexShrink: 0, height: 1, margin: '4px 0',
        background: 'linear-gradient(90deg, transparent, #1e3a5f 20%, #1e3a5f 80%, transparent)',
      }} />

      <RowLabel label="Frontline" active={aActive} />
      {renderRow('A', 'frontline')}
      <RowLabel label="Backline" active={aActive} />
      {renderRow('A', 'backline')}
      <PlayerInfo p="A" />
    </div>
  );
}
