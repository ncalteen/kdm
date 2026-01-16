import { HuntEventType, MonsterType } from '@/lib/enums'
import { VignetteMonsterData } from '@/schemas/vignette-monster-data'

/**
 * White Gigalion Monster Data
 */
export const WHITE_GIGALION: VignetteMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.BASIC,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'White Gigalion',
  type: MonsterType.QUARRY,
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 10,
        advanced: 5,
        legendary: 0
      },
      aiDeckRemaining: 15,
      damage: 1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 8,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 8,
      movementTokens: 0,
      speed: 1,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 10,
      toughnessTokens: 0,
      traits: ['Giga Claws', 'Smart Cat', 'Vicious']
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 11,
        advanced: 8,
        legendary: 1
      },
      aiDeckRemaining: 20,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 8,
      luck: 0,
      luckTokens: 1,
      moods: [],
      movement: 10,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 16,
      toughnessTokens: 0,
      traits: [
        'Giga Claws',
        'Golden Eyes',
        'Merciless',
        'Smart Cat',
        'Vicious',

        'Indomitable'
      ]
    }
  ],
  locations: [{ name: 'Giga Catarium', unlocked: false }],
  timeline: {}
}
