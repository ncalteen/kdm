import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/schemas/monster'

/**
 * Gorm Monster Data
 */
export const GORM: QuarryMonsterData = {
  ccRewards: [],
  huntBoard: {
    0: undefined,
    1: HuntEventType.MONSTER,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.BASIC,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Gorm',
  node: MonsterNode.NQ1,
  prologue: false,
  type: MonsterType.QUARRY,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 2,
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
      movement: 6,
      movementTokens: 0,
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 8,
      toughnessTokens: 0,
      traits: []
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 9,
        advanced: 5,
        legendary: 0
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
      movement: 9,
      movementTokens: 0,
      speed: 1,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 11,
      toughnessTokens: 0,
      traits: [
        // TODO: On Arrival - Fetid Grotto story event?
        "Gorm's Den",
        'Musth'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 10,
        advanced: 8,
        legendary: 2
      },
      aiDeckRemaining: 20,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 0,
      luck: 0,
      luckTokens: 1,
      moods: [],
      movement: 8,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 15,
      toughnessTokens: 0,
      traits: [
        // TODO: Depart - Final March story event
        'Ancient Tusks',
        'Gormyard',
        'Indomitable'
      ]
    }
  ],
  locations: [
    { name: 'Gormchymist', unlocked: false },
    { name: 'Gormery', unlocked: false }
  ],
  timeline: {
    1: ['The Approaching Storm']
  }
}
