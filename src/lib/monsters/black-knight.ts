import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

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
    aiDeckSize: 12,
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
    traits: ['Smash', 'Sheer Cliffs', 'Spry', 'Red Preference']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 16,
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
    traits: ['Smash', 'Sheer Cliffs', 'Spry', 'Red Preference', 'Unsteady']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 22,
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
      'Smash',
      'Sheer Cliffs',
      'Spry',
      'Red Preference',
      'Unsteady',
      'Seasoned Duelist',
      'Indomitable'
    ]
  },
  timeline: {
    14: 'Waiting Bell'
  }
}
