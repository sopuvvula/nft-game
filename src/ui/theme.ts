// ── Design tokens: single source of truth ──

export const FONT_HEADING = "'Cinzel', 'Times New Roman', serif";
export const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export interface CardTheme {
  gradient: string;
  border: string;
  accent: string;
  highlight: string; // secondary lighter color for gradients
  artBg: string;
  darkAccent: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  vanguard:       { gradient: 'linear-gradient(175deg, #102438, #0a1520)', border: '#2060a0', accent: '#5aadff', highlight: '#a0d4ff', artBg: '#081828', darkAccent: '#0d2040' },
  striker:        { gradient: 'linear-gradient(175deg, #1e1238, #100820)', border: '#5a28a0', accent: '#a070ff', highlight: '#d0b0ff', artBg: '#100a1e', darkAccent: '#180c30' },
  'glass-cannon': { gradient: 'linear-gradient(175deg, #301010, #1a0505)', border: '#a02828', accent: '#ff6060', highlight: '#ffb0a0', artBg: '#1e0808', darkAccent: '#300808' },
  sentinel:       { gradient: 'linear-gradient(175deg, #0a1428, #050a14)', border: '#183060', accent: '#3090e0', highlight: '#80c0f0', artBg: '#060e1c', darkAccent: '#081530' },
  phantom:        { gradient: 'linear-gradient(175deg, #28160a, #140b04)', border: '#705020', accent: '#e09040', highlight: '#ffc070', artBg: '#160c06', darkAccent: '#201008' },
  bulwark:        { gradient: 'linear-gradient(175deg, #0c2820, #061410)', border: '#207050', accent: '#50b870', highlight: '#90e8b0', artBg: '#081810', darkAccent: '#0a2818' },
  lancer:         { gradient: 'linear-gradient(175deg, #280c0c, #180404)', border: '#a02828', accent: '#dd5555', highlight: '#ffa090', artBg: '#1c0606', darkAccent: '#280808' },
};

export const DEFAULT_THEME: CardTheme = {
  gradient: 'linear-gradient(175deg, #151520, #0f0f18)',
  border: '#333',
  accent: '#666',
  highlight: '#999',
  artBg: '#111',
  darkAccent: '#1a1a20',
};

export function getCardTheme(templateId: string): CardTheme {
  return CARD_THEMES[templateId] ?? DEFAULT_THEME;
}

export const KEYWORD_COLORS: Record<string, string> = {
  taunt: '#f59e0b',
  shield: '#38bdf8',
  piercing: '#ef4444',
};

// Board color tokens
export const BOARD = {
  bg: '#08080e',
  playerB: { backline: '#06080f', frontline: '#080a12' },
  playerA: { backline: '#0f0906', frontline: '#100b08' },
  divider: '#1e3a5f',
  emptyLane: '#060608',
  logBg: '#06060a',
};
