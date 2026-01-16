import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'

/**
 * Gold Smoke Knight Monster Data
 */
export const GOLD_SMOKE_KNIGHT: NemesisMonsterData = {
  name: 'Gold Smoke Knight',
  node: MonsterNode.FI,
  type: MonsterType.NEMESIS,
  level4: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 9,
        advanced: 7,
        legendary: 2
      },
      aiDeckRemaining: 18,
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
      toughness: 27,
      toughnessTokens: 0,
      traits: [
        'Blacken',
        'Frustration',
        'Mauler',
        'Secondary Forge',

        'Indomitable'
      ]
    }
  ],
  timeline: {
    30: ['Nemesis Encounter - Gold Smoke Knight']
  }
}
