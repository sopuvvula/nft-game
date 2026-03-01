// ── Design tokens: single source of truth ──

export const FONT_HEADING = "'Cinzel', 'Times New Roman', serif";
export const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export interface CardTheme {
  gradient: string;
  border: string;
  accent: string;
  artBg: string;
  darkAccent: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  vanguard:       { gradient: 'linear-gradient(175deg, #0f2030, #0a1520)', border: '#1e5080', accent: '#4a9eff', artBg: '#071525', darkAccent: '#0d2040' },
  striker:        { gradient: 'linear-gradient(175deg, #1a0f30, #100820)', border: '#4a2080', accent: '#9060ff', artBg: '#0e0715', darkAccent: '#180c30' },
  'glass-cannon': { gradient: 'linear-gradient(175deg, #2a0808, #1a0505)', border: '#802020', accent: '#ff5050', artBg: '#1a0505', darkAccent: '#300808' },
  sentinel:       { gradient: 'linear-gradient(175deg, #081020, #050a14)', border: '#102850', accent: '#2080d0', artBg: '#050b18', darkAccent: '#081530' },
  phantom:        { gradient: 'linear-gradient(175deg, #201208, #140b04)', border: '#604018', accent: '#d08030', artBg: '#120a03', darkAccent: '#201008' },
  bulwark:        { gradient: 'linear-gradient(175deg, #0a2018, #061410)', border: '#1a6040', accent: '#40a060', artBg: '#061410', darkAccent: '#0a2818' },
  lancer:         { gradient: 'linear-gradient(175deg, #200808, #180404)', border: '#802020', accent: '#cc4444', artBg: '#180404', darkAccent: '#280808' },
};

export const DEFAULT_THEME: CardTheme = {
  gradient: 'linear-gradient(175deg, #151520, #0f0f18)',
  border: '#333',
  accent: '#666',
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
  bg: '#0a0a0f',
  playerB: { backline: '#06080f', frontline: '#080a12' },
  playerA: { backline: '#0f0906', frontline: '#100b08' },
  divider: '#1e3a5f',
  emptyLane: '#080808',
  logBg: '#06060a',
};
