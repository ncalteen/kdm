import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Screaming Antelope Monster Data
 */
export const SCREAMING_ANTELOPE: QuarryMonsterData = {
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
  name: 'Screaming Antelope',
  node: MonsterNode.NQ2,
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
    toughness: 8,
    toughnessTokens: 0,
    traits: ['Trample']
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
    movement: 8,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Trample', 'Diabolical']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 22,
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
    survivorStatuses: [],
    toughness: 12,
    toughnessTokens: 0,
    traits: [
      'Trample',
      'Diabolical',
      'Hypermetabolism',
      'Indomitable',
      'Legendary Horns'
    ]
  },
  timeline: {
    2: 'Endless Screams'
  }
}
