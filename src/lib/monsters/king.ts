import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * King Monster Data
 */
export const KING: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.MONSTER,
    2: HuntEventType.BASIC,
    3: HuntEventType.MONSTER,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.BASIC,
    8: HuntEventType.MONSTER,
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'King',
  node: MonsterNode.NQ4,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 19,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 7,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 19,
    toughnessTokens: 0,
    traits: [
      'Audio Synthesis',
      "King's New Clothes",
      'Ghost Geometry',
      'Current'
    ]
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 22,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 9,
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
    toughness: 22,
    toughnessTokens: 0,
    traits: [
      'Audio Synthesis',
      "King's New Clothes",
      'Ghost Geometry',
      'Current',
      'Half Power'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 27,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 11,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 9,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 25,
    toughnessTokens: 0,
    traits: [
      'Audio Synthesis',
      "King's New Clothes",
      'Ghost Geometry',
      'Current',
      'Full Power',
      "King's Presence",
      'Indomitable'
    ]
  },
  timeline: {}
}
