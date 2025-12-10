import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Flower Knight Monster Data
 */
export const FLOWER_KNIGHT: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.BASIC,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.MONSTER,
    9: HuntEventType.MONSTER,
    10: HuntEventType.MONSTER,
    11: HuntEventType.MONSTER,
    12: undefined
  },
  name: 'Flower Knight',
  node: MonsterNode.NQ2,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 11,
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
    survivorHuntPos: 2,
    survivorStatuses: [],
    toughness: 6,
    toughnessTokens: 0,
    traits: ['Bloom', 'Set Roots']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 13,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorHuntPos: 1,
    survivorStatuses: [],
    toughness: 8,
    toughnessTokens: 0,
    traits: ['Bloom', 'Set Roots', 'Razor Bulbs']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 16,
    damage: 2,
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
      'Bloom',
      'Set Roots',
      'Razor Bulbs',
      'Perfect Aim',
      'Heart of the Woods',
      'Indomitable'
    ]
  },
  timeline: {
    5: ["A Crone's Tale"]
  }
}
