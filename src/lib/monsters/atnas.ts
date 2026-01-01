import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Atnas the Child Eater Monster Data
 */
export const ATNAS: NemesisMonsterData = {
  name: 'Atnas the Child Eater',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 3,
      legendary: 1
    },
    aiDeckRemaining: 12,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
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
    toughness: 11,
    toughnessTokens: 0,
    traits: [
      'Old Battle Scars',
      "Master's Presence",
      'Mad Master',
      'Spark of Joy'
    ]
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 4,
      legendary: 2
    },
    aiDeckRemaining: 16,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 14,
    toughnessTokens: 0,
    traits: [
      'Curb Stomp',
      'Mad Master',
      "Master's Presence",
      'Old Battle Scars',
      'Spark of Joy'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 13,
      advanced: 5,
      legendary: 3
    },
    aiDeckRemaining: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 19,
    toughnessTokens: 0,
    traits: [
      'Curb Stomp',
      'Keen Eyes',
      'Mad Master',
      "Master's Presence",
      'Old Battle Scars',
      'Spark of Joy',

      'Indomitable'
    ]
  },
  timeline: {
    6: [
      {
        title: 'Unwanted Gifts',
        campaigns: [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]
      }
    ],
    9: ['Nemesis Encounter - Atnas the Child Eater Lvl 1'],
    18: ['Nemesis Encounter - Atnas the Child Eater Lvl 2'],
    28: ['Nemesis Encounter - Atnas the Child Eater Lvl 3']
  }
}
