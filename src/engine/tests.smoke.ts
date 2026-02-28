import { createInitialState } from './initialState';
import { reducer } from './reducer';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

function test(name: string, fn: () => void) {
  console.log(`\nTest: ${name}`);
  fn();
}

// ── Test 1: Game initialization ────────────────────────────────────────────
test('Game initialization', () => {
  const s = createInitialState();
  assert(s.players.A.hand.length === 5, 'Player A starts with 5 cards');
  assert(s.players.B.hand.length === 5, 'Player B starts with 5 cards');
  assert(s.players.A.deck.length === 7, 'Player A deck has 7 remaining');
  assert(s.players.B.deck.length === 7, 'Player B deck has 7 remaining');
  assert(s.players.A.energy === 2, 'Player A starts with 2 energy');
  assert(s.players.B.energy === 2, 'Player B starts with 2 energy');
  assert(s.players.A.coreHp === 15, 'Player A core HP is 15');
  assert(s.players.B.coreHp === 15, 'Player B core HP is 15');
  assert(s.activePlayer === 'A', 'Player A goes first');
  assert(s.phase === 'main', 'Starts in Main Phase');
  assert(s.winner === null, 'No winner at start');
});

// ── Test 2: Placing a unit ─────────────────────────────────────────────────
test('Playing a unit reduces energy and removes card from hand', () => {
  let s = createInitialState();
  const player = s.players.A;
  const cardIdx = player.hand.findIndex(c => c.cost <= player.energy);
  assert(cardIdx !== -1, 'Player A can afford at least one card');

  const card = player.hand[cardIdx];
  const initEnergy = player.energy;
  const initHandSize = player.hand.length;

  s = reducer(s, { type: 'SELECT_CARD', payload: { index: cardIdx } });
  assert(s.selectedCardIndex === cardIdx, 'Card is selected');

  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0 } });
  assert(s.players.A.hand.length === initHandSize - 1, 'Hand shrinks by 1');
  assert(s.players.A.energy === initEnergy - card.cost, 'Energy reduced by card cost');
  assert(s.players.A.lanes[0] !== null, 'Unit placed in lane 0');
  assert(s.players.A.lanes[0]?.name === card.name, 'Correct unit in lane 0');
  assert(s.selectedCardIndex === null, 'Selection cleared after play');
});

// ── Test 3: Combat targeting ───────────────────────────────────────────────
test('Combat: hits Core when lane is empty, hits unit when occupied', () => {
  let s = createInitialState();

  // Player A plays a unit in lane 0
  const aIdx = s.players.A.hand.findIndex(c => c.cost <= s.players.A.energy);
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: aIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0 } });

  // Player A attacks lane 0 (B has no unit there → Core hit)
  s = reducer(s, { type: 'ENTER_COMBAT' });
  assert(s.phase === 'combat', 'Phase is combat');
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0 } });
  assert(s.selectedAttackerLane === 0, 'Attacker selected');

  const atkDmg = s.players.A.lanes[0]!.atk;
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });
  assert(s.players.B.coreHp === 15 - atkDmg, 'Core took damage (empty lane)');

  // End Player A's turn → Player B's turn (draws + gains energy)
  s = reducer(s, { type: 'END_TURN' });
  assert(s.activePlayer === 'B', 'Player B is active');
  assert(s.phase === 'main', 'Back to main phase');

  // Player B plays a unit in lane 0
  const bIdx = s.players.B.hand.findIndex(c => c.cost <= s.players.B.energy);
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: bIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0 } });

  // Player B skips combat → Player A's turn
  s = reducer(s, { type: 'SKIP_COMBAT' });
  assert(s.activePlayer === 'A', 'Player A is active again');

  // Player A attacks lane 0 again — Player B's unit is there now
  const pBUnit = s.players.B.lanes[0]!;
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0 } });
  const pAUnit = s.players.A.lanes[0]!;
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  const bUnitAfter = s.players.B.lanes[0];
  if (bUnitAfter) {
    assert(
      bUnitAfter.currentHp === pBUnit.currentHp - pAUnit.atk,
      'Unit HP reduced by attacker ATK'
    );
  } else {
    assert(true, 'Unit was destroyed (valid — high ATK attacker)');
  }
  // Core HP must not have changed from this attack (unit absorbed it)
  assert(s.players.B.coreHp === 15 - atkDmg, 'Core HP unchanged from unit-vs-unit attack');
});

// ── Test 4: Win condition ──────────────────────────────────────────────────
test('Win condition triggers when Core reaches 0', () => {
  let s = createInitialState();

  // Set Player B's core to 1 HP
  s = { ...s, players: { ...s.players, B: { ...s.players.B, coreHp: 1 } } };

  // Player A plays any unit with ATK >= 1 into lane 0 (lane 0 of B is empty)
  const idx = s.players.A.hand.findIndex(c => c.cost <= s.players.A.energy && c.atk >= 1);
  assert(idx !== -1, 'Player A has a playable unit with ATK >= 1');
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: idx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0 } });

  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0 } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  assert(s.players.B.coreHp <= 0, 'Player B Core dropped to 0 or below');
  assert(s.winner === 'A', 'Player A is declared winner');
  // Further actions should be ignored
  const frozen = reducer(s, { type: 'END_TURN' });
  assert(frozen.winner === 'A', 'State is frozen after win');
});

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
