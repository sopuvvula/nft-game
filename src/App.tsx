import { useReducer } from 'react';
import { createInitialState } from './engine/initialState';
import { reducer } from './engine/reducer';
import { Action, Player } from './engine/types';
import { Board } from './ui/Board';
import { Hand } from './ui/Hand';
import { Controls } from './ui/Controls';
import { Log } from './ui/Log';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  const handleLaneClick = (player: Player, laneIndex: number) => {
    const { activePlayer, phase, selectedCardIndex, selectedAttackerLane } = state;

    if (phase === 'main') {
      if (player === activePlayer && selectedCardIndex !== null) {
        dispatch({ type: 'PLAY_CARD', payload: { laneIndex } });
      }
    } else if (phase === 'combat') {
      if (player === activePlayer) {
        if (state.players[activePlayer].lanes[laneIndex]) {
          dispatch({ type: 'SELECT_ATTACKER', payload: { laneIndex } });
        }
      } else {
        if (selectedAttackerLane !== null) {
          dispatch({ type: 'ATTACK', payload: { targetLaneIndex: laneIndex } });
        }
      }
    }
  };

  const handleSelectCard = (index: number) => {
    if (state.selectedCardIndex === index) {
      dispatch({ type: 'DESELECT_CARD' });
    } else {
      dispatch({ type: 'SELECT_CARD', payload: { index } });
    }
  };

  const { activePlayer, phase, turnNumber, selectedCardIndex, selectedAttackerLane } = state;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'sans-serif', color: '#eee', background: '#0d0d0d' }}>

      {/* ── Main column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, gap: 10, minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexShrink: 0 }}>
          <h2 style={{ margin: 0, color: '#4af', fontSize: 18 }}>TCG Blueprint</h2>
          <span style={{ fontSize: 12, color: '#666' }}>
            Turn {turnNumber} &nbsp;|&nbsp; Player {activePlayer} &nbsp;|&nbsp; {phase.toUpperCase()}
            {selectedCardIndex !== null && ' — card selected'}
            {selectedAttackerLane !== null && ` — attacker: lane ${selectedAttackerLane + 1}`}
          </span>
        </div>

        {/* Board — grows to fill available space */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <Board state={state} onLaneClick={handleLaneClick} />
        </div>

        {/* Controls */}
        <div style={{ flexShrink: 0 }}>
          <Controls state={state} dispatch={dispatch as (a: Action) => void} />
        </div>

        {/* Hand */}
        <div style={{ flexShrink: 0 }}>
          <Hand state={state} onSelectCard={handleSelectCard} />
        </div>

      </div>

      {/* ── Log sidebar ── */}
      <div style={{
        width: 260,
        borderLeft: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        padding: 12,
        gap: 6,
        overflow: 'hidden',
        background: '#0a0a0a',
      }}>
        <div style={{ fontSize: 11, color: '#444', flexShrink: 0 }}>Action Log</div>
        <Log messages={state.log} />
      </div>

    </div>
  );
}
