import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/schemas/monster'

/**
 * Smog Singers Monster Data
 */
export const SMOG_SINGERS: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'Smog Singer Cuisine',
      cc: 16,
      unlocked: false
    }
  ],
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.MONSTER,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.BASIC,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Smog Singers',
  node: MonsterNode.NQ2,
  prologue: false,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 4,
      legendary: 0
    },
    aiDeckRemaining: 12,
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
    survivorStatuses: ['Bloody Hands'],
    toughness: 7,
    toughnessTokens: 0,
    traits: ['Performing Artists', 'Song Cards', 'Vibration Damage']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 4,
      legendary: 1,
      overtone: 4
    },
    aiDeckRemaining: 17,
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
    survivorHuntPos: 0,
    survivorStatuses: ['Bloody Hands'],
    toughness: 9,
    toughnessTokens: 0,
    traits: [
      'Overtone Singing',
      'Performing Artists',
      'Song Cards',
      'Vibration Damage'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 9,
      advanced: 6,
      legendary: 2,
      overtone: 8
    },
    aiDeckRemaining: 25,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
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
    survivorStatuses: ['Bloody Hands'],
    toughness: 12,
    toughnessTokens: 0,
    traits: [
      'Overtone Singing',
      'Performing Artists',
      'Singing Whale',
      'Song Cards',
      'Vibration Damage',

      'Indomitable'
    ]
  },
  locations: [{ name: 'Chorusseum', unlocked: false }],
  timeline: {
    2: ['Death of Song']
  }
}
