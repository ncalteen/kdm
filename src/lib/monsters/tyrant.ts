import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Tyrant Monster Data
 */
export const TYRANT: NemesisMonsterData = {
  name: 'The Tyrant',
  node: MonsterNode.CO,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 11,
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
    traits: ['Crooked Step', 'Spectral Blast', "Destiny's Marrow"]
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 14,
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
    traits: ['Crooked Step', 'Spectral Blast', "Destiny's Marrow", 'Quickened']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 22,
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
      'Spectral Blast',
      "Destiny's Marrow",
      'Quickened',
      'Indomitable'
    ]
  },
  timeline: {}
}
