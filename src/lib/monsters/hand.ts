import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * The Hand Monster Data
 *
 * Note: For People of the Dream Keeper campaigns, add the Suspicious trait.
 */
export const HAND: NemesisMonsterData = {
  name: 'The Hand',
  node: MonsterNode.NN3,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 10,
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
    survivorStatuses: ['Polarized Aura'],
    toughness: 14,
    toughnessTokens: 0,
    traits: [
      'Red Lens - Closed',
      'Blue Lens - Closed',
      'Green Lens - Closed',
      'Ghost Step',
      'Applause',
      'Impossible Eyes'
    ]
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 11,
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
    survivorStatuses: ['Polarized Aura'],
    toughness: 15,
    toughnessTokens: 0,
    traits: [
      'Red Lens - Closed',
      'Blue Lens - Closed',
      'Green Lens - Closed',
      'Ghost Step',
      'Applause',
      'Impossible Eyes'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 12,
    damage: 6,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 6,
    movementTokens: 0,
    speed: 3,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Polarized Aura'],
    toughness: 30,
    toughnessTokens: 0,
    traits: [
      'Red Lens - Closed',
      'Blue Lens - Closed',
      'Green Lens - Closed',
      'Ghost Step',
      'Applause',
      'Impossible Eyes',
      'Indomitable'
    ]
  },
  timeline: {
    11: {
      title: 'Regal Visit',
      campaigns: [CampaignType.PEOPLE_OF_THE_LANTERN]
    },
    13: {
      title: 'Nemesis Encounter - The Hand Lvl 1',
      campaigns: [
        CampaignType.PEOPLE_OF_THE_LANTERN,
        CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
      ]
    },
    24: {
      title: 'Nemesis Encounter - The Hand Lvl 3',
      campaigns: [CampaignType.PEOPLE_OF_THE_SUN]
    }
  }
}
