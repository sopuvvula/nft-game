import { GameState, Action } from '../engine/types';

interface ControlsProps {
  state: GameState;
  dispatch: (action: Action) => void;
}

const combatBtn = {
  padding: '8px 18px', fontSize: 13, fontWeight: 600,
  background: 'linear-gradient(135deg, #450a0a, #6b1414)',
  border: '1px solid #7f1d1d', color: '#fecaca', borderRadius: 6, cursor: 'pointer',
} as const;

const skipBtn = {
  padding: '8px 18px', fontSize: 13, fontWeight: 500,
  background: '#111', border: '1px solid #222',
  color: '#6b7280', borderRadius: 6, cursor: 'pointer',
} as const;

const endBtn = {
  padding: '8px 18px', fontSize: 13, fontWeight: 600,
  background: 'linear-gradient(135deg, #0a1f45, #0f2d6b)',
  border: '1px solid #1e3a8a', color: '#bfdbfe', borderRadius: 6, cursor: 'pointer',
} as const;

const newGameBtn = {
  padding: '10px 28px', fontSize: 14, fontWeight: 700,
  background: 'linear-gradient(135deg, #14532d, #166534)',
  border: '1px solid #15803d', color: '#bbf7d0', borderRadius: 8, cursor: 'pointer',
  marginTop: 16,
} as const;

export function Controls({ state, dispatch }: ControlsProps) {
  const { phase, winner, activePlayer } = state;

  if (winner) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24', letterSpacing: -0.5 }}>
          Player {winner} Wins!
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          GG
        </div>
        <button style={newGameBtn} onClick={() => window.location.reload()}>
          New Game
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{
        fontSize: 11, color: '#374151',
        padding: '4px 10px', background: '#0f0f0f',
        borderRadius: 4, border: '1px solid #1a1a1a',
      }}>
        Player {activePlayer}
      </span>

      {phase === 'main' && (
        <>
          <button style={combatBtn} onClick={() => dispatch({ type: 'ENTER_COMBAT' })}>
            ⚔ Enter Combat
          </button>
          <button style={skipBtn} onClick={() => dispatch({ type: 'SKIP_COMBAT' })}>
            Skip &amp; End Turn
          </button>
        </>
      )}

      {phase === 'combat' && (
        <button style={endBtn} onClick={() => dispatch({ type: 'END_TURN' })}>
          End Turn →
        </button>
      )}
    </div>
  );
}
