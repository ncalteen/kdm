import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Godhand Monster Data
 */
export const GODHAND: NemesisMonsterData = {
  name: 'Godhand',
  node: MonsterNode.FI,
  type: MonsterType.NEMESIS,
  level4: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeck: {
      basic: 6,
      advanced: 5,
      legendary: 1
    },
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    life: 30,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: -1, // Infinite
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 30,
    toughnessTokens: 0,
    traits: ['Old Blood', 'Reinforcements', 'True Ghost Step', 'Indomitable']
  },
  timeline: {
    30: ['Nemesis Encounter - Godhand']
  }
}
