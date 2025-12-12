import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Spidicules Monster Data
 */
export const SPIDICULES: QuarryMonsterData = {
  ccRewards: [],
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
  name: 'Spidicules',
  node: MonsterNode.NQ2,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 9,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: ['Frantic Spinning'],
    movement: 11,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 8,
    toughnessTokens: 0,
    traits: ['Spawn', 'Spiderling Action', 'Twitching Leg Pile']
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
    moods: ['Feeding Time'],
    movement: 14,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Hivemind', 'Spiderling Action', 'Spawn', 'Twitching Leg Pile']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: ['Necrotoxins'],
    movement: 16,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 12,
    toughnessTokens: 0,
    traits: [
      '10,000 Teeth',
      'Hivemind',
      'Spawn',
      'Spiderling Action',
      'Twitching Leg Pile'
    ]
  },
  locations: [],
  timeline: {
    2: ['Young Rivals']
  }
}
