import { HuntEventType, MonsterType } from '@/lib/enums'
import { AlternateMonsterData } from '@/schemas/monster'

/**
 * Bullfrogdog Monster Data
 */
export const BULLFROGDOG: AlternateMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Bullfrogdog',
  type: MonsterType.QUARRY,
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 2,
      aiDeck: {
        basic: 9,
        advanced: 7,
        legendary: 2,
        overtone: 5
      },
      aiDeckRemaining: 23,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      huntPos: 0,
      luck: 0,
      luckTokens: 1,
      moods: ['Indigestion'],
      movement: 10,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 17,
      toughnessTokens: 0,
      traits: [
        'Bullish Charge',
        'Double Sphincter',
        'Foul Stench',
        'Gaseous Bloat',
        'Mature',

        'Indomitable'
      ]
    }
  ],
  locations: [{ name: 'Tuskworks', unlocked: false }]
}
