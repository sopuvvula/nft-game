import { useReducer } from 'react';
import { createInitialState } from './engine/initialState';
import { reducer } from './engine/reducer';
import { Action, Player, Row } from './engine/types';
import { Board } from './ui/Board';
import { Hand } from './ui/Hand';
import { Controls } from './ui/Controls';
import { Log } from './ui/Log';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  const handleLaneClick = (player: Player, row: Row, laneIndex: number) => {
    const { activePlayer, phase, selectedCardIndex, selectedAttackerLane, selectedAttackerRow } = state;

    if (phase === 'main') {
      if (player === activePlayer && selectedCardIndex !== null) {
        dispatch({ type: 'PLAY_CARD', payload: { laneIndex, row } });
      }
    } else if (phase === 'combat') {
      if (player === activePlayer) {
        if (state.players[activePlayer][row][laneIndex]) {
          dispatch({ type: 'SELECT_ATTACKER', payload: { laneIndex, row } });
        }
      } else {
        if (selectedAttackerLane !== null && selectedAttackerRow !== null) {
          dispatch({ type: 'ATTACK', payload: { targetLaneIndex: laneIndex } });
        }
      }
    }
  };

  const handleSelectCard = (index: number) => {
    if (state.selectedCardIndex === index) dispatch({ type: 'DESELECT_CARD' });
    else dispatch({ type: 'SELECT_CARD', payload: { index } });
  };

  const { activePlayer, phase, turnNumber, selectedCardIndex, selectedAttackerLane, selectedAttackerRow } = state;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'inherit', color: '#e5e7eb', background: '#0d0d0d' }}>

      {/* ── Main column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, gap: 10, minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' }}>
            TCG Blueprint
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#374151' }}>Turn {turnNumber}</span>
            <span style={{ color: '#1f2937' }}>·</span>
            <span style={{ fontSize: 11, color: '#4b5563' }}>Player {activePlayer}</span>
            <span style={{ color: '#1f2937' }}>·</span>
            {/* Phase badge */}
            <span style={{
              padding: '2px 8px', borderRadius: 4,
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              background: phase === 'combat' ? '#450a0a' : '#052e16',
              color: phase === 'combat' ? '#fca5a5' : '#86efac',
              border: `1px solid ${phase === 'combat' ? '#7f1d1d' : '#14532d'}`,
            }}>
              {phase}
            </span>
            {selectedCardIndex !== null && (
              <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 600 }}>● card selected</span>
            )}
            {selectedAttackerLane !== null && (
              <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 600 }}>
                ● {selectedAttackerRow} {selectedAttackerLane + 1}
              </span>
            )}
          </div>
        </div>

        {/* Board */}
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
        width: 240, borderLeft: '1px solid #111',
        display: 'flex', flexDirection: 'column',
        padding: '12px 10px', gap: 8, overflow: 'hidden',
        background: '#080808',
      }}>
        <div style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>
          Action Log
        </div>
        <Log messages={state.log} />
      </div>

    </div>
  );
}
