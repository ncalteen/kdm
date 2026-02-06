import { Gender } from '@/lib/enums'
import { Wanderer } from '@/schemas/wanderer'

/**
 * Aenas Wanderer Data
 */
export const AENAS: Wanderer = {
  abilitiesAndImpairments: ['Endless Appetite', 'Veteran'],
  accuracy: 1,
  arc: true,
  courage: 1,
  disposition: 0,
  evasion: 2,
  fightingArts: [],
  gender: Gender.FEMALE,
  huntXP: 0,
  huntXPRankUp: [1, 5, 9, 13],
  insanity: 4,
  luck: 0,
  lumi: 1,
  movement: 5,
  name: 'Aenas',
  permanentInjuries: [],
  rareGear: ['Moonwolf Charm'],
  speed: 0,
  strength: 2,
  survival: 3,
  systemicPressure: 0,
  timeline: {
    7: ['Wanderer - Aenas']
  },
  torment: 1,
  understanding: 0
}

/**
 * Aenas' State
 *
 * Aenas can be in one of two states: Content or Hungry. This affects her
 * behavior while in the settlement.
 */
export enum AenasState {
  /** Content */
  CONTENT = 'Content',
  /** Hungry */
  HUNGRY = 'Hungry'
}
