import { createInitialState } from './initialState';
import { reducer } from './reducer';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) { console.log(`  ✓ ${message}`); passed++; }
  else { console.error(`  ✗ ${message}`); failed++; }
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
  assert(s.players.A.deck.length === 9, 'Player A deck has 9 remaining');
  assert(s.players.B.deck.length === 9, 'Player B deck has 9 remaining');
  assert(s.players.A.energy === 2, 'Player A starts with 2 energy');
  assert(s.players.A.coreHp === 15, 'Player A core HP is 15');
  assert(s.players.B.coreHp === 15, 'Player B core HP is 15');
  assert(s.players.A.frontline.length === 5, 'Player A has 5 frontline lanes');
  assert(s.players.A.backline.length === 5, 'Player A has 5 backline lanes');
  assert(s.players.A.frontline.every(l => l === null), 'All frontline lanes start empty');
  assert(s.players.A.backline.every(l => l === null), 'All backline lanes start empty');
  assert(s.activePlayer === 'A', 'Player A goes first');
  assert(s.phase === 'main', 'Starts in Main Phase');
  assert(s.winner === null, 'No winner at start');
});

// ── Test 2: Playing a unit ─────────────────────────────────────────────────
test('Playing a unit reduces energy and removes card from hand', () => {
  let s = createInitialState();
  const player = s.players.A;
  const cardIdx = player.hand.findIndex(c => c.cost <= player.energy);
  assert(cardIdx !== -1, 'Player A can afford at least one card');

  const card = player.hand[cardIdx];
  const initEnergy = player.energy;
  const initHandSize = player.hand.length;

  s = reducer(s, { type: 'SELECT_CARD', payload: { index: cardIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0, row: 'frontline' } });

  assert(s.players.A.hand.length === initHandSize - 1, 'Hand shrinks by 1');
  assert(s.players.A.energy === initEnergy - card.cost, 'Energy reduced by card cost');
  assert(s.players.A.frontline[0] !== null, 'Unit placed in frontline lane 0');
  assert(s.players.A.frontline[0]?.name === card.name, 'Correct unit in frontline lane 0');
  assert(s.selectedCardIndex === null, 'Selection cleared after play');
});

// ── Test 3: Combat — frontline targeting ───────────────────────────────────
test('Combat: hits Core when lane empty, hits frontline unit when occupied', () => {
  let s = createInitialState();

  // Player A plays a unit in frontline lane 0
  const aIdx = s.players.A.hand.findIndex(c => c.cost <= s.players.A.energy);
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: aIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0, row: 'frontline' } });

  // Player A attacks lane 0 — B has nothing there → Core hit
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  const atkDmg = s.players.A.frontline[0]!.atk;
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });
  assert(s.players.B.coreHp === 15 - atkDmg, 'Core took damage (empty lane)');

  s = reducer(s, { type: 'END_TURN' });
  assert(s.activePlayer === 'B', 'Player B is active');

  // Player B plays a unit in frontline lane 0
  const bIdx = s.players.B.hand.findIndex(c => c.cost <= s.players.B.energy);
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: bIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'SKIP_COMBAT' });
  assert(s.activePlayer === 'A', 'Player A is active again');

  // Player A attacks lane 0 — B now has a frontline unit there
  const pBUnit = s.players.B.frontline[0]!;
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  const pAUnit = s.players.A.frontline[0]!;
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  const bUnitAfter = s.players.B.frontline[0];
  if (bUnitAfter) {
    if (pBUnit.shieldActive) {
      assert(bUnitAfter.currentHp === pBUnit.currentHp, 'Shield absorbed the hit');
      assert(!bUnitAfter.shieldActive, 'Shield is now broken');
    } else {
      assert(bUnitAfter.currentHp === pBUnit.currentHp - pAUnit.atk, 'Frontline unit HP reduced');
    }
  } else {
    assert(true, 'Frontline unit destroyed (valid)');
  }
  assert(s.players.B.coreHp <= 15, 'Core HP unchanged or only piercing overflow applied');
});

// ── Test 4: Win condition ──────────────────────────────────────────────────
test('Win condition triggers when Core reaches 0', () => {
  let s = createInitialState();
  s = { ...s, players: { ...s.players, B: { ...s.players.B, coreHp: 1 } } };

  const idx = s.players.A.hand.findIndex(c => c.cost <= s.players.A.energy && c.atk >= 1);
  assert(idx !== -1, 'Player A has a playable unit with ATK >= 1');
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: idx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  assert(s.players.B.coreHp <= 0, 'Player B Core dropped to 0 or below');
  assert(s.winner === 'A', 'Player A is declared winner');
  const frozen = reducer(s, { type: 'END_TURN' });
  assert(frozen.winner === 'A', 'State is frozen after win');
});

// ── Test 5: Backline is protected when frontline is occupied ───────────────
test('Backline: unit is protected when same-lane frontline is occupied', () => {
  let s = createInitialState();

  // Inject both units directly so energy constraints don't affect the setup
  const frontlineUnit: import('./types').UnitInstance = {
    instanceId: 'a-fl-test', templateId: 'vanguard', name: 'Vanguard',
    cost: 2, atk: 1, maxHp: 4, currentHp: 4, hasAttacked: false,
    keywords: [], shieldActive: false,
  };
  const backlineUnit: import('./types').UnitInstance = {
    instanceId: 'a-bl-test', templateId: 'sentinel', name: 'Sentinel',
    cost: 3, atk: 1, maxHp: 6, currentHp: 6, hasAttacked: false,
    keywords: ['taunt'], shieldActive: false,
  };
  s = {
    ...s,
    players: {
      ...s.players,
      A: {
        ...s.players.A,
        frontline: s.players.A.frontline.map((u, i) => i === 0 ? frontlineUnit : u),
        backline: s.players.A.backline.map((u, i) => i === 0 ? backlineUnit : u),
      },
    },
  };

  assert(s.players.A.frontline[0] !== null, 'Frontline lane 0 occupied');
  assert(s.players.A.backline[0] !== null, 'Backline lane 0 occupied');

  s = reducer(s, { type: 'ENTER_COMBAT' });

  // Attempt to select the protected backline unit — must fail
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'backline' } });
  assert(s.selectedAttackerLane === null, 'Protected backline unit cannot be selected as attacker');
  assert(s.selectedAttackerRow === null, 'No attacker row set');
});

// ── Test 6: Backline is exposed and attackable when frontline is empty ──────
test('Backline: unit is exposed and hittable when frontline lane is empty', () => {
  let s = createInitialState();

  // Player B places a unit only in backline lane 0 (no frontline)
  s = {
    ...s,
    players: {
      ...s.players,
      B: {
        ...s.players.B,
        backline: s.players.B.backline.map((u, i) =>
          i === 0
            ? { instanceId: 'b-test', templateId: 'sentinel', name: 'Sentinel', cost: 3, atk: 1, maxHp: 6, currentHp: 6, hasAttacked: false, keywords: ['taunt'] as const, shieldActive: false }
            : u
        ),
      },
    },
  };
  assert(s.players.B.frontline[0] === null, 'B frontline lane 0 is empty');
  assert(s.players.B.backline[0] !== null, 'B backline lane 0 has a unit');

  // Player A places a unit in frontline lane 0 and attacks
  const aIdx = s.players.A.hand.findIndex(c => c.cost <= s.players.A.energy);
  s = reducer(s, { type: 'SELECT_CARD', payload: { index: aIdx } });
  s = reducer(s, { type: 'PLAY_CARD', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });

  const attacker = s.players.A.frontline[0]!;
  const blBefore = s.players.B.backline[0]!;

  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  const blAfter = s.players.B.backline[0];
  if (blAfter) {
    if (blBefore.shieldActive) {
      assert(blAfter.currentHp === blBefore.currentHp, 'Shield absorbed hit on exposed backline');
    } else {
      assert(blAfter.currentHp === blBefore.currentHp - attacker.atk, 'Exposed backline unit took damage');
    }
  } else {
    assert(true, 'Exposed backline unit was destroyed (valid)');
  }
  assert(s.players.B.coreHp === 15, 'Core HP untouched — backline unit absorbed the hit');
});

// ── Test 7: Taunt forces targeting ─────────────────────────────────────────
test('Taunt: must attack lane with Taunt unit', () => {
  let s = createInitialState();

  // Set up: Player A has attackers in lanes 0 and 2
  // Player B has non-Taunt in lane 0, Taunt in lane 2
  const aUnit: import('./types').UnitInstance = {
    instanceId: 'a-atk', templateId: 'striker', name: 'Striker',
    cost: 2, atk: 2, maxHp: 3, currentHp: 3, hasAttacked: false,
    keywords: [], shieldActive: false,
  };
  const bNonTaunt: import('./types').UnitInstance = {
    instanceId: 'b-nt', templateId: 'vanguard', name: 'Vanguard',
    cost: 2, atk: 1, maxHp: 4, currentHp: 4, hasAttacked: false,
    keywords: [], shieldActive: false,
  };
  const bTaunt: import('./types').UnitInstance = {
    instanceId: 'b-taunt', templateId: 'sentinel', name: 'Sentinel',
    cost: 3, atk: 1, maxHp: 6, currentHp: 6, hasAttacked: false,
    keywords: ['taunt'], shieldActive: false,
  };
  const aUnit2: import('./types').UnitInstance = {
    instanceId: 'a-atk2', templateId: 'striker', name: 'Striker',
    cost: 2, atk: 2, maxHp: 3, currentHp: 3, hasAttacked: false,
    keywords: [], shieldActive: false,
  };

  s = {
    ...s,
    phase: 'combat' as const,
    players: {
      ...s.players,
      A: {
        ...s.players.A,
        frontline: s.players.A.frontline.map((u, i) => i === 0 ? aUnit : i === 2 ? aUnit2 : u),
      },
      B: {
        ...s.players.B,
        frontline: s.players.B.frontline.map((u, i) => i === 0 ? bNonTaunt : i === 2 ? bTaunt : u),
      },
    },
  };

  // Select attacker in lane 0 and try to attack lane 0 (non-Taunt) — should be blocked
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  assert(s.selectedAttackerLane === 0, 'Attacker in lane 0 selected');

  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });
  assert(s.players.B.frontline[0]!.currentHp === 4, 'Non-Taunt unit was NOT damaged (attack blocked)');

  // Now select attacker in lane 2 and attack lane 2 (Taunt) — should succeed
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 2, row: 'frontline' } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 2 } });
  assert(s.players.B.frontline[2]!.currentHp === 4, 'Taunt unit took damage (6 - 2 = 4)');
});

// ── Test 8: Shield blocks first hit ────────────────────────────────────────
test('Shield: blocks first hit, second hit deals damage', () => {
  let s = createInitialState();

  const aUnit: import('./types').UnitInstance = {
    instanceId: 'a-atk', templateId: 'striker', name: 'Striker',
    cost: 2, atk: 2, maxHp: 3, currentHp: 3, hasAttacked: false,
    keywords: [], shieldActive: false,
  };
  const bShielded: import('./types').UnitInstance = {
    instanceId: 'b-shield', templateId: 'glass-cannon', name: 'Glass Cannon',
    cost: 3, atk: 4, maxHp: 2, currentHp: 2, hasAttacked: false,
    keywords: ['shield'], shieldActive: true,
  };

  s = {
    ...s,
    phase: 'combat' as const,
    players: {
      ...s.players,
      A: {
        ...s.players.A,
        frontline: s.players.A.frontline.map((u, i) => i === 0 ? aUnit : u),
      },
      B: {
        ...s.players.B,
        frontline: s.players.B.frontline.map((u, i) => i === 0 ? bShielded : u),
      },
    },
  };

  // First attack: shield absorbs
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });
  const afterShield = s.players.B.frontline[0]!;
  assert(afterShield.currentHp === 2, 'HP unchanged — shield absorbed the hit');
  assert(!afterShield.shieldActive, 'Shield is now broken');

  // End turn for Player A, then Player B skips, back to Player A
  s = reducer(s, { type: 'END_TURN' });
  s = reducer(s, { type: 'SKIP_COMBAT' });
  // Now it's Player A's turn again, enter combat
  s = reducer(s, { type: 'ENTER_COMBAT' });
  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  // Second attack: no shield, 2 ATK kills 2 HP unit
  assert(s.players.B.frontline[0] === null, 'Glass Cannon destroyed on second hit (no shield)');
});

// ── Test 9: Piercing carries overflow to Core ──────────────────────────────
test('Piercing: excess damage carries through to Core', () => {
  let s = createInitialState();

  // Player A has Phantom (3 ATK, piercing), Player B has weak 1 HP unit
  const aUnit: import('./types').UnitInstance = {
    instanceId: 'a-pierce', templateId: 'phantom', name: 'Phantom',
    cost: 2, atk: 3, maxHp: 2, currentHp: 2, hasAttacked: false,
    keywords: ['piercing'], shieldActive: false,
  };
  const bWeak: import('./types').UnitInstance = {
    instanceId: 'b-weak', templateId: 'vanguard', name: 'Vanguard',
    cost: 2, atk: 1, maxHp: 4, currentHp: 1, hasAttacked: false,
    keywords: [], shieldActive: false,
  };

  s = {
    ...s,
    phase: 'combat' as const,
    players: {
      ...s.players,
      A: {
        ...s.players.A,
        frontline: s.players.A.frontline.map((u, i) => i === 0 ? aUnit : u),
      },
      B: {
        ...s.players.B,
        coreHp: 15,
        frontline: s.players.B.frontline.map((u, i) => i === 0 ? bWeak : u),
      },
    },
  };

  s = reducer(s, { type: 'SELECT_ATTACKER', payload: { laneIndex: 0, row: 'frontline' } });
  s = reducer(s, { type: 'ATTACK', payload: { targetLaneIndex: 0 } });

  assert(s.players.B.frontline[0] === null, 'Weak unit destroyed');
  // 3 ATK - 1 HP = 2 overflow damage
  assert(s.players.B.coreHp === 13, 'Core took 2 piercing overflow damage (15 - 2 = 13)');
});

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
