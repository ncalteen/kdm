import { HuntEventType, MonsterType } from '@/lib/enums'
import { VignetteMonsterData } from '@/schemas/vignette-monster-data'

/**
 * Screaming Nukalope Monster Data
 */
export const SCREAMING_NUKALOPE: VignetteMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.BASIC,
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
  name: 'Screaming Nukalope',
  type: MonsterType.QUARRY,
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 1,
      aiDeck: {
        basic: 9,
        advanced: 7,
        legendary: 0
      },
      aiDeckRemaining: 16,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 9,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 9,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 11,
      toughnessTokens: 0,
      traits: [
        'Atomic Vigor - Inert',
        'Critical Mass - Inert',
        'Prehensile Tail - Inert'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 1,
      aiDeck: {
        basic: 12,
        advanced: 8,
        legendary: 2
      },
      aiDeckRemaining: 22,
      damage: 1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 2,
      huntPos: 11,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 9,
      movementTokens: 0,
      speed: 3,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 12,
      toughnessTokens: 0,
      traits: [
        'Atomic Vigor - Inert',
        'Critical Mass - Inert',
        'Exponential Yield',
        'Legendary Horns',
        'Prehensile Tail - Inert',

        'Indomitable'
      ]
    }
  ],
  locations: [{ name: 'Stone Circle Hot Zone', unlocked: false }],
  timeline: {}
}
