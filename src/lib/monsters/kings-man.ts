import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * King's Man Monster Data
 */
export const KINGS_MAN: NemesisMonsterData = {
  name: "King's Man",
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
    movement: 5,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Battle Tempo'],
    toughness: 12,
    toughnessTokens: 0,
    traits: ['Weak Spot', "King's Aura", "King's Combat", 'Out-Fighting']
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
    movement: 6,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Battle Tempo'],
    toughness: 15,
    toughnessTokens: 0,
    traits: [
      'Weak Spot',
      "King's Aura",
      "King's Combat",
      'Out-Fighting',
      'Silent Hymn'
    ]
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 19,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 6,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Battle Tempo'],
    toughness: 18,
    toughnessTokens: 0,
    traits: [
      'Weak Spot',
      "King's Aura",
      "King's Combat",
      'Out-Fighting',
      'Silent Hymn',
      'Indomitable'
    ]
  },
  timeline: {
    6: 'Armored Strangers',
    9: "Nemesis Encounter - King's Man Lvl 1",
    19: "Nemesis Encounter - King's Man Lvl 2",
    28: "Nemesis Encounter - King's Man Lvl 3"
  }
}
