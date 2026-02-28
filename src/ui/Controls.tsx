import { GameState, Action } from '../engine/types';

interface ControlsProps {
  state: GameState;
  dispatch: (action: Action) => void;
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 14,
  cursor: 'pointer',
  background: '#1e1e1e',
  color: '#eee',
  border: '1px solid #555',
};

export function Controls({ state, dispatch }: ControlsProps) {
  const { phase, winner, activePlayer } = state;

  if (winner) {
    return (
      <div style={{ textAlign: 'center', padding: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#4f4' }}>
          Player {winner} Wins!
        </div>
        <button style={{ ...btnStyle, marginTop: 12 }} onClick={() => window.location.reload()}>
          New Game
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#888' }}>
        Player {activePlayer} &mdash; {phase === 'main' ? 'Main Phase' : 'Combat Phase'}:
      </span>

      {phase === 'main' && (
        <>
          <button style={btnStyle} onClick={() => dispatch({ type: 'ENTER_COMBAT' })}>
            ⚔ Enter Combat
          </button>
          <button style={btnStyle} onClick={() => dispatch({ type: 'SKIP_COMBAT' })}>
            ⏭ Skip &amp; End Turn
          </button>
        </>
      )}

      {phase === 'combat' && (
        <button style={btnStyle} onClick={() => dispatch({ type: 'END_TURN' })}>
          ✓ End Turn
        </button>
      )}
    </div>
  );
}
