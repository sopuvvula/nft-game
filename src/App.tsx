import { useReducer, useEffect, useState, useRef } from 'react';
import { createInitialState } from './engine/initialState';
import { reducer } from './engine/reducer';
import { Action, Player, Row } from './engine/types';
import { Board } from './ui/Board';
import { Hand } from './ui/Hand';
import { Controls } from './ui/Controls';
import { Log } from './ui/Log';
import { FONT_HEADING, FONT_BODY, BOARD } from './ui/theme';

// Ambient floating particle
function Particle({ delay, left }: { delay: number; left: number }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${left}%`,
      bottom: 0,
      width: 2,
      height: 2,
      borderRadius: '50%',
      background: '#ffffff',
      opacity: 0,
      animation: `particleFloat ${6 + Math.random() * 4}s ${delay}s linear infinite`,
      pointerEvents: 'none',
    }} />
  );
}

// Turn transition banner
function TurnBanner({ player, show }: { player: Player; show: boolean }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      animation: 'fadeInOut 1.4s ease-in-out forwards',
    }}>
      <div style={{
        fontFamily: FONT_HEADING,
        fontSize: 32,
        fontWeight: 900,
        color: '#fbbf24',
        letterSpacing: 4,
        textTransform: 'uppercase',
        textShadow: '0 0 30px #fbbf2460, 0 0 60px #fbbf2420, 0 2px 4px #000',
      }}>
        Player {player}'s Turn
      </div>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const prevTurnRef = useRef(state.turnNumber);

  // Show turn banner on turn change
  useEffect(() => {
    if (state.turnNumber !== prevTurnRef.current) {
      prevTurnRef.current = state.turnNumber;
      setShowTurnBanner(true);
      const timer = setTimeout(() => setShowTurnBanner(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [state.turnNumber]);

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
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: FONT_BODY, color: '#e5e7eb',
      background: BOARD.bg, position: 'relative',
    }}>

      {/* Atmospheric background layers */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 50% 0%, #0a1a3a18 0%, transparent 70%),
          radial-gradient(ellipse 80% 40% at 50% 100%, #1a0a0a18 0%, transparent 70%)
        `,
      }} />
      {/* Subtle grid texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(#ffffff03 1px, transparent 1px),
          linear-gradient(90deg, #ffffff03 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Ambient particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {[12, 28, 45, 62, 78, 88].map((left, i) => (
          <Particle key={i} delay={i * 1.5} left={left} />
        ))}
      </div>

      {/* Turn transition banner */}
      <TurnBanner player={activePlayer} show={showTurnBanner} />

      {/* Main column */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: 16, gap: 10, minWidth: 0, overflow: 'hidden',
        position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            fontSize: 15, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase',
            fontFamily: FONT_HEADING,
            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            TCG Blueprint
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11, color: '#4b5563',
              fontFamily: FONT_HEADING, fontWeight: 600,
            }}>Turn {turnNumber}</span>
            <span style={{ color: '#1f2937' }}>·</span>
            <span style={{
              fontSize: 11, color: '#6b7280',
              fontFamily: FONT_HEADING, fontWeight: 600,
            }}>Player {activePlayer}</span>
            <span style={{ color: '#1f2937' }}>·</span>
            {/* Phase badge */}
            <span style={{
              padding: '2px 10px', borderRadius: 4,
              fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              fontFamily: FONT_HEADING,
              background: phase === 'combat'
                ? 'linear-gradient(135deg, #450a0a, #7f1d1d)'
                : 'linear-gradient(135deg, #052e16, #14532d)',
              color: phase === 'combat' ? '#fca5a5' : '#86efac',
              border: `1px solid ${phase === 'combat' ? '#991b1b' : '#166534'}`,
            }}>
              {phase}
            </span>
            {selectedCardIndex !== null && (
              <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 600, fontFamily: FONT_BODY }}>
                card selected
              </span>
            )}
            {selectedAttackerLane !== null && (
              <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 600, fontFamily: FONT_BODY }}>
                {selectedAttackerRow} {selectedAttackerLane + 1}
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

      {/* Log sidebar */}
      <div style={{
        width: 240, borderLeft: '1px solid #111',
        display: 'flex', flexDirection: 'column',
        padding: '12px 10px', gap: 8, overflow: 'hidden',
        background: BOARD.logBg,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
          fontWeight: 700, flexShrink: 0,
          fontFamily: FONT_HEADING,
          background: 'linear-gradient(135deg, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Action Log
        </div>
        <Log messages={state.log} />
      </div>

    </div>
  );
}
