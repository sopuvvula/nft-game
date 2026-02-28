import { GameState, Card } from '../engine/types';
import { canAffordCard } from '../engine/selectors';

interface CardViewProps {
  card: Card;
  index: number;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

function CardView({ card, isSelected, canAfford, onClick }: CardViewProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? '#ff0' : canAfford ? '#4af' : '#444'}`,
        background: isSelected ? '#2a2a1a' : '#111',
        opacity: canAfford ? 1 : 0.5,
        padding: '8px 10px',
        minWidth: 90,
        cursor: canAfford ? 'pointer' : 'default',
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 13 }}>{card.name}</div>
      <div style={{ fontSize: 11, color: '#fa0' }}>Cost {card.cost}</div>
      <div style={{ fontSize: 11 }}>ATK {card.atk} / HP {card.hp}</div>
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
      <div style={{ color: '#555', fontSize: 12, padding: '4px 0' }}>
        Hand hidden during Combat Phase.
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
        Player {activePlayer} — Hand ({player.hand.length}) &nbsp;|&nbsp; Deck: {player.deck.length} &nbsp;|&nbsp; Discard: {player.discard.length}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {player.hand.map((card, i) => (
          <CardView
            key={card.instanceId}
            card={card}
            index={i}
            isSelected={selectedCardIndex === i}
            canAfford={canAffordCard(state, i)}
            onClick={() => onSelectCard(i)}
          />
        ))}
        {player.hand.length === 0 && (
          <div style={{ color: '#444', fontSize: 12 }}>No cards in hand.</div>
        )}
      </div>
    </div>
  );
}
