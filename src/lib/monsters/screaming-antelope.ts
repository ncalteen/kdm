import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { SCREAMING_NUKALOPE } from '@/lib/monsters/screaming-nukalope'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'

/**
 * Screaming Antelope Monster Data
 */
export const SCREAMING_ANTELOPE: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'Screaming Antelope Cuisine',
      cc: 16,
      unlocked: false
    }
  ],
  huntBoard: {
    0: undefined,
    1: HuntEventType.MONSTER,
    2: HuntEventType.BASIC,
    3: HuntEventType.MONSTER,
    4: HuntEventType.BASIC,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  multiMonster: false,
  name: 'Screaming Antelope',
  node: MonsterNode.NQ2,
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
      huntPos: 4,
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
      traits: ['Trample']
    }
  ],
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
      traits: ['Diabolical', 'Trample']
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 12,
        advanced: 8,
        legendary: 2
      },
      aiDeckRemaining: 22,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 1,
      huntPos: 10,
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
      toughness: 12,
      toughnessTokens: 0,
      traits: [
        'Diabolical',
        'Hypermetabolism',
        'Legendary Horns',
        'Trample',

        'Indomitable'
      ]
    }
  ],
  locations: [{ name: 'Stone Circle', unlocked: false }],
  timeline: {
    2: ['Endless Screams']
  },
  vignette: SCREAMING_NUKALOPE
}
