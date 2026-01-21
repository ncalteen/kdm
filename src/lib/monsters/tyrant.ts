import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * Tyrant Monster Data
 */
export const TYRANT: NemesisMonsterData = {
  multiMonster: false,
  name: 'The Tyrant',
  node: MonsterNode.CO,
  type: MonsterType.NEMESIS,
  level1: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 6,
        advanced: 5,
        legendary: 0
      },
      aiDeckRemaining: 11,
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
      traits: ['Crooked Step', "Destiny's Marrow", 'Spectral Blast']
    }
  ],
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 8,
        advanced: 6,
        legendary: 0
      },
      aiDeckRemaining: 14,
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
      toughness: 10,
      toughnessTokens: 0,
      traits: [
        'Crooked Step',
        "Destiny's Marrow",
        'Quickened',
        'Spectral Blast'
      ]
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 12,
        advanced: 8,
        legendary: 2
      },
      aiDeckRemaining: 22,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
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
      toughness: 14,
      toughnessTokens: 0,
      traits: [
        'Crooked Step',
        "Destiny's Marrow",
        'Quickened',
        'Spectral Blast',

        'Indomitable'
      ]
    }
  ],
  timeline: {
    4: ['Nemesis Encounter - Tyrant Lvl 1'],
    9: ['Nemesis Encounter - Tyrant Lvl 2'],
    19: ['Nemesis Encounter - Tyrant Lvl 3']
  }
}
