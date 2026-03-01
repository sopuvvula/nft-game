import { GameState, UnitInstance, Player, Row } from '../engine/types';
import { isExposed, getTauntLanes } from '../engine/rules';
import { getCardTheme, KEYWORD_COLORS, FONT_HEADING, FONT_BODY, BOARD } from './theme';
import { CardArt } from './CardArt';
import './Board.css';

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
  isTauntTarget: boolean;
  onClick: () => void;
}

function Lane({ unit, laneIndex, isSelected, isAttacker, isProtected, isTauntTarget, onClick }: LaneProps) {
  const theme = unit ? getCardTheme(unit.templateId) : null;

  let borderColor = '#161616';
  let bg = BOARD.emptyLane;
  let shadow = 'inset 0 2px 8px #00000060';

  if (isSelected)         { borderColor = '#ffd700'; bg = '#12100a'; shadow = '0 0 12px #ffd70050'; }
  else if (isTauntTarget) { borderColor = '#f59e0b80'; bg = '#0f0c06'; shadow = '0 0 8px #f59e0b30'; }
  else if (isAttacker)    { borderColor = '#3b82f6'; bg = '#08090f'; shadow = '0 0 8px #3b82f620'; }
  else if (unit && theme) { borderColor = theme.border + '80'; bg = theme.darkAccent; shadow = `0 1px 4px #00000050, inset 0 1px 0 ${theme.accent}08`; }

  const classes = ['board-lane'];
  if (!unit) classes.push('empty');
  if (isTauntTarget) classes.push('taunt-target');

  return (
    <div
      className={classes.join(' ')}
      onClick={isProtected ? undefined : onClick}
      style={{
        border: `1.5px solid ${borderColor}`,
        background: bg,
        boxShadow: shadow,
        opacity: isProtected ? 0.25 : 1,
        cursor: isProtected ? 'default' : 'pointer',
      }}
    >
      {/* Lane number */}
      <div style={{ fontSize: 7, color: '#1e1e1e', letterSpacing: 1, fontFamily: FONT_BODY }}>{laneIndex + 1}</div>

      {unit && theme ? (
        <div className="board-unit">
          {/* Accent stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: theme.accent, opacity: 0.6, borderRadius: '6px 6px 0 0',
          }} />

          {/* Mini art */}
          <CardArt templateId={unit.templateId} accent={theme.accent} size={30} />

          {/* Name */}
          <div style={{
            fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 8,
            color: '#d1d5db', textAlign: 'center', lineHeight: 1.2,
            textShadow: `0 0 4px ${theme.accent}30`,
            maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            padding: '0 2px',
          }}>
            {unit.name}
          </div>

          {/* HP bar */}
          <HpBar current={unit.currentHp} max={unit.maxHp} />

          {/* Keywords */}
          {unit.keywords.length > 0 && (
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {unit.keywords.map(kw => (
                <span key={kw} style={{
                  fontSize: 6, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                  color: KEYWORD_COLORS[kw] ?? '#888',
                  fontFamily: FONT_BODY,
                }}>
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Mini stat orbs */}
          <div className="mini-stat-row">
            <div className="mini-stat atk">{unit.atk}</div>
            <div className="mini-stat hp">{unit.currentHp}</div>
          </div>

          {/* Shield overlay */}
          {unit.shieldActive && <div className="shield-overlay" />}

          {/* Spent overlay */}
          {unit.hasAttacked && <div className="spent-overlay" />}
          {unit.hasAttacked && (
            <div style={{
              fontSize: 7, color: '#ef4444', fontWeight: 700, letterSpacing: 1,
              fontFamily: FONT_BODY, textTransform: 'uppercase',
            }}>SPENT</div>
          )}
        </div>
      ) : (
        <div className="lane-plus">+</div>
      )}
    </div>
  );
}

function RowLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <div style={{
      fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase',
      color: active ? '#4b5563' : '#1a1a1a', fontWeight: 600,
      flexShrink: 0, padding: '1px 4px',
      fontFamily: FONT_HEADING,
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
    const isBackline = row === 'backline';
    const isOpponentRow = phase === 'combat' && p !== activePlayer;
    const tauntLanes = isOpponentRow && selectedAttackerLane !== null ? getTauntLanes(pl) : [];

    const rowBg = p === 'B'
      ? (isBackline ? BOARD.playerB.backline : BOARD.playerB.frontline)
      : (isBackline ? BOARD.playerA.backline : BOARD.playerA.frontline);

    const isActiveTerritory = p === activePlayer;

    return (
      <div
        className={`board-row ${isActiveTerritory ? 'territory-active' : ''}`}
        style={{ background: rowBg }}
      >
        {pl[row].map((unit, i) => {
          const protected_ = row === 'backline' && !isExposed(i, pl);
          const canAtk = inCombat && !!unit && !unit.hasAttacked && !protected_;
          const isSel = inCombat && selectedAttackerLane === i && selectedAttackerRow === row;
          const isTaunt = isOpponentRow && tauntLanes.length > 0 && tauntLanes.includes(i) && !!unit;
          return (
            <Lane
              key={i}
              unit={unit}
              laneIndex={i}
              isSelected={isSel}
              isAttacker={canAtk}
              isProtected={protected_}
              isTauntTarget={isTaunt}
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
        padding: '5px 4px', flexShrink: 0,
      }}>
        {/* Player avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: active
            ? 'radial-gradient(circle at 40% 40%, #fde68a, #d97706)'
            : 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: `2px solid ${active ? '#fbbf24' : '#1e293b'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: active ? 14 : 12,
          color: active ? '#000' : '#4b5563',
          fontFamily: FONT_HEADING, fontWeight: 700,
          boxShadow: active ? '0 0 8px #fbbf2440' : 'none',
          flexShrink: 0,
        }}>
          {active ? (
            <svg viewBox="0 0 24 24" width={14} height={14}>
              <path d="M2 18 L5 8 L8 13 L12 4 L16 13 L19 8 L22 18 Z"
                fill="#000" opacity="0.8" />
              <circle cx="5" cy="7" r="1.5" fill="#000" opacity="0.6" />
              <circle cx="12" cy="3" r="1.5" fill="#000" opacity="0.6" />
              <circle cx="19" cy="7" r="1.5" fill="#000" opacity="0.6" />
            </svg>
          ) : p}
        </div>

        <span style={{
          fontSize: 12, fontWeight: active ? 700 : 400,
          color: active ? '#e5e7eb' : '#374151',
          fontFamily: FONT_HEADING,
          minWidth: 60, letterSpacing: 0.5,
        }}>
          Player {p}
        </span>

        {/* HP bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <div style={{
            flex: 1, height: 8, background: '#111', borderRadius: 4, overflow: 'hidden',
            border: '1px solid #1a1a1a', position: 'relative',
          }}>
            <div style={{
              width: `${hpPct * 100}%`, height: '100%',
              background: `linear-gradient(90deg, ${hpColor}cc, ${hpColor})`,
              borderRadius: 3, transition: 'width 0.4s',
            }} />
          </div>
          <span style={{
            fontSize: 13, color: hpColor, fontWeight: 800,
            minWidth: 24, textAlign: 'right',
            fontFamily: FONT_HEADING,
            textShadow: `0 0 8px ${hpColor}40`,
          }}>
            {pl.coreHp}
          </span>
        </div>

        {/* Energy diamonds */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {Array.from({ length: Math.min(pl.energy, 10) }, (_, i) => (
            <div key={i} className="energy-diamond filled" />
          ))}
          {Array.from({ length: Math.max(0, 6 - pl.energy) }, (_, i) => (
            <div key={`empty-${i}`} className="energy-diamond empty" />
          ))}
          <span style={{
            fontSize: 10, color: '#fbbf24', fontWeight: 700,
            fontFamily: FONT_HEADING, marginLeft: 2,
          }}>
            {pl.energy}
          </span>
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

      {/* Center divider — battlefield line */}
      <div style={{ flexShrink: 0, margin: '4px 0', position: 'relative' }}>
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BOARD.divider} 15%, ${BOARD.divider}cc 50%, ${BOARD.divider} 85%, transparent)`,
        }} />
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
          fontSize: 8, letterSpacing: 3, color: BOARD.divider, fontWeight: 700,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          textShadow: `0 0 8px ${BOARD.divider}80`,
          fontFamily: FONT_HEADING,
        }}>
          battlefield
        </div>
      </div>

      <RowLabel label="Frontline" active={aActive} />
      {renderRow('A', 'frontline')}
      <RowLabel label="Backline" active={aActive} />
      {renderRow('A', 'backline')}
      <PlayerInfo p="A" />
    </div>
  );
}
