import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * Test Nemesis Monster Data
 */
export const TEST_NEMESIS: NemesisMonsterData = {
  multiMonster: false,
  name: 'Test Nemesis',
  node: MonsterNode.NN1,
  type: MonsterType.NEMESIS,
  level1: [
    {
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
    }
  ],
  level2: [
    {
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
    }
  ],
  level3: [
    {
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
    }
  ],
  timeline: {
    4: ['Nemesis Encounter - Test Nemesis Lvl 1'],
    13: [
      {
        title: 'Nemesis Encounter - Test Nemesis Lvl 2',
        campaigns: [CampaignType.PEOPLE_OF_THE_STARS]
      }
    ],
    16: [
      {
        title: 'Nemesis Encounter - Test Nemesis Lvl 2',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN
        ]
      }
    ],
    22: [
      {
        title: 'Nemesis Encounter - Test Nemesis Lvl 3',
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ],
    23: [
      {
        title: 'Nemesis Encounter - Test Nemesis Lvl 3',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN
        ]
      }
    ]
  }
}
