import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Butcher Monster Data
 */
export const BUTCHER: NemesisMonsterData = {
  name: 'Butcher',
  node: MonsterNode.NN1,
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
    movement: 5,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 9,
    toughnessTokens: 0,
    traits: ['Berserker', 'Fast Target', 'Dreaded Trophies']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 12,
    toughnessTokens: 0,
    traits: ['Frenzied Berserker', 'Fast Target', 'Dreaded Trophies']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 5,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 15,
    toughnessTokens: 0,
    traits: [
      'Frenzied Berserker',
      'Fast Target',
      'Invincible',
      'Dreaded Trophies',
      'Indomitable'
    ]
  },
  timeline: {
    4: 'Nemesis Encounter - Butcher Lvl 1',
    16: 'Nemesis Encounter - Butcher Lvl 2',
    23: 'Nemesis Encounter - Butcher Lvl 3'
  }
}
