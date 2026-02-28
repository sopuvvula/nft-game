import { GameState, PlayerState, UnitInstance, Player } from './types';

export function canPlayCard(
  state: GameState,
  cardIndex: number,
  laneIndex: number
): { ok: boolean; reason?: string } {
  if (state.phase !== 'main') return { ok: false, reason: 'Not in Main Phase' };
  const player = state.players[state.activePlayer];
  if (cardIndex < 0 || cardIndex >= player.hand.length)
    return { ok: false, reason: 'Invalid card index' };
  if (laneIndex < 0 || laneIndex > 4) return { ok: false, reason: 'Invalid lane' };
  const card = player.hand[cardIndex];
  if (card.cost > player.energy) return { ok: false, reason: 'Not enough energy' };
  if (player.lanes[laneIndex] !== null) return { ok: false, reason: 'Lane is occupied' };
  return { ok: true };
}

export function canAttack(
  state: GameState,
  attackerLane: number,
  targetLane: number
): { ok: boolean; reason?: string } {
  if (state.phase !== 'combat') return { ok: false, reason: 'Not in Combat Phase' };
  if (attackerLane < 0 || attackerLane > 4) return { ok: false, reason: 'Invalid attacker lane' };
  if (targetLane < 0 || targetLane > 4) return { ok: false, reason: 'Invalid target lane' };
  if (attackerLane !== targetLane)
    return { ok: false, reason: 'No cross-lane attacks allowed' };
  const attacker = state.players[state.activePlayer].lanes[attackerLane];
  if (!attacker) return { ok: false, reason: 'No unit in attacker lane' };
  if (attacker.hasAttacked) return { ok: false, reason: 'Unit already attacked this turn' };
  return { ok: true };
}

export function applyDamageToUnit(unit: UnitInstance, damage: number): UnitInstance {
  return { ...unit, currentHp: unit.currentHp - damage };
}

export function isUnitDead(unit: UnitInstance): boolean {
  return unit.currentHp <= 0;
}

export function checkWinner(state: GameState): Player | null {
  if (state.players.A.coreHp <= 0) return 'B';
  if (state.players.B.coreHp <= 0) return 'A';
  return null;
}

export function getOpponent(player: Player): Player {
  return player === 'A' ? 'B' : 'A';
}

export function drawCard(
  playerState: PlayerState
): { player: PlayerState; drew: boolean } {
  if (playerState.deck.length === 0) return { player: playerState, drew: false };
  const [drawn, ...rest] = playerState.deck;
  return {
    player: { ...playerState, hand: [...playerState.hand, drawn], deck: rest },
    drew: true,
  };
}

export function gainEnergy(playerState: PlayerState, amount: number, cap = 6): PlayerState {
  return { ...playerState, energy: Math.min(playerState.energy + amount, cap) };
}
