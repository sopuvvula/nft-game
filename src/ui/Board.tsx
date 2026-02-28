import { GameState, UnitInstance, Player } from '../engine/types';

interface LaneProps {
  unit: UnitInstance | null;
  laneIndex: number;
  isAttacker: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function Lane({ unit, laneIndex, isAttacker, isSelected, onClick }: LaneProps) {
  let borderColor = '#2a2a2a';
  if (isSelected) borderColor = '#ff0';
  else if (isAttacker) borderColor = '#4af';

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        border: `2px solid ${borderColor}`,
        background: isSelected ? '#1e1e0a' : '#111',
        padding: 8,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        transition: 'border-color 0.1s, background 0.1s',
      }}
    >
      <div style={{ fontSize: 10, color: '#3a3a3a' }}>Lane {laneIndex + 1}</div>
      {unit ? (
        <>
          <div style={{ fontWeight: 'bold', fontSize: 13 }}>{unit.name}</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>
            ATK {unit.atk} &nbsp;/&nbsp; HP {unit.currentHp}/{unit.maxHp}
          </div>
          {unit.hasAttacked && (
            <div style={{ fontSize: 10, color: '#f66' }}>✓ attacked</div>
          )}
        </>
      ) : (
        <div style={{ color: '#2a2a2a', fontSize: 20 }}>+</div>
      )}
    </div>
  );
}

interface BoardProps {
  state: GameState;
  onLaneClick: (player: Player, laneIndex: number) => void;
}

export function Board({ state, onLaneClick }: BoardProps) {
  const { players, activePlayer, phase, selectedAttackerLane } = state;

  function laneRow(p: Player) {
    const inCombat = phase === 'combat' && p === activePlayer;
    return (
      <div style={{ flex: 1, display: 'flex', gap: 6 }}>
        {players[p].lanes.map((unit, i) => (
          <Lane
            key={i}
            unit={unit}
            laneIndex={i}
            isAttacker={inCombat && !!unit && !unit.hasAttacked}
            isSelected={inCombat && selectedAttackerLane === i}
            onClick={() => onLaneClick(p, i)}
          />
        ))}
      </div>
    );
  }

  function playerInfo(p: Player) {
    const pl = players[p];
    const active = p === activePlayer;
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 2px',
        flexShrink: 0,
        color: active ? '#4af' : '#555',
        fontWeight: active ? 'bold' : 'normal',
        fontSize: 13,
      }}>
        <span>Player {p} {active ? '▶' : ''}</span>
        <span>♥ {pl.coreHp} &nbsp;|&nbsp; ⚡ {pl.energy}</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {playerInfo('B')}
      {laneRow('B')}

      <div style={{ borderTop: '1px solid #1e1e1e', flexShrink: 0 }} />

      {laneRow('A')}
      {playerInfo('A')}
    </div>
  );
}
