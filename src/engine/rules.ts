import { GameState, PlayerState, UnitInstance, Player, Row } from './types';

export function canPlayCard(
  state: GameState,
  cardIndex: number,
  laneIndex: number,
  row: Row
): { ok: boolean; reason?: string } {
  if (state.phase !== 'main') return { ok: false, reason: 'Not in Main Phase' };
  const player = state.players[state.activePlayer];
  if (cardIndex < 0 || cardIndex >= player.hand.length)
    return { ok: false, reason: 'Invalid card index' };
  if (laneIndex < 0 || laneIndex > 4) return { ok: false, reason: 'Invalid lane' };
  const card = player.hand[cardIndex];
  if (card.cost > player.energy) return { ok: false, reason: 'Not enough energy' };
  if (player[row][laneIndex] !== null) return { ok: false, reason: 'Lane is occupied' };
  return { ok: true };
}

// A backline unit is exposed when no friendly unit occupies the same frontline lane.
export function isExposed(laneIndex: number, playerState: PlayerState): boolean {
  return playerState.frontline[laneIndex] === null;
}

// Returns lanes that have a Taunt unit on the defender's side (frontline or exposed backline).
export function getTauntLanes(defenderPlayer: PlayerState): number[] {
  const lanes: number[] = [];
  for (let i = 0; i < 5; i++) {
    const fl = defenderPlayer.frontline[i];
    if (fl && fl.keywords.includes('taunt')) { lanes.push(i); continue; }
    // Exposed backline taunt also counts
    if (!fl) {
      const bl = defenderPlayer.backline[i];
      if (bl && bl.keywords.includes('taunt')) lanes.push(i);
    }
  }
  return lanes;
}

export function canAttack(
  state: GameState,
  attackerLane: number,
  attackerRow: Row,
  targetLane: number
): { ok: boolean; reason?: string } {
  if (state.phase !== 'combat') return { ok: false, reason: 'Not in Combat Phase' };
  if (attackerLane < 0 || attackerLane > 4) return { ok: false, reason: 'Invalid attacker lane' };
  if (targetLane < 0 || targetLane > 4) return { ok: false, reason: 'Invalid target lane' };
  if (attackerLane !== targetLane) return { ok: false, reason: 'No cross-lane attacks allowed' };
  const activePlayer = state.players[state.activePlayer];
  const attacker = activePlayer[attackerRow][attackerLane];
  if (!attacker) return { ok: false, reason: 'No unit in attacker lane' };
  if (attacker.hasAttacked) return { ok: false, reason: 'Unit already attacked this turn' };
  if (attackerRow === 'backline' && !isExposed(attackerLane, activePlayer))
    return { ok: false, reason: 'Backline unit is protected — frontline lane is occupied' };

  // Taunt enforcement: if defender has Taunt units, must target one of those lanes
  const opp = state.activePlayer === 'A' ? 'B' : 'A';
  const defenderPlayer = state.players[opp];
  const tauntLanes = getTauntLanes(defenderPlayer);
  if (tauntLanes.length > 0 && !tauntLanes.includes(targetLane)) {
    return { ok: false, reason: 'Must attack a lane with a Taunt unit' };
  }

  return { ok: true };
}

// Apply damage to a unit, respecting Shield.
// Returns { unit, absorbed } where absorbed = true if Shield blocked the hit.
export function applyDamageToUnit(
  unit: UnitInstance,
  damage: number
): { unit: UnitInstance; absorbed: boolean } {
  if (unit.shieldActive) {
    return { unit: { ...unit, shieldActive: false }, absorbed: true };
  }
  return { unit: { ...unit, currentHp: unit.currentHp - damage }, absorbed: false };
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
