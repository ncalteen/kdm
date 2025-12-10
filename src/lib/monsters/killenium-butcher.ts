import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Killenium Butcher Monster Data
 */
export const KILLENIUM_BUTCHER: NemesisMonsterData = {
  name: 'Killenium Butcher',
  node: MonsterNode.NN2, // TODO: Confirm Node
  type: MonsterType.NEMESIS,
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
    movement: 5,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: ['Infectious Lunacy'],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Self-Aware', 'Scorn']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 21,
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
    traits: ['Self-Aware', 'Scorn', 'Indomitable', 'Berzerker', 'Invincible']
  },
  timeline: {}
}
