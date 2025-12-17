import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Watcher Monster Data
 */
export const WATCHER: NemesisMonsterData = {
  name: 'Watcher',
  node: MonsterNode.CO,
  type: MonsterType.NEMESIS,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeck: {
      basic: 12,
      advanced: 0,
      legendary: 0
    },
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    life: 15,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: -1, // Infinite
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Retinue'],
    toughness: 0, // Must be manually entered
    toughnessTokens: 0,
    traits: [
      'Audience',
      'Lantern Vortex',
      'Vapor of Nothingness',

      'Indomitable'
    ]
  },
  timeline: {
    20: ['Watched'],
    25: ['Nemesis Encounter - Watcher']
  }
}
