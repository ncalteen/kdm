import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Smog Singers Monster Data
 */
export const SMOG_SINGERS: QuarryMonsterData = {
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
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 12,
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
    survivorStatuses: ['Bloody Hands'],
    toughness: 7,
    toughnessTokens: 0,
    traits: ['Performing Artists', 'Vibration Damage', 'Song Cards']
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
    movement: 7,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Bloody Hands'],
    toughness: 9,
    toughnessTokens: 0,
    traits: [
      'Performing Artists',
      'Vibration Damage',
      'Song Cards',
      'Overtone Singing'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 25,
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
    survivorStatuses: ['Bloody Hands'],
    toughness: 12,
    toughnessTokens: 0,
    traits: [
      'Performing Artists',
      'Vibration Damage',
      'Song Cards',
      'Overtone Singing',
      'Singing Whale',
      'Indomitable'
    ]
  },
  timeline: {
    2: ['Death of Song']
  }
}
