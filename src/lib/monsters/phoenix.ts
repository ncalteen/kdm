import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Phoenix Monster Data
 */
export const PHOENIX: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'Phoenix Cuisine',
      cc: 26,
      unlocked: false
    }
  ],
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.MONSTER,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Phoenix',
  node: MonsterNode.NQ3,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 12,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 5,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Dreaded Decade'],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Materialize', 'Spiral Age', 'Zeal']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 17,
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
    survivorStatuses: ['Dreaded Decade'],
    toughness: 12,
    toughnessTokens: 0,
    traits: ['Materialize', 'Spiral Age', 'Top of the Food Chain', 'Zeal']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 22,
    damage: 3,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 11,
    luck: 0,
    luckTokens: 2,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Dreaded Decade'],
    toughness: 17,
    toughnessTokens: 0,
    traits: [
      'Materialize',
      'Spiral Age',
      'Top of the Food Chain',
      'Zeal',

      'Indomitable'
    ]
  },
  locations: [{ name: 'Plumery', unlocked: false }],
  timeline: {
    7: ['Phoenix Feather']
  }
}
