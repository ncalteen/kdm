import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * King's Man Monster Data
 */
export const KINGS_MAN: NemesisMonsterData = {
  name: "King's Man",
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 10,
        advanced: 2,
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
      survivorStatuses: ['Battle Tempo'],
      toughness: 12,
      toughnessTokens: 0,
      traits: ["King's Aura", "King's Combat", 'Out-Fighting', 'Weak Spot']
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 11,
        advanced: 4,
        legendary: 1
      },
      aiDeckRemaining: 16,
      damage: 1,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 6,
      movementTokens: 0,
      speed: 1,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: ['Battle Tempo'],
      toughness: 15,
      toughnessTokens: 0,
      traits: [
        "King's Aura",
        "King's Combat",
        'Out-Fighting',
        'Silent Hymn',
        'Weak Spot'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 2,
      aiDeck: {
        basic: 12,
        advanced: 6,
        legendary: 1
      },
      aiDeckRemaining: 19,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 6,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: ['Battle Tempo'],
      toughness: 18,
      toughnessTokens: 0,
      traits: [
        "King's Aura",
        "King's Combat",
        'Out-Fighting',
        'Silent Hymn',
        'Weak Spot',

        'Indomitable'
      ]
    }
  ],
  timeline: {
    6: [
      {
        title: 'Armored Strangers',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_STARS
        ]
      }
    ],
    9: [
      {
        title: "Nemesis Encounter - King's Man Lvl 1",
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_STARS
        ]
      }
    ],
    19: [
      {
        title: "Nemesis Encounter - King's Man Lvl 2",
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_STARS
        ]
      }
    ],
    21: [
      {
        title: "Nemesis Encounter - King's Man Lvl 2",
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ],
    23: [
      {
        title: "Nemesis Encounter - King's Man Lvl 3",
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ],
    28: [
      {
        title: "Nemesis Encounter - King's Man Lvl 3",
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_STARS
        ]
      }
    ]
  }
}
