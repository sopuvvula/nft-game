import { GameState, PlayerState, Card, Player, Keyword } from './types';

interface CardTemplate {
  templateId: string;
  name: string;
  cost: number;
  atk: number;
  hp: number;
  keywords: Keyword[];
}

const CARD_TEMPLATES: CardTemplate[] = [
  { templateId: 'vanguard',     name: 'Vanguard',     cost: 2, atk: 1, hp: 4, keywords: [] },
  { templateId: 'striker',      name: 'Striker',      cost: 2, atk: 2, hp: 3, keywords: [] },
  { templateId: 'glass-cannon', name: 'Glass Cannon', cost: 3, atk: 4, hp: 2, keywords: ['shield'] },
  { templateId: 'sentinel',     name: 'Sentinel',     cost: 3, atk: 1, hp: 6, keywords: ['taunt'] },
  { templateId: 'phantom',      name: 'Phantom',      cost: 2, atk: 3, hp: 2, keywords: ['piercing'] },
  { templateId: 'bulwark',      name: 'Bulwark',      cost: 3, atk: 0, hp: 5, keywords: ['taunt'] },
  { templateId: 'lancer',       name: 'Lancer',       cost: 3, atk: 3, hp: 3, keywords: ['piercing'] },
];

// 14-card deck: 3 + 2 + 2 + 2 + 2 + 2 + 1
const COPIES: Record<string, number> = {
  vanguard: 3,
  striker: 2,
  'glass-cannon': 2,
  sentinel: 2,
  phantom: 2,
  bulwark: 2,
  lancer: 1,
};

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
    for (let i = 0; i < COPIES[t.templateId]; i++) {
      cards.push({
        instanceId: `${playerPrefix}-${t.templateId}-${i}`,
        templateId: t.templateId,
        name: t.name,
        cost: t.cost,
        atk: t.atk,
        hp: t.hp,
        keywords: t.keywords,
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
    energy: 2,
    hand: deck.slice(0, 5),
    deck: deck.slice(5),
    discard: [],
    frontline: [null, null, null, null, null],
    backline: [null, null, null, null, null],
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
    selectedAttackerRow: null,
    log: ["Game started. Player A's turn. (Main Phase)"],
    winner: null,
    turnNumber: 1,
  };
}
