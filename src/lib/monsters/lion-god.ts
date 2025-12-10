import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Lion God Monster Data
 */
export const LION_GOD: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.MONSTER,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.BASIC,
    8: HuntEventType.MONSTER,
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Lion God',
  node: MonsterNode.NQ4,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 15,
    damage: 0,
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
    survivorStatuses: [],
    toughness: 14,
    toughnessTokens: 0,
    traits: ['Whiplash', 'Hollow Earth', 'Heft']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 20,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 9,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 16,
    toughnessTokens: 0,
    traits: ['Whiplash', 'Hollow Earth', 'Heft', 'Divine Prowess']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 25,
    damage: 3,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 1,
    huntPos: 0,
    luck: 0,
    luckTokens: 2,
    moods: [],
    movement: 10,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 21,
    toughnessTokens: 0,
    traits: [
      'Whiplash',
      'Hollow Earth',
      'Heft',
      'Divine Prowess',
      'Immaculate Intuition',
      'Indomitable'
    ]
  },
  timeline: {
    13: ['The Silver City']
  }
}
