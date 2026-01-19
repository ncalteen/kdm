import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * Lonely Tree Monster Data
 */
export const LONELY_TREE: NemesisMonsterData = {
  multiMonster: false,
  name: 'Lonely Tree',
  // Currently the node level is not known for this monster.
  // See: https://shop.kingdomdeath.com/pages/nodes-in-monster-campaigns
  node: MonsterNode.NN1,
  type: MonsterType.NEMESIS,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 6,
        advanced: 3,
        legendary: 1
      },
      aiDeckRemaining: 10,
      damage: -1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 0,
      movementTokens: 0,
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 10,
      toughnessTokens: 0,
      traits: ['Bear Fruit', 'Impenetrable Trunk', 'Nightmare Fruit']
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 5,
        legendary: 1
      },
      aiDeckRemaining: 14,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 0,
      movementTokens: 0,
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 13,
      toughnessTokens: 0,
      traits: [
        'Bear Fruit',
        'Impenetrable Trunk',
        'Moving Ground',
        'Nightmare Fruit'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 5,
        legendary: 2
      },
      aiDeckRemaining: 15,
      damage: 1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 20,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 0,
      movementTokens: 0,
      speed: 1,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 17,
      toughnessTokens: 0,
      traits: [
        'Bear Fruit',
        'Impenetrable Trunk',
        'Moving Ground',
        'Nightmare Fruit'
      ]
    }
  ],
  timeline: {}
}
