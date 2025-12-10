import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Sunstalker Monster Data
 */
export const SUNSTALKER: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.MONSTER,
    4: HuntEventType.BASIC,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Sunstalker',
  node: MonsterNode.NQ3,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 10,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 16,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 0,
    traits: [
      'Solar Energy',
      'Sun Dial',
      'Light & Shadow',
      'Shade',
      'Shadows of Darkness'
    ]
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 16,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 12,
    toughnessTokens: 0,
    traits: [
      'Solar Energy',
      'Sun Dial',
      'Light & Shadow',
      'Shade',
      'Shadows of Darkness',
      'Living Shadows'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 20,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 16,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 16,
    toughnessTokens: 0,
    traits: [
      'Solar Energy',
      'Sun Dial',
      'Light & Shadow',
      'Shade',
      'Shadows of Darkness',
      'Living Shadows',
      'Monochrome',
      'Indomitable'
    ]
  },
  timeline: {
    9: 'Promise Under the Sun'
  }
}
