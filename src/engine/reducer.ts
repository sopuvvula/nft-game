import { GameState, Action, UnitInstance, Card } from './types';
import {
  canPlayCard,
  canAttack,
  isExposed,
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

function unitToCard(unit: UnitInstance): Card {
  return {
    instanceId: unit.instanceId,
    templateId: unit.templateId,
    name: unit.name,
    cost: unit.cost,
    atk: unit.atk,
    hp: unit.maxHp,
  };
}

function resetRow(
  lanes: (UnitInstance | null)[]
): (UnitInstance | null)[] {
  return lanes.map(u => (u ? { ...u, hasAttacked: false } : null));
}

export function reducer(state: GameState, action: Action): GameState {
  if (state.winner) return state;

  switch (action.type) {
    case 'SELECT_CARD': {
      if (state.phase !== 'main') return state;
      const { index } = action.payload;
      const player = state.players[state.activePlayer];
      if (index < 0 || index >= player.hand.length) return state;
      if (state.selectedCardIndex === index) return { ...state, selectedCardIndex: null };
      return { ...state, selectedCardIndex: index, selectedAttackerLane: null, selectedAttackerRow: null };
    }

    case 'DESELECT_CARD':
      return { ...state, selectedCardIndex: null };

    case 'PLAY_CARD': {
      const { laneIndex, row } = action.payload;
      const cardIndex = state.selectedCardIndex;
      if (cardIndex === null) { console.error('No card selected'); return state; }

      const check = canPlayCard(state, cardIndex, laneIndex, row);
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

      const newRow = [...player[row]];
      newRow[laneIndex] = unit;

      const newPlayer = {
        ...player,
        hand: player.hand.filter((_, i) => i !== cardIndex),
        energy: player.energy - card.cost,
        [row]: newRow,
      };

      return addLog(
        { ...state, players: { ...state.players, [ap]: newPlayer }, selectedCardIndex: null },
        `Player ${ap} played ${card.name} (ATK ${card.atk}/HP ${card.hp}) in ${row} lane ${laneIndex + 1}.`
      );
    }

    case 'ENTER_COMBAT': {
      if (state.phase !== 'main') return state;
      return addLog(
        { ...state, phase: 'combat', selectedCardIndex: null, selectedAttackerLane: null, selectedAttackerRow: null },
        `Player ${state.activePlayer} entered Combat Phase.`
      );
    }

    case 'SKIP_COMBAT': {
      if (state.phase !== 'main') return state;
      return endTurn(addLog(state, `Player ${state.activePlayer} skipped combat.`));
    }

    case 'SELECT_ATTACKER': {
      if (state.phase !== 'combat') return state;
      const { laneIndex, row } = action.payload;
      const unit = state.players[state.activePlayer][row][laneIndex];
      if (!unit) return state;
      if (unit.hasAttacked)
        return addLog(state, `${unit.name} has already attacked this turn.`);
      if (row === 'backline' && !isExposed(laneIndex, state.players[state.activePlayer]))
        return addLog(state, `${unit.name} is protected by a frontline unit.`);
      // Toggle
      if (state.selectedAttackerLane === laneIndex && state.selectedAttackerRow === row)
        return { ...state, selectedAttackerLane: null, selectedAttackerRow: null };
      return { ...state, selectedAttackerLane: laneIndex, selectedAttackerRow: row };
    }

    case 'ATTACK': {
      const { targetLaneIndex } = action.payload;
      const attackerLane = state.selectedAttackerLane;
      const attackerRow = state.selectedAttackerRow;
      if (attackerLane === null || attackerRow === null) {
        console.error('No attacker selected');
        return state;
      }

      const check = canAttack(state, attackerLane, attackerRow, targetLaneIndex);
      if (!check.ok) {
        console.error('Cannot attack:', check.reason);
        return addLog(state, `Illegal attack: ${check.reason}`);
      }

      const ap = state.activePlayer;
      const opp = getOpponent(ap);
      const attackerPlayer = state.players[ap];
      const defenderPlayer = state.players[opp];
      const attacker = attackerPlayer[attackerRow][attackerLane]!;

      // Mark attacker as spent
      const newAttackerRow = [...attackerPlayer[attackerRow]];
      newAttackerRow[attackerLane] = { ...attacker, hasAttacked: true };
      const newAttackerPlayer = { ...attackerPlayer, [attackerRow]: newAttackerRow };

      // Resolve target: frontline → backline → Core
      let newDefenderPlayer = { ...defenderPlayer };
      let logMsg: string;

      const flTarget = defenderPlayer.frontline[targetLaneIndex];
      const blTarget = defenderPlayer.backline[targetLaneIndex];

      if (flTarget) {
        const damaged = applyDamageToUnit(flTarget, attacker.atk);
        if (isUnitDead(damaged)) {
          const newFL = [...defenderPlayer.frontline];
          newFL[targetLaneIndex] = null;
          newDefenderPlayer = { ...defenderPlayer, frontline: newFL, discard: [...defenderPlayer.discard, unitToCard(flTarget)] };
          logMsg = `${attacker.name} destroyed ${flTarget.name} (frontline lane ${targetLaneIndex + 1})!`;
        } else {
          const newFL = [...defenderPlayer.frontline];
          newFL[targetLaneIndex] = damaged;
          newDefenderPlayer = { ...defenderPlayer, frontline: newFL };
          logMsg = `${attacker.name} hit ${flTarget.name} for ${attacker.atk} dmg (${damaged.currentHp}/${damaged.maxHp} HP left).`;
        }
      } else if (blTarget) {
        // Frontline empty → backline exposed
        const damaged = applyDamageToUnit(blTarget, attacker.atk);
        if (isUnitDead(damaged)) {
          const newBL = [...defenderPlayer.backline];
          newBL[targetLaneIndex] = null;
          newDefenderPlayer = { ...defenderPlayer, backline: newBL, discard: [...defenderPlayer.discard, unitToCard(blTarget)] };
          logMsg = `${attacker.name} destroyed exposed ${blTarget.name} (backline lane ${targetLaneIndex + 1})!`;
        } else {
          const newBL = [...defenderPlayer.backline];
          newBL[targetLaneIndex] = damaged;
          newDefenderPlayer = { ...defenderPlayer, backline: newBL };
          logMsg = `${attacker.name} hit exposed ${blTarget.name} for ${attacker.atk} dmg (${damaged.currentHp}/${damaged.maxHp} HP left).`;
        }
      } else {
        newDefenderPlayer = { ...defenderPlayer, coreHp: defenderPlayer.coreHp - attacker.atk };
        logMsg = `${attacker.name} hit Player ${opp}'s Core for ${attacker.atk}! Core HP: ${newDefenderPlayer.coreHp}.`;
      }

      let newState: GameState = {
        ...state,
        players: { ...state.players, [ap]: newAttackerPlayer, [opp]: newDefenderPlayer },
        selectedAttackerLane: null,
        selectedAttackerRow: null,
      };
      newState = addLog(newState, logMsg);

      const winner = checkWinner(newState);
      if (winner) newState = addLog({ ...newState, winner }, `Player ${winner} wins!`);
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
  const { player: afterDraw, drew } = drawCard(state.players[next]);
  const afterEnergy = gainEnergy(afterDraw, 2, 6);
  const readyPlayer = {
    ...afterEnergy,
    frontline: resetRow(afterEnergy.frontline),
    backline: resetRow(afterEnergy.backline),
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
      selectedAttackerRow: null,
      turnNumber: newTurn,
    },
    `Player ${next}'s turn. ${drew ? 'Drew a card.' : 'Deck empty — no draw.'} Energy: ${readyPlayer.energy}.`
  );
}
