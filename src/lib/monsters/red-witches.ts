import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Red Witches Monster Data
 *
 * There are multiple versions of the Red Witches encounters. One for Braal, one
 * for Braal and Nico, and one for Braal, Nico, and Seer. This is the "core"
 * version that should be included when creating campaigns. The others should be
 * added in the background when the user selects this monster.
 */
export const RED_WITCHES: NemesisMonsterData = {
  name: 'Red Witches',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
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

/**
 * Red Witches (Braal) Monster Data
 */
export const RED_WITCHES_BRAAL: NemesisMonsterData = {
  name: 'Braal',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level1: {
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
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 11,
    toughnessTokens: 0,
    traits: ['Boiling Blood', 'Discouraging Presence']
  },
  level2: {
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
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 11,
    toughnessTokens: 0,
    traits: ['Discouraging Presence']
  },
  level3: {
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
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 11,
    toughnessTokens: 0,
    traits: ['Discouraging Presence', 'Indomitable']
  },
  timeline: {}
}

/**
 * Red Witches (Nico) Monster Data
 */
export const RED_WITCHES_NICO: NemesisMonsterData = {
  name: 'Nico',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level2: {
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
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Red Initiate', 'Witching Cloak']
  },
  level3: {
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
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Red Initiate', 'Witching Cloak', 'Indomitable']
  },
  timeline: {}
}

/**
 * Red Witches (Seer) Monster Data
 */
export const RED_WITCHES_SEER: NemesisMonsterData = {
  name: 'Red Witches',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level3: {
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
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 17,
    toughnessTokens: 0,
    traits: ['Red Secret', 'Indomitable']
  },
  timeline: {}
}
