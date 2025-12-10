import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Slenderman Monster Data
 */
export const SLENDERMAN: NemesisMonsterData = {
  name: 'Slenderman',
  node: MonsterNode.NN2,
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
    survivorStatuses: ['Madness Inversion'],
    toughness: 11,
    toughnessTokens: 0,
    traits: ['Ensnare', 'Gloom']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 15,
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
    survivorStatuses: ['Madness Inversion'],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Ensnare', 'Gloom']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 20,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 6,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Madness Inversion'],
    toughness: 17,
    toughnessTokens: 0,
    traits: ['Ensnare', 'Gloom', 'Hounds', 'Indomitable']
  },
  timeline: {
    6: ["It's Already Here"],
    9: ['Nemesis Encounter - Slenderman Lvl 1'],
    19: ['Nemesis Encounter - Slenderman Lvl 2'],
    28: ['Nemesis Encounter - Slenderman Lvl 3']
  }
}
