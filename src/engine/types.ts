export type Player = 'A' | 'B';
export type Phase = 'main' | 'combat';

export interface Card {
  instanceId: string;
  templateId: string;
  name: string;
  cost: number;
  atk: number;
  hp: number;
}

export interface UnitInstance {
  instanceId: string;
  templateId: string;
  name: string;
  cost: number;
  atk: number;
  maxHp: number;
  currentHp: number;
  hasAttacked: boolean;
}

export interface PlayerState {
  id: Player;
  coreHp: number;
  energy: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  lanes: (UnitInstance | null)[];
}

export interface GameState {
  players: { A: PlayerState; B: PlayerState };
  activePlayer: Player;
  phase: Phase;
  selectedCardIndex: number | null;
  selectedAttackerLane: number | null;
  log: string[];
  winner: Player | null;
  turnNumber: number;
}

export type Action =
  | { type: 'SELECT_CARD'; payload: { index: number } }
  | { type: 'DESELECT_CARD' }
  | { type: 'PLAY_CARD'; payload: { laneIndex: number } }
  | { type: 'ENTER_COMBAT' }
  | { type: 'SKIP_COMBAT' }
  | { type: 'SELECT_ATTACKER'; payload: { laneIndex: number } }
  | { type: 'ATTACK'; payload: { targetLaneIndex: number } }
  | { type: 'END_TURN' };
