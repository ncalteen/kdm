import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Pariah Monster Data
 */
export const PARIAH: NemesisMonsterData = {
  name: 'Pariah',
  node: MonsterNode.NN1,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 7,
      advanced: 5,
      legendary: 0
    },
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Somatic Static'],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Somatic Empathy']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 7,
      legendary: 1
    },
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Somatic Static'],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Cyclopean Cruelty', 'Somatic Empathy']
  },
  // Showdown: Pariah - Inverted
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 6,
      advanced: 10,
      legendary: 2
    },
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 1,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Somatic Static'],
    toughness: 17,
    toughnessTokens: 0,
    traits: [
      'Cyclopean Cruelty',
      'Inverted',
      'Jagged Grotto',
      'Somatic Empathy',

      'Indomitable'
    ]
  },
  timeline: {
    3: [
      {
        title: 'The Fiend',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
        ]
      }
    ],
    22: [
      {
        title: 'Nemesis Encounter - Pariah Lvl 22',
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ]
  }
}
