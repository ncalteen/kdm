import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData } from '@/lib/types'

/**
 * Sunstalker (The Great Devourer) Monster Data
 *
 * This is the CO version of the Sunstalker encountered during The Great
 * Devourer event.
 *
 * This should not be selectable by the user directly. It should be added to
 * People of the Sun campaigns only.
 *
 * The Great Devourer is a level 3 Sunstalker with +2 toughness and +1 luck
 * tokens.
 */
export const GREAT_DEVOURER: NemesisMonsterData = {
  name: 'The Great Devourer',
  node: MonsterNode.CO,
  type: MonsterType.NEMESIS,
  level3: {
    accuracy: 0,
    accuracyTokens: 1,
    aiDeckSize: 20,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    luck: 0,
    luckTokens: 2,
    moods: [],
    movement: 16,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 18,
    toughnessTokens: 0,
    traits: [
      'Solar Energy',
      'Sun Dial',
      'Light & Shadow',
      'Shade',
      'Shadows of Darkness',
      'Living Shadows',
      'Monochrome',
      'Indomitable'
    ]
  },
  timeline: {
    25: 'Nemesis Encounter - The Great Devourer'
  }
}
