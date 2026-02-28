# Game Vision — North Star

> This document defines the final intended state of the game.
> It is a living document — TBD sections will be filled in as decisions are made.

---

## Elevator Pitch
A tactical lane-based TCG where every card is an NFT you truly own.
The game is free and fair for everyone — you win with skill and strategy, not your wallet.
Monetization comes purely from cosmetics.

---

## Gameplay Pillars
- **Lane-based tactics** — positioning matters. Where you place a unit changes everything.
- **Team composition depth** — inspired by TFT. Frontline tanks protect backline carries. Synergies between units reward thoughtful deckbuilding.
- **Structural play** — inspired by Clash Royale. Towers occupy lanes and change the flow of combat (attack, defend, block).
- **Field control** — inspired by Yu-Gi-Oh Field Spells. One active field shapes the entire board for both players, rewarding decks built around it.
- **Skill over spending** — every card is accessible. Skins are the only thing money can buy.

---

## Board Layout (Final)
```
[ Player B Towers    — up to N tower slots         ]
[ Player B Backline  — 5 lanes                     ]
[ Player B Frontline — 5 lanes                     ]
═══════════════════════════════════════════════════
[ Player A Frontline — 5 lanes                     ]
[ Player A Backline  — 5 lanes                     ]
[ Player A Towers    — up to N tower slots         ]
```

### Frontline
- Standard combat row — units here attack and block first.

### Backline
- Protected while a friendly unit occupies the same frontline lane.
- Exposed (can attack and be attacked) when the frontline lane in front of it is empty.
- Designed for high-value, fragile units (carries, supports, etc.).

### Towers
- Structures placed in designated slots (exact count TBD).
- Persist across turns unless destroyed.
- Can have passive effects (e.g. block damage to Core, deal chip damage, buff adjacent units).
- Inspired by Clash Royale — add a strategic layer beyond unit placement.

### Field Zone
- One shared Field Zone for the entire board — only one field card is active at a time.
- Field effects apply to **both players**, rewarding decks built around the active field.
- Field cards buff unit types globally (e.g. "Ashlands — all fire units get +2 ATK") rather than targeting specific lanes or rows (those effects belong to spells).
- **Replacing a field:** playing a new field does not instantly destroy the old one. A threshold mechanic will govern replacement — exact design TBD, but the intent is that the active field has weight and can't be trivially overwritten.
- Inspired by Yu-Gi-Oh Field Spell Cards.

---

## Cards as NFTs
- Every card in the game is an NFT — players truly own what they earn or trade.
- **Blockchain: TBD** (Solana, Base, Polygon all under consideration).
- **Card acquisition model: TBD** (free mint, play-to-earn, open access, etc.).
- Owning the NFT does not grant a gameplay advantage — all cards are available to all players.
- NFT ownership enables: trading, verifiable scarcity on limited-edition card arts, and future ecosystem features.

---

## Monetization — Cosmetics Only
The game is **never pay-to-win**. Revenue comes entirely from cosmetics.

- **Card skins** — alternate art for existing cards, released in limited-edition seasonal drops.
- **Board skins** — custom lane/board themes.
- **Potential future cosmetics**: card back designs, Core animations, attack effects, emotes.
- Limited-edition drops create natural scarcity and collector value without affecting gameplay.
- League of Legends is the direct inspiration for this model.

---

## Progression & Ranked (TBD)
- Seasonal league system — players climb ranks, seasons reset.
- Progression rewards (card unlocks? cosmetic drops?) TBD.
- Tournament support TBD.

---

## Multiplayer
- End goal: real-time PvP.
- Requires a backend (game server or peer-to-peer with authoritative state).
- **Deferred** — local 1v1 blueprint first, multiplayer solved later.

---

## Platform Roadmap
| Phase | Platform | Goal |
|-------|----------|------|
| Now   | Web (React + Vite) | Validate rules engine and core loop |
| Next  | Web (polished) | Playable prototype with NFT integration |
| Later | Unity | Full game client, mobile support |

---

## Open Questions (TBD)
- Blockchain choice
- Card acquisition / onboarding model
- Tower mechanics (exact slot count, tower card types, destruction rules)
- Field card replacement threshold (durability counter? energy cost? challenge mechanic?)
- Unit type system (what types exist — fire, beast, etc. — and how they interact with fields)
- Progression system and season structure
- Deck size and hand size for final game
- Spell cards and keyword system (planned for v0.3+)
