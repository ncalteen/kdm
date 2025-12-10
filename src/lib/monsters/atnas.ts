import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Atnas the Child Eater Monster Data
 */
export const ATNAS: NemesisMonsterData = {
  name: 'Atnas the Child Eater',
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
    survivorStatuses: [],
    toughness: 11,
    toughnessTokens: 0,
    traits: [
      'Old Battle Scars',
      "Master's Presence",
      'Mad Master',
      'Spark of Joy'
    ]
  },
  level2: {
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
    movement: 7,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 14,
    toughnessTokens: 0,
    traits: [
      'Old Battle Scars',
      "Master's Presence",
      'Mad Master',
      'Curb Stomp',
      'Spark of Joy'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 21,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 7,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 19,
    toughnessTokens: 0,
    traits: [
      'Old Battle Scars',
      "Master's Presence",
      'Indomitable',
      'Mad Master',
      'Curb Stomp',
      'Spark of Joy',
      'Keen Eyes'
    ]
  },
  timeline: {
    9: 'Nemesis Encounter - Atnas the Child Eater Lvl 1',
    18: 'Nemesis Encounter - Atnas the Child Eater Lvl 2',
    28: 'Nemesis Encounter - Atnas the Child Eater Lvl 3'
  }
}
