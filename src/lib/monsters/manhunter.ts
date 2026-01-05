import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Manhunter Monster Data
 */
export const MANHUNTER: NemesisMonsterData = {
  name: 'Manhunter',
  node: MonsterNode.NN1,
  type: MonsterType.NEMESIS,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 3,
        legendary: 0
      },
      aiDeckRemaining: 10,
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
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 7,
        advanced: 6,
        legendary: 0
      },
      aiDeckRemaining: 13,
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
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 7,
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
        'Tombstone',

        'Indomitable'
      ]
    }
  ],
  level4: [
    {
      accuracy: 0,
      accuracyTokens: 2,
      aiDeck: {
        basic: 8,
        advanced: 8,
        legendary: 2
      },
      aiDeckRemaining: 18,
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
        'Tombstone',

        'Indomitable'
      ]
    }
  ],
  timeline: {
    5: ['The Hanged Man'],
    10: ['Nemesis Encounter - Manhunter Lvl 2'],
    16: ['Nemesis Encounter - Manhunter Lvl 3'],
    22: ['Nemesis Encounter - Manhunter Lvl 4']
  }
}
