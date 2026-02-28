import { GameState, Card } from '../engine/types';
import { canAffordCard } from '../engine/selectors';

const CARD_THEMES: Record<string, { gradient: string; border: string; accent: string }> = {
  'vanguard':      { gradient: 'linear-gradient(175deg, #0f2030, #0a1520)', border: '#1e5080', accent: '#4a9eff' },
  'striker':       { gradient: 'linear-gradient(175deg, #1a0f30, #100820)', border: '#4a2080', accent: '#9060ff' },
  'glass-cannon':  { gradient: 'linear-gradient(175deg, #2a0808, #1a0505)', border: '#802020', accent: '#ff5050' },
  'sentinel':      { gradient: 'linear-gradient(175deg, #081020, #050a14)', border: '#102850', accent: '#2080d0' },
  'phantom':       { gradient: 'linear-gradient(175deg, #201208, #140b04)', border: '#604018', accent: '#d08030' },
  'bulwark':       { gradient: 'linear-gradient(175deg, #0a2018, #061410)', border: '#1a6040', accent: '#40a060' },
  'lancer':        { gradient: 'linear-gradient(175deg, #200808, #180404)', border: '#802020', accent: '#cc4444' },
};

const KEYWORD_COLORS: Record<string, string> = {
  taunt: '#f59e0b',
  shield: '#38bdf8',
  piercing: '#ef4444',
};
function getTheme(templateId: string) {
  return CARD_THEMES[templateId] ?? { gradient: 'linear-gradient(175deg, #151520, #0f0f18)', border: '#333', accent: '#666' };
}

interface CardViewProps {
  card: Card;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

function CardView({ card, isSelected, canAfford, onClick }: CardViewProps) {
  const theme = getTheme(card.templateId);
  return (
    <div
      onClick={canAfford ? onClick : undefined}
      style={{
        position: 'relative',
        width: 78,
        minHeight: 106,
        borderRadius: 8,
        border: `1.5px solid ${isSelected ? '#ffd700' : canAfford ? theme.border : '#1a1a1a'}`,
        background: theme.gradient,
        opacity: canAfford ? 1 : 0.4,
        cursor: canAfford ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px 6px 10px',
        gap: 5,
        boxShadow: isSelected
          ? `0 0 14px ${theme.accent}50, inset 0 1px 0 ${theme.accent}25`
          : canAfford ? '0 2px 8px #00000080' : 'none',
        transition: 'box-shadow 0.15s, border-color 0.15s, opacity 0.15s',
        flexShrink: 0,
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: theme.accent, opacity: canAfford ? 0.8 : 0.2,
        borderRadius: '8px 8px 0 0',
      }} />

      {/* Cost badge */}
      <div style={{
        position: 'absolute', top: 7, left: 7,
        width: 19, height: 19, borderRadius: '50%',
        background: '#fbbf24', color: '#000',
        fontSize: 10, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {card.cost}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: 11, color: '#e5e7eb', textAlign: 'center', lineHeight: 1.2 }}>
        {card.name}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
        <span style={{ color: '#fca5a5' }}>⚔ {card.atk}</span>
        <span style={{ color: '#86efac' }}>♥ {card.hp}</span>
      </div>

      {/* Keywords */}
      {card.keywords.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {card.keywords.map(kw => (
            <span key={kw} style={{
              fontSize: 8, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              color: KEYWORD_COLORS[kw] ?? '#888',
            }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: '#ffd700', borderRadius: '0 0 8px 8px',
        }} />
      )}
    </div>
  );
}

interface HandProps {
  state: GameState;
  onSelectCard: (index: number) => void;
}

export function Hand({ state, onSelectCard }: HandProps) {
  const { players, activePlayer, phase, selectedCardIndex } = state;
  const player = players[activePlayer];

  if (phase !== 'main') {
    return (
      <div style={{ color: '#374151', fontSize: 12, padding: '6px 0', fontStyle: 'italic' }}>
        Hand hidden during Combat Phase.
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 8, display: 'flex', gap: 12 }}>
        <span>Player {activePlayer}</span>
        <span style={{ color: '#374151' }}>Hand: {player.hand.length}</span>
        <span style={{ color: '#374151' }}>Deck: {player.deck.length}</span>
        <span style={{ color: '#374151' }}>Discard: {player.discard.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {player.hand.map((card, i) => (
          <CardView
            key={card.instanceId}
            card={card}
            isSelected={selectedCardIndex === i}
            canAfford={canAffordCard(state, i)}
            onClick={() => onSelectCard(i)}
          />
        ))}
        {player.hand.length === 0 && (
          <div style={{ color: '#374151', fontSize: 12, fontStyle: 'italic' }}>No cards in hand.</div>
        )}
      </div>
    </div>
  );
}
