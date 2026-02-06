import { Gender } from '@/lib/enums'
import { Wanderer } from '@/schemas/wanderer'

/**
 * Goth Wanderer Data
 */
export const GOTH: Wanderer = {
  abilitiesAndImpairments: ['Revenant', 'Veteran'],
  accuracy: 0,
  arc: true,
  courage: 1,
  disposition: 0,
  evasion: -1,
  fightingArts: [],
  gender: Gender.FEMALE,
  huntXP: 0,
  huntXPRankUp: [1, 4, 8],
  insanity: 4,
  luck: 0,
  lumi: 2,
  movement: 5,
  name: 'Goth',
  permanentInjuries: [],
  rareGear: ['Common Katana', 'Rapture Bracelet'],
  speed: 1,
  strength: 0,
  survival: 1,
  systemicPressure: 0,
  timeline: {
    4: ['Wanderer - Goth']
  },
  torment: 1,
  understanding: 0
}
