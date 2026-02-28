You are an expert full-stack engineer. Build a minimal, clean Web “blueprint” prototype for a tactical lane-based TCG (rules-first, ugly UI ok). The goal is to validate the core loop and rules engine quickly, so prioritize correctness, simplicity, and fast iteration.

TECH / SETUP
- Use React + TypeScript + Vite.
- No backend. Local state only.
- No external UI libraries.
- Keep the game engine as pure logic (no React imports inside engine).
- Provide a runnable project: package.json scripts, Vite config, and all source files.

PROJECT STRUCTURE
- src/
  - engine/
    - types.ts
    - initialState.ts
    - reducer.ts
    - rules.ts
    - selectors.ts
    - tests.smoke.ts (simple sanity checks runnable via npm test or npm run test:smoke)
  - ui/
    - Board.tsx
    - Hand.tsx
    - Controls.tsx
    - Log.tsx
  - App.tsx
  - main.tsx
  - styles.css

CORE GAME CONCEPT (PHASE 1)
Board:
- 5 frontline lanes per player (no backline in v0.1).
- Each lane can hold at most 1 unit.
- Each player has a Core with HP (start at 15).
- Win when opponent Core HP <= 0.

Turn Structure (Yu-Gi-Oh style, one-direction combat):
- Two players: A and B.
- Each full round is A’s turn then B’s turn.
- Each player turn:
  1) Start Phase: draw 1 card.
  2) Resource Phase: gain +2 Energy (cap at 6).
  3) Main Phase: play units from hand into empty lanes by spending Energy.
  4) Combat Phase: active player may declare attacks with their units.
     - Each unit can attack at most once per turn.
     - Default targeting: must attack opposing unit in the same lane if present; otherwise can hit opponent Core directly for unit ATK.
     - No cross-lane attacks in v0.1.
  5) End Phase: end turn, switch active player.

Cards (v0.1 minimal):
- Deck size: 12 (hardcoded).
- Starting hand: 5.
- Only “Unit” cards for v0.1 (no spells yet).
- Create 3 unit card templates:
  1) Vanguard: cost 2, ATK 1, HP 4
  2) Striker: cost 2, ATK 2, HP 3
  3) Glass Cannon: cost 3, ATK 4, HP 2
- When a unit takes damage reducing HP to 0 or less, it is removed from the board and sent to discard.

UI REQUIREMENTS (simple but usable)
- Display both players’ Core HP and Energy.
- Show a 5-lane board for each player (top = Player B, bottom = Player A).
- Each lane shows either empty or unit stats (name, ATK/HP).
- Show current player, current phase, and a simple action log.
- Hand UI for the active player only:
  - List cards with cost and stats.
  - Clicking a card selects it; clicking an empty lane places it if affordable.
- Combat:
  - Provide “Enter Combat Phase” button.
  - In Combat Phase, clicking one of your units selects it as attacker; then clicking the opposing lane triggers an attack following rules:
    - If defender exists in that lane, damage is dealt to defender unit.
    - Else, damage is dealt to opponent Core.
  - Provide “End Turn” button (only available after combat phase, or allow skipping combat with a “Skip Combat” button).

STATE MANAGEMENT
- Use a reducer in src/engine/reducer.ts with typed Actions.
- All game rules should live in src/engine/rules.ts, called by reducer (so it’s easy to port to Unity later).
- Keep the state serializable. Avoid class instances.
- Include clear types: GameState, PlayerState, Card, UnitInstance, Phase, Action types.

QUALITY / CONSTRAINTS
- Keep code readable and small. Prefer simple deterministic logic.
- Add guardrails: illegal actions should not mutate state; instead return state unchanged and log an error message.
- Add at least a few smoke tests in tests.smoke.ts that simulate:
  - game init (hands/decks/energy)
  - placing a unit reduces energy and removes card from hand
  - combat hits unit when present, otherwise hits core
  - win condition triggers when core reaches 0

DELIVERABLE
- Output the complete code for all files (copy/paste ready).
- Include exact commands to run:
  - npm install
  - npm run dev
  - npm run test:smoke (or equivalent)

IMPORTANT
- Do not add NFTs, marketplace, towers, backline, or special keywords yet.
- This is a “blueprint” PoC to validate the loop and position/lane combat, designed to be ported to Unity afterward.