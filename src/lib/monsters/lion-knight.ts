import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Lion Knight Monster Data
 */
export const LION_KNIGHT: NemesisMonsterData = {
  name: 'Lion Knight',
  node: MonsterNode.NN2,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 2,
      legendary: 0
    },
    damage: 0,
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
    toughnessTokens: 0,
    traits: ['Outburst', 'Zeal']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 10,
      advanced: 5,
      legendary: 0
    },
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 12,
    toughnessTokens: 0,
    traits: ['Drama Lessons', 'Outburst', 'Zeal']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 12,
      advanced: 9,
      legendary: 0
    },
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 9,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 15,
    toughnessTokens: 0,
    traits: ['Drama Lessons', 'Last Act', 'Outburst', 'Zeal', 'Indomitable']
  },
  timeline: {
    6: ['An Uninvited Guest'],
    8: ['Places Everyone', 'Nemesis Encounter - Lion Knight Lvl 1'],
    12: ['Places Everyone', 'Nemesis Encounter - Lion Knight Lvl 2'],
    16: ['Places Everyone', 'Nemesis Encounter - Lion Knight Lvl 3']
  }
}
