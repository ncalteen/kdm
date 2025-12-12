import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Crimson Crocodile Monster Data
 */
export const CRIMSON_CROCODILE: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'Crimson Crocodile Cuisine',
      cc: 6,
      unlocked: false
    }
  ],
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
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Crimson Crocodile',
  node: MonsterNode.NQ1,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 10,
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
    survivorStatuses: [],
    toughness: 7,
    toughnessTokens: 0,
    traits: ['Adrenal Adept', 'Enchanted Flesh', 'Immortal Presence']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 8,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 9,
    toughnessTokens: 0,
    traits: [
      'Adrenal Adept',
      'Blood Soaked',
      'Enchanted Flesh',
      'Immortal Presence'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 20,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 11,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 15,
    toughnessTokens: 0,
    traits: [
      'Adrenal Adept',
      'Blood Secret',
      'Blood Soaked',
      'Enchanted Flesh',
      'Immortal Presence',

      'Indomitable'
    ]
  },
  locations: [{ name: 'Crimson Crockery', unlocked: false }],
  timeline: {
    0: ['Crimson Crocodile']
  }
}
