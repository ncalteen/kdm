import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'

/**
 * King Monster Data
 */
export const KING: QuarryMonsterData = {
  ccRewards: [
    {
      name: 'King Cuisine',
      cc: 36,
      unlocked: false
    }
  ],
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
  prologue: false,
  type: MonsterType.QUARRY,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 8,
        legendary: 3
      },
      aiDeckRemaining: 19,
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
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 19,
      toughnessTokens: 0,
      traits: [
        'Audio Synthesis',
        'Current',
        'Ghost Geometry',
        "King's New Clothes"
      ]
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 1,
      aiDeck: {
        basic: 8,
        advanced: 8,
        legendary: 6
      },
      aiDeckRemaining: 22,
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
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 22,
      toughnessTokens: 0,
      traits: [
        'Audio Synthesis',
        'Current',
        'Ghost Geometry',
        'Half Power',
        "King's New Clothes"
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 2,
      aiDeck: {
        basic: 8,
        advanced: 12,
        legendary: 7
      },
      aiDeckRemaining: 27,
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
      survivorHuntPos: 0,
      survivorStatuses: [],
      toughness: 25,
      toughnessTokens: 0,
      traits: [
        'Audio Synthesis',
        'Current',
        'Full Power',
        'Ghost Geometry',
        "King's New Clothes",
        "King's Presence",

        'Indomitable'
      ]
    }
  ],
  locations: [{ name: 'Kingsmith', unlocked: false }],
  timeline: { 22: ['The Awaited'] }
}
