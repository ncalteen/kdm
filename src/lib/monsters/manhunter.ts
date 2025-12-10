import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Manhunter Monster Data
 */
export const MANHUNTER: NemesisMonsterData = {
  name: 'Manhunter',
  node: MonsterNode.NN1,
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
    movement: 6,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 8,
    toughnessTokens: 0,
    traits: ['Gritty Armament', 'Gun Action', 'Short Stride', 'Tombstone']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 13,
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
    toughness: 11,
    toughnessTokens: 0,
    traits: ['Full Stride', 'Gritty Armament', 'Gun Action', 'Tombstone']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 16,
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
    survivorStatuses: [],
    toughness: 11,
    toughnessTokens: 0,
    traits: [
      'Full Stride',
      'Gritty Armament',
      'Gun Action',
      'Indomitable',
      'Tombstone'
    ]
  },
  level4: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 18,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 9,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 13,
    toughnessTokens: 0,
    traits: [
      'Full Stride',
      'Gritty Armament',
      'Gun Action',
      'Indomitable',
      'Tombstone'
    ]
  },
  timeline: {
    6: 'The Hanged Man'
  }
}
