import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'

/**
 * Dung Beetle Knight Monster Data
 */
export const DUNG_BEETLE_KNIGHT: QuarryMonsterData = {
  ccRewards: [],
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.MONSTER,
    4: HuntEventType.BASIC,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Dung Beetle Knight',
  node: MonsterNode.NQ4,
  prologue: false,
  type: MonsterType.QUARRY,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 3,
        legendary: 0
      },
      aiDeckRemaining: 10,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 12,
      toughnessTokens: 0,
      traits: [
        'Baller',
        'Power Forward',
        'Prepared Tunnels',
        'Separation Anxiety'
      ]
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 6,
        legendary: 1
      },
      aiDeckRemaining: 14,
      damage: 1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      speed: 1,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 14,
      toughnessTokens: 0,
      traits: [
        'Baller',
        'Heavy Load',
        'Power Forward',
        'Prepared Tunnels',
        'Separation Anxiety'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 1,
      aiDeck: {
        basic: 8,
        advanced: 9,
        legendary: 2
      },
      aiDeckRemaining: 19,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 1,
      huntPos: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 8,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 18,
      toughnessTokens: 0,
      traits: [
        'Burrow',
        'Baller',
        'Heavy Load',
        'Power Forward',
        'Prepared Tunnels',
        'Separation Anxiety',

        'Indomitable'
      ]
    }
  ],
  locations: [],
  timeline: {
    8: ['Rumbling in the Dark']
  }
}
