import { GameState, Action, UnitInstance, Card } from './types';
import {
  canPlayCard,
  canAttack,
  applyDamageToUnit,
  isUnitDead,
  checkWinner,
  getOpponent,
  drawCard,
  gainEnergy,
} from './rules';

function addLog(state: GameState, msg: string): GameState {
  return { ...state, log: [...state.log, msg] };
}

export function reducer(state: GameState, action: Action): GameState {
  if (state.winner) return state;

  switch (action.type) {
    case 'SELECT_CARD': {
      if (state.phase !== 'main') return state;
      const { index } = action.payload;
      const player = state.players[state.activePlayer];
      if (index < 0 || index >= player.hand.length) return state;
      // Toggle selection
      if (state.selectedCardIndex === index) return { ...state, selectedCardIndex: null };
      return { ...state, selectedCardIndex: index, selectedAttackerLane: null };
    }

    case 'DESELECT_CARD':
      return { ...state, selectedCardIndex: null };

    case 'PLAY_CARD': {
      const { laneIndex } = action.payload;
      const cardIndex = state.selectedCardIndex;
      if (cardIndex === null) {
        console.error('No card selected');
        return state;
      }
      const check = canPlayCard(state, cardIndex, laneIndex);
      if (!check.ok) {
        console.error('Cannot play card:', check.reason);
        return addLog(state, `Illegal: ${check.reason}`);
      }

      const ap = state.activePlayer;
      const player = state.players[ap];
      const card = player.hand[cardIndex];

      const unit: UnitInstance = {
        instanceId: card.instanceId,
        templateId: card.templateId,
        name: card.name,
        cost: card.cost,
        atk: card.atk,
        maxHp: card.hp,
        currentHp: card.hp,
        hasAttacked: false,
      };

      const newLanes = [...player.lanes];
      newLanes[laneIndex] = unit;

      const newPlayer = {
        ...player,
        hand: player.hand.filter((_, i) => i !== cardIndex),
        energy: player.energy - card.cost,
        lanes: newLanes,
      };

      return addLog(
        { ...state, players: { ...state.players, [ap]: newPlayer }, selectedCardIndex: null },
        `Player ${ap} played ${card.name} (ATK ${card.atk}/HP ${card.hp}) in lane ${laneIndex + 1}.`
      );
    }

    case 'ENTER_COMBAT': {
      if (state.phase !== 'main') return state;
      return addLog(
        { ...state, phase: 'combat', selectedCardIndex: null, selectedAttackerLane: null },
        `Player ${state.activePlayer} entered Combat Phase.`
      );
    }

    case 'SKIP_COMBAT': {
      if (state.phase !== 'main') return state;
      return endTurn(addLog(state, `Player ${state.activePlayer} skipped combat.`));
    }

    case 'SELECT_ATTACKER': {
      if (state.phase !== 'combat') return state;
      const { laneIndex } = action.payload;
      const unit = state.players[state.activePlayer].lanes[laneIndex];
      if (!unit) return state;
      if (unit.hasAttacked)
        return addLog(state, `${unit.name} has already attacked this turn.`);
      // Toggle selection
      if (state.selectedAttackerLane === laneIndex) return { ...state, selectedAttackerLane: null };
      return { ...state, selectedAttackerLane: laneIndex };
    }

    case 'ATTACK': {
      const { targetLaneIndex } = action.payload;
      const attackerLane = state.selectedAttackerLane;
      if (attackerLane === null) {
        console.error('No attacker selected');
        return state;
      }
      const check = canAttack(state, attackerLane, targetLaneIndex);
      if (!check.ok) {
        console.error('Cannot attack:', check.reason);
        return addLog(state, `Illegal attack: ${check.reason}`);
      }

      const ap = state.activePlayer;
      const opp = getOpponent(ap);
      const attackerPlayer = state.players[ap];
      const defenderPlayer = state.players[opp];
      const attacker = attackerPlayer.lanes[attackerLane]!;
      const defender = defenderPlayer.lanes[targetLaneIndex];

      const newAttackerLanes = [...attackerPlayer.lanes];
      newAttackerLanes[attackerLane] = { ...attacker, hasAttacked: true };

      const newDefenderLanes = [...defenderPlayer.lanes];
      let newCoreHp = defenderPlayer.coreHp;
      let newDiscard = [...defenderPlayer.discard];
      let logMsg: string;

      if (defender) {
        const damaged = applyDamageToUnit(defender, attacker.atk);
        if (isUnitDead(damaged)) {
          newDefenderLanes[targetLaneIndex] = null;
          const card: Card = {
            instanceId: defender.instanceId,
            templateId: defender.templateId,
            name: defender.name,
            cost: defender.cost,
            atk: defender.atk,
            hp: defender.maxHp,
          };
          newDiscard = [...newDiscard, card];
          logMsg = `${attacker.name} destroyed ${defender.name} in lane ${targetLaneIndex + 1}!`;
        } else {
          newDefenderLanes[targetLaneIndex] = damaged;
          logMsg = `${attacker.name} hit ${defender.name} for ${attacker.atk} dmg (${damaged.currentHp}/${damaged.maxHp} HP left).`;
        }
      } else {
        newCoreHp = defenderPlayer.coreHp - attacker.atk;
        logMsg = `${attacker.name} hit Player ${opp}'s Core for ${attacker.atk}! Core HP: ${newCoreHp}.`;
      }

      let newState: GameState = {
        ...state,
        players: {
          ...state.players,
          [ap]: { ...attackerPlayer, lanes: newAttackerLanes },
          [opp]: { ...defenderPlayer, lanes: newDefenderLanes, coreHp: newCoreHp, discard: newDiscard },
        },
        selectedAttackerLane: null,
      };
      newState = addLog(newState, logMsg);

      const winner = checkWinner(newState);
      if (winner) {
        newState = addLog({ ...newState, winner }, `Player ${winner} wins!`);
      }
      return newState;
    }

    case 'END_TURN': {
      if (state.phase !== 'combat') return state;
      return endTurn(state);
    }

    default:
      return state;
  }
}

function endTurn(state: GameState): GameState {
  const next = getOpponent(state.activePlayer);
  const nextPlayerState = state.players[next];

  const { player: afterDraw, drew } = drawCard(nextPlayerState);
  const afterEnergy = gainEnergy(afterDraw, 2, 6);
  // Reset hasAttacked for next player's units
  const readyPlayer = {
    ...afterEnergy,
    lanes: afterEnergy.lanes.map(u => (u ? { ...u, hasAttacked: false } : null)),
  };

  const newTurn = next === 'A' ? state.turnNumber + 1 : state.turnNumber;

  return addLog(
    {
      ...state,
      players: { ...state.players, [next]: readyPlayer },
      activePlayer: next,
      phase: 'main',
      selectedCardIndex: null,
      selectedAttackerLane: null,
      turnNumber: newTurn,
    },
    `Player ${next}'s turn. ${drew ? 'Drew a card.' : 'Deck empty — no draw.'} Energy: ${readyPlayer.energy}.`
  );
}
