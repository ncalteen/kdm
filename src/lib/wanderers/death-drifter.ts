import { Gender } from '@/lib/enums'
import { Wanderer } from '@/schemas/wanderer'

/**
 * Death Drifter Wanderer Data
 */
export const DEATH_DRIFTER: Wanderer = {
  abilitiesAndImpairments: ['Lone Drifter', 'Veteran'],
  accuracy: 1,
  arc: true,
  courage: 0,
  disposition: 0,
  evasion: 1,
  fightingArts: [],
  gender: Gender.MALE,
  huntXP: 0,
  huntXPRankUp: [1, 3, 7, 13],
  insanity: 4,
  luck: 0,
  lumi: 4,
  movement: 5,
  name: 'Death Drifter',
  permanentInjuries: [],
  rareGear: ['Death Drifter Cloak'],
  speed: 0,
  strength: 0,
  survival: 4,
  systemicPressure: 1,
  timeline: {
    6: ['Wanderer - Death Drifter']
  },
  torment: 0,
  understanding: 0
}
