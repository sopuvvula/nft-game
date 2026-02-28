import { GameState, UnitInstance, Player, Row } from '../engine/types';
import { isExposed } from '../engine/rules';

interface LaneProps {
  unit: UnitInstance | null;
  laneIndex: number;
  isSelected: boolean;
  isAttacker: boolean;   // can be selected as attacker this turn
  isProtected: boolean;  // backline unit shielded by frontline
  onClick: () => void;
}

function Lane({ unit, laneIndex, isSelected, isAttacker, isProtected, onClick }: LaneProps) {
  let borderColor = '#222';
  if (isSelected) borderColor = '#ff0';
  else if (isAttacker) borderColor = '#4af';

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        border: `2px solid ${borderColor}`,
        background: isSelected ? '#1e1e0a' : '#0f0f0f',
        opacity: isProtected ? 0.4 : 1,
        padding: 6,
        cursor: isProtected ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        transition: 'border-color 0.1s, opacity 0.15s',
      }}
    >
      <div style={{ fontSize: 9, color: '#333' }}>{laneIndex + 1}</div>
      {unit ? (
        <>
          <div style={{ fontWeight: 'bold', fontSize: 12 }}>{unit.name}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>
            {unit.atk} / {unit.currentHp}
          </div>
          {unit.hasAttacked && <div style={{ fontSize: 9, color: '#f55' }}>✓</div>}
        </>
      ) : (
        <div style={{ color: '#222', fontSize: 16 }}>+</div>
      )}
    </div>
  );
}

interface RowLabelProps {
  label: string;
  active?: boolean;
}

function RowLabel({ label, active }: RowLabelProps) {
  return (
    <div style={{
      fontSize: 9,
      letterSpacing: 2,
      color: active ? '#4af' : '#2a2a2a',
      textTransform: 'uppercase',
      flexShrink: 0,
      padding: '2px 0',
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
          const canAttack = inCombat && !!unit && !unit.hasAttacked && !protected_;
          const isSelected = inCombat && selectedAttackerLane === i && selectedAttackerRow === row;
          return (
            <Lane
              key={i}
              unit={unit}
              laneIndex={i}
              isSelected={isSelected}
              isAttacker={canAttack}
              isProtected={protected_}
              onClick={() => onLaneClick(p, row, i)}
            />
          );
        })}
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
        padding: '4px 2px',
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

  const isBActive = activePlayer === 'B';
  const isAActive = activePlayer === 'A';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {playerInfo('B')}
      <RowLabel label="Backline" active={isBActive} />
      {renderRow('B', 'backline')}
      <RowLabel label="Frontline" active={isBActive} />
      {renderRow('B', 'frontline')}

      <div style={{ borderTop: '1px solid #1a1a1a', margin: '4px 0', flexShrink: 0 }} />

      <RowLabel label="Frontline" active={isAActive} />
      {renderRow('A', 'frontline')}
      <RowLabel label="Backline" active={isAActive} />
      {renderRow('A', 'backline')}
      {playerInfo('A')}
    </div>
  );
}
