import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Butcher Monster Data
 */
export const BUTCHER: NemesisMonsterData = {
  name: 'Butcher',
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
    aiDeckRemaining: 12,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 9,
    toughnessTokens: 0,
    traits: ['Berserker', 'Dreaded Trophies', 'Fast Target']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 5,
      legendary: 0
    },
    aiDeckRemaining: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 12,
    toughnessTokens: 0,
    traits: ['Dreaded Trophies', 'Fast Target', 'Frenzied Berserker']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeck: {
      basic: 11,
      advanced: 10,
      legendary: 0
    },
    aiDeckRemaining: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 15,
    toughnessTokens: 0,
    traits: [
      'Dreaded Trophies',
      'Fast Target',
      'Frenzied Berserker',
      'Invincible',

      'Indomitable'
    ]
  },
  timeline: {
    4: [
      {
        title: 'Nemesis Encounter - Butcher Lvl 1',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN
        ]
      }
    ],
    13: [
      {
        title: 'Nemesis Encounter - Butcher Lvl 2',
        campaigns: [CampaignType.PEOPLE_OF_THE_STARS]
      }
    ],
    16: [
      {
        title: 'Nemesis Encounter - Butcher Lvl 2',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN
        ]
      }
    ],
    22: [
      {
        title: 'Nemesis Encounter - Butcher Lvl 3',
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ],
    23: [
      {
        title: 'Nemesis Encounter - Butcher Lvl 3',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN
        ]
      }
    ]
  }
}

/**
 * Killenium Butcher Monster Data
 */
export const KILLENIUM_BUTCHER: NemesisMonsterData = {
  name: 'Killenium Butcher',
  node: MonsterNode.NN2, // TODO: Confirm Node
  type: MonsterType.NEMESIS,
  level2: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeck: {
      basic: 9,
      advanced: 6,
      legendary: 0
    },
    aiDeckRemaining: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Scorn', 'Self-Aware']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeck: {
      basic: 11,
      advanced: 10,
      legendary: 0
    },
    aiDeckRemaining: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 1,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 16,
    toughnessTokens: 0,
    traits: ['Berzerker', 'Invincible', 'Scorn', 'Self-Aware', 'Indomitable']
  },
  timeline: {}
}
