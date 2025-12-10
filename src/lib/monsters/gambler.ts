import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Gambler Monster Data
 */
export const GAMBLER: NemesisMonsterData = {
  name: 'Gambler',
  node: MonsterNode.CO,
  type: MonsterType.NEMESIS,
  level4: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 21,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 10000,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 20,
    toughnessTokens: 0,
    traits: [
      'Critical Failure',
      'Double or Death',
      'Magister Ludi',
      "Gambler's Dice",
      'Dice Bag'
    ]
  },
  timeline: {
    20: 'Nemesis Encounter - The Gambler'
  }
}
