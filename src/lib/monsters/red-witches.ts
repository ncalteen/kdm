import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * Red Witches Monster Data
 */
export const RED_WITCHES: NemesisMonsterData = {
  multiMonster: true,
  name: 'Red Witches',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 3,
        legendary: 2
      },
      aiDeckRemaining: 12,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 10,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Braal',
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 11,
      toughnessTokens: 0,
      traits: ['Boiling Blood', 'Discouraging Presence']
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 3,
        legendary: 2
      },
      aiDeckRemaining: 12,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 10,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Braal',
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 11,
      toughnessTokens: 0,
      traits: ['Discouraging Presence']
    },
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 6,
        advanced: 4,
        legendary: 2
      },
      aiDeckRemaining: 12,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 8,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Nico',
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 13,
      toughnessTokens: 0,
      traits: ['Red Initiate', 'Witching Cloak']
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 3,
        legendary: 2
      },
      aiDeckRemaining: 12,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 10,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Braal',
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 11,
      toughnessTokens: 0,
      traits: ['Discouraging Presence', 'Indomitable']
    },
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 6,
        advanced: 4,
        legendary: 2
      },
      aiDeckRemaining: 12,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 8,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Nico',
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 13,
      toughnessTokens: 0,
      traits: ['Red Initiate', 'Witching Cloak', 'Indomitable']
    },
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 6,
        advanced: 2,
        legendary: 4
      },
      aiDeckRemaining: 12,
      damage: 0,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 6,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 7,
      movementTokens: 0,
      name: 'Seer',
      speed: 0,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 17,
      toughnessTokens: 0,
      traits: ['Red Secret', 'Indomitable']
    }
  ],
  timeline: {
    9: [
      {
        title: 'Challenger At the Gates',
        campaigns: [
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          CampaignType.PEOPLE_OF_THE_LANTERN,
          CampaignType.PEOPLE_OF_THE_STARS
        ]
      }
    ],
    21: [
      {
        title: 'Nemesis Encounter - Braal & Nico',
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ],
    23: [
      {
        title: 'Nemesis Encounter - Braal, Nico & Seer',
        campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
      }
    ]
  }
}
