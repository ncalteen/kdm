import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/schemas/monster'

/**
 * Dying God Monster Data
 *
 * Finale boss for PotStars campaigns.
 */
export const DYING_GOD: NemesisMonsterData = {
  name: 'Dying God (Dragon King)',
  node: MonsterNode.FI,
  type: MonsterType.NEMESIS,
  level3: [
    {
      accuracy: 0,
      accuracyTokens: 0,
      aiDeck: {
        basic: 5,
        advanced: 5,
        legendary: 1
      },
      aiDeckRemaining: 11,
      damage: 3,
      damageTokens: 0,
      evasion: 0,
      evasionTokens: 0,
      life: 20,
      luck: 0,
      luckTokens: 0,
      moods: [],
      movement: 10,
      movementTokens: 0,
      speed: 2,
      speedTokens: 0,
      strength: 0,
      strengthTokens: 0,
      survivorStatuses: [],
      toughness: 17,
      toughnessTokens: 0,
      traits: ['Irradiate', 'Smolder', 'Trample', 'Unseen Agony']
    }
  ],
  timeline: {
    24: ['Nemesis Encounter - Death of the Dragon King']
  }
}
