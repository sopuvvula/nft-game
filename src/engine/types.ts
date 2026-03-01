export type Player = 'A' | 'B';
export type Phase = 'main' | 'combat';
export type Row = 'frontline' | 'backline';
export type Keyword = 'taunt' | 'shield' | 'piercing';

export interface Card {
  instanceId: string;
  templateId: string;
  name: string;
  cost: number;
  atk: number;
  hp: number;
  keywords: Keyword[];
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
  keywords: Keyword[];
  shieldActive: boolean;
}

export interface PlayerState {
  id: Player;
  coreHp: number;
  energy: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  frontline: (UnitInstance | null)[];
  backline: (UnitInstance | null)[];
}

export interface GameState {
  players: { A: PlayerState; B: PlayerState };
  activePlayer: Player;
  phase: Phase;
  selectedCardIndex: number | null;
  selectedAttackerLane: number | null;
  selectedAttackerRow: Row | null;
  log: string[];
  winner: Player | null;
  turnNumber: number;
}

export type Action =
  | { type: 'SELECT_CARD'; payload: { index: number } }
  | { type: 'DESELECT_CARD' }
  | { type: 'PLAY_CARD'; payload: { laneIndex: number; row: Row } }
  | { type: 'ENTER_COMBAT' }
  | { type: 'SKIP_COMBAT' }
  | { type: 'SELECT_ATTACKER'; payload: { laneIndex: number; row: Row } }
  | { type: 'ATTACK'; payload: { targetLaneIndex: number } }
  | { type: 'END_TURN' };
