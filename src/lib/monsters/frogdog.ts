import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/schemas/monster'

/**
 * Frogdog Monster Data
 */
export const FROGDOG: QuarryMonsterData = {
  ccRewards: [],
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
  name: 'Frogdog',
  node: MonsterNode.NQ1,
  prologue: true,
  type: MonsterType.QUARRY,
  level1: {
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
    movement: 7,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorHuntPos: 0,
    survivorStatuses: [],
    toughness: 8,
    toughnessTokens: 0,
    traits: ['Double Sphincter', 'Foul Stench', 'Gaseous Bloat', 'Leap']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 6,
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
      'Double Sphincter',
      'Foul Stench',
      'Gaseous Bloat',
      'Leap',
      'Mature'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeck: {
      basic: 9,
      advanced: 8,
      legendary: 2
    },
    aiDeckRemaining: 19,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
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
      'Double Sphincter',
      'Foul Stench',
      'Gaseous Bloat',
      'Leap',
      'Mature',

      'Indomitable'
    ]
  },
  locations: [{ name: 'Froskrafter', unlocked: false }],
  timeline: {
    0: ['Devour the White Lion']
  }
}

/**
 * Bullfrogdog Monster Data
 */
export const BULLFROGDOG: QuarryMonsterData = {
  ccRewards: [],
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
  node: MonsterNode.NQ1,
  prologue: false,
  type: MonsterType.QUARRY,
  level3: {
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
  },
  locations: [{ name: 'Tuskworks', unlocked: false }],
  timeline: {}
}
