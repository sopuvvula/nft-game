import { GameState, PlayerState, Card, Player } from './types';

interface CardTemplate {
  templateId: string;
  name: string;
  cost: number;
  atk: number;
  hp: number;
}

const CARD_TEMPLATES: CardTemplate[] = [
  { templateId: 'vanguard', name: 'Vanguard', cost: 2, atk: 1, hp: 4 },
  { templateId: 'striker', name: 'Striker', cost: 2, atk: 2, hp: 3 },
  { templateId: 'glass-cannon', name: 'Glass Cannon', cost: 3, atk: 4, hp: 2 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(playerPrefix: Player): Card[] {
  const cards: Card[] = [];
  for (const t of CARD_TEMPLATES) {
    for (let i = 0; i < 4; i++) {
      cards.push({
        instanceId: `${playerPrefix}-${t.templateId}-${i}`,
        templateId: t.templateId,
        name: t.name,
        cost: t.cost,
        atk: t.atk,
        hp: t.hp,
      });
    }
  }
  return shuffle(cards);
}

function buildPlayer(id: Player): PlayerState {
  const deck = buildDeck(id);
  return {
    id,
    coreHp: 15,
    energy: 2, // resource phase pre-applied for first turn
    hand: deck.slice(0, 5),
    deck: deck.slice(5),
    discard: [],
    lanes: [null, null, null, null, null],
  };
}

export function createInitialState(): GameState {
  return {
    players: {
      A: buildPlayer('A'),
      B: buildPlayer('B'),
    },
    activePlayer: 'A',
    phase: 'main',
    selectedCardIndex: null,
    selectedAttackerLane: null,
    log: ["Game started. Player A's turn. (Main Phase)"],
    winner: null,
    turnNumber: 1,
  };
}
