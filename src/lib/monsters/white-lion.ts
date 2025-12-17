import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * White Lion Monster Data
 */
export const WHITE_LION: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'White Lion Cuisine',
      cc: 6,
      unlocked: false
    }
  ],
  huntBoard: {
    0: undefined,
    1: HuntEventType.MONSTER,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.BASIC,
    8: HuntEventType.MONSTER,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'White Lion',
  node: MonsterNode.NQ1,
  prologue: true,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 7,
      advanced: 3,
      legendary: 0
    },
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
    toughness: 8,
    toughnessTokens: 0,
    traits: []
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 5,
      legendary: 0
    },
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
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Cunning']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeck: {
      basic: 10,
      advanced: 9,
      legendary: 2
    },
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 10,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 14,
    toughnessTokens: 0,
    traits: ['Cunning', 'Merciless', 'Indomitable']
  },
  locations: [{ name: 'Catarium', unlocked: false }],
  timeline: {
    0: ['White Lion']
  }
}

/**
 * White Gigalion Monster Data
 */
export const WHITE_GIGALION: QuarryMonsterData = {
  ccRewards: [],
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
  node: MonsterNode.NQ1,
  prologue: false,
  type: MonsterType.QUARRY,
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 5,
      legendary: 0
    },
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
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Giga Claws', 'Smart Cat', 'Vicious']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 11,
      advanced: 8,
      legendary: 1
    },
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
  },
  locations: [{ name: 'Giga Catarium', unlocked: false }],
  timeline: {}
}
