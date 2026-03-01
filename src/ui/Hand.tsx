import { GameState, Card } from '../engine/types';
import { canAffordCard } from '../engine/selectors';
import { getCardTheme, KEYWORD_COLORS, FONT_HEADING, FONT_BODY } from './theme';
import { CardArt } from './CardArt';
import './Hand.css';

interface CardViewProps {
  card: Card;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
  fanStyle?: React.CSSProperties;
}

function CardView({ card, isSelected, canAfford, onClick, fanStyle }: CardViewProps) {
  const theme = getCardTheme(card.templateId);

  const classes = ['hand-card'];
  if (canAfford) classes.push('affordable');
  if (isSelected) classes.push('selected');

  return (
    <div
      className={classes.join(' ')}
      onClick={canAfford ? onClick : undefined}
      style={{
        border: `2px solid ${isSelected ? '#ffd700' : canAfford ? theme.border : '#1a1a1a'}`,
        background: theme.gradient,
        opacity: canAfford ? 1 : 0.35,
        cursor: canAfford ? 'pointer' : 'default',
        boxShadow: isSelected
          ? `0 0 18px ${theme.accent}60, inset 0 1px 0 ${theme.accent}25`
          : canAfford ? `0 4px 16px #00000090, 0 0 4px ${theme.accent}10` : 'none',
        // @ts-expect-error CSS custom property
        '--glow-color': isSelected ? `${theme.accent}80` : undefined,
        ...fanStyle,
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: theme.accent, opacity: canAfford ? 0.8 : 0.2,
        borderRadius: '10px 10px 0 0',
      }} />

      {/* Cost gem */}
      <div className="cost-gem">{card.cost}</div>

      {/* Art panel */}
      <div className="card-art-panel" style={{
        background: theme.artBg,
        borderBottom: `1px solid ${theme.border}40`,
      }}>
        <CardArt templateId={card.templateId} accent={theme.accent} size={54} />
      </div>

      {/* Name banner */}
      <div className="card-name-banner" style={{
        textShadow: `0 0 6px ${theme.accent}40`,
      }}>
        {card.name}
      </div>

      {/* Keywords */}
      {card.keywords.length > 0 && (
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, padding: '0 4px' }}>
          {card.keywords.map(kw => (
            <span key={kw} className="keyword-badge" style={{
              color: KEYWORD_COLORS[kw] ?? '#888',
              borderColor: (KEYWORD_COLORS[kw] ?? '#888') + '40',
              background: (KEYWORD_COLORS[kw] ?? '#888') + '10',
            }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* ATK orb */}
      <div className="stat-orb atk">{card.atk}</div>

      {/* HP orb */}
      <div className="stat-orb hp">{card.hp}</div>

      {/* Selection indicator */}
      {isSelected && <div className="card-selected-bar" />}
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
      <div style={{ color: '#374151', fontSize: 12, padding: '6px 0', fontStyle: 'italic', fontFamily: FONT_BODY }}>
        Hand hidden during Combat Phase.
      </div>
    );
  }

  const handSize = player.hand.length;

  // Fan layout: compute rotation and Y offset for each card
  function getFanStyle(index: number, total: number): React.CSSProperties {
    if (total <= 1) return {};
    const mid = (total - 1) / 2;
    const offset = index - mid;
    const maxRot = total > 5 ? 4 : 3;
    const maxY = total > 5 ? 6 : 4;
    const rot = offset * maxRot;
    const yOff = Math.abs(offset) * maxY;
    return {
      transform: `rotate(${rot}deg) translateY(${yOff}px)`,
    };
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 8, display: 'flex', gap: 12, fontFamily: FONT_BODY }}>
        <span style={{ fontFamily: FONT_HEADING, fontWeight: 600, color: '#6b7280' }}>Player {activePlayer}</span>
        <span style={{ color: '#374151' }}>Hand: {player.hand.length}</span>
        <span style={{ color: '#374151' }}>Deck: {player.deck.length}</span>
        <span style={{ color: '#374151' }}>Discard: {player.discard.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'flex-end', padding: '0 20px 8px' }}>
        {player.hand.map((card, i) => (
          <CardView
            key={card.instanceId}
            card={card}
            isSelected={selectedCardIndex === i}
            canAfford={canAffordCard(state, i)}
            onClick={() => onSelectCard(i)}
            fanStyle={getFanStyle(i, handSize)}
          />
        ))}
        {player.hand.length === 0 && (
          <div style={{ color: '#374151', fontSize: 12, fontStyle: 'italic', fontFamily: FONT_BODY }}>No cards in hand.</div>
        )}
      </div>
    </div>
  );
}
