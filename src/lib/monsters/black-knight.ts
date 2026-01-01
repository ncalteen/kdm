import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Black Knight Monster Data
 */
export const BLACK_KNIGHT: NemesisMonsterData = {
  name: 'Black Knight',
  node: MonsterNode.NN3,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 8,
      advanced: 4,
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
    movement: 6,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 4,
    traits: ['Red Preference', 'Sheer Cliffs', 'Smash', 'Spry']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeck: {
      basic: 9,
      advanced: 6,
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
    movement: 7,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 6,
    traits: ['Red Preference', 'Sheer Cliffs', 'Smash', 'Spry', 'Unsteady']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeck: {
      basic: 11,
      advanced: 8,
      legendary: 3
    },
    aiDeckRemaining: 22,
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
    toughness: 10,
    toughnessTokens: 8,
    traits: [
      'Red Preference',
      'Seasoned Duelist',
      'Sheer Cliffs',
      'Smash',
      'Spry',
      'Unsteady',

      'Indomitable'
    ]
  },
  timeline: {
    13: ['Waiting Bell']
  }
}
