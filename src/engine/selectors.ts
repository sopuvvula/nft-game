import { GameState, Player, Card, UnitInstance } from './types';

export function getActivePlayer(state: GameState) {
  return state.players[state.activePlayer];
}

export function getOpponentPlayer(state: GameState) {
  const opp: Player = state.activePlayer === 'A' ? 'B' : 'A';
  return state.players[opp];
}

export function getSelectedCard(state: GameState): Card | null {
  if (state.selectedCardIndex === null) return null;
  return getActivePlayer(state).hand[state.selectedCardIndex] ?? null;
}

export function getSelectedAttacker(state: GameState): UnitInstance | null {
  if (state.selectedAttackerLane === null) return null;
  return getActivePlayer(state).lanes[state.selectedAttackerLane] ?? null;
}

export function canAffordCard(state: GameState, cardIndex: number): boolean {
  const player = getActivePlayer(state);
  const card = player.hand[cardIndex];
  if (!card) return false;
  return card.cost <= player.energy;
}
