import { GameState, Action } from '../engine/types';
import { FONT_HEADING } from './theme';
import './Controls.css';

interface ControlsProps {
  state: GameState;
  dispatch: (action: Action) => void;
}

export function Controls({ state, dispatch }: ControlsProps) {
  const { phase, winner, activePlayer } = state;

  if (winner) {
    return (
      <div className="win-screen">
        <div className="win-text">
          Victory
        </div>
        <div className="win-subtitle">
          Player {winner} Wins
        </div>
        <button className="tcg-btn new-game" onClick={() => window.location.reload()}>
          New Game
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{
        fontSize: 11, color: '#4b5563',
        padding: '4px 10px', background: '#0f0f0f',
        borderRadius: 4, border: '1px solid #1a1a1a',
        fontFamily: FONT_HEADING, fontWeight: 600, letterSpacing: 0.5,
      }}>
        Player {activePlayer}
      </span>

      {phase === 'main' && (
        <>
          <button className="tcg-btn combat" onClick={() => dispatch({ type: 'ENTER_COMBAT' })}>
            Enter Combat
          </button>
          <button className="tcg-btn skip" onClick={() => dispatch({ type: 'SKIP_COMBAT' })}>
            Skip &amp; End Turn
          </button>
        </>
      )}

      {phase === 'combat' && (
        <button className="tcg-btn end-turn" onClick={() => dispatch({ type: 'END_TURN' })}>
          End Turn
        </button>
      )}
    </div>
  );
}
