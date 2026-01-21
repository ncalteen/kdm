import { MonsterType } from '@/lib/enums'
import { VignetteMonsterData } from '@/schemas/vignette-monster-data'

/**
 * Killenium Butcher Monster Data
 */
export const KILLENIUM_BUTCHER: VignetteMonsterData = {
  name: 'Killenium Butcher',
  type: MonsterType.NEMESIS,
  level2: [
    {
      accuracy: 0,
      accuracyTokens: 1,
      aiDeck: {
        basic: 9,
        advanced: 6,
        legendary: 0
      },
      aiDeckRemaining: 15,
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
      toughness: 13,
      toughnessTokens: 0,
      traits: ['Scorn', 'Self-Aware']
    }
  ],
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 2,
      aiDeck: {
        basic: 11,
        advanced: 10,
        legendary: 0
      },
      aiDeckRemaining: 21,
      damage: 2,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 1,
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
      toughness: 16,
      toughnessTokens: 0,
      traits: ['Berzerker', 'Invincible', 'Scorn', 'Self-Aware', 'Indomitable']
    }
  ],
  timeline: {}
}
