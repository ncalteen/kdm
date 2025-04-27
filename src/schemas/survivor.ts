import { CampaignType, Gender, Philosophy, WeaponType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Survivor Schema
 *
 * All survivor attributes and properties across all campaign types. Depending
 * on the campaign type, some properties may be optional or different.
 */
export const SURVIVOR_SCHEMA = z.object({
  // Main
  id: z.number(),
  type: z.enum(Object.keys(CampaignType) as [CampaignType, ...CampaignType[]]),
  name: z.string().describe('Name').min(1),
  gender: z.enum(Object.keys(Gender) as [Gender, ...Gender[]], {
    required_error: 'Required Field: Gender'
  }),

  // Hunt XP
  huntXP: z.number().min(0).max(16),
  huntXPRankUp: z.array(z.number()),

  // Survival
  survival: z.number().min(0),
  canSpendSurvival: z.boolean(),
  canDodge: z.boolean(),
  canEncourage: z.boolean(),
  canSurge: z.boolean(),
  canDash: z.boolean(),
  canFistPump: z.boolean(),
  canEndure: z.boolean(), // Arc Survivors
  systemicPressure: z.number().min(0), // Arc Survivors

  // Attributes
  movement: z.number().min(0),
  accuracy: z.number().min(0),
  strength: z.number().min(0),
  evasion: z.number().min(0),
  luck: z.number().min(0),
  speed: z.number().min(0),
  lumi: z.number().min(0), // Arc Survivors

  // Sanity
  insanity: z.number().min(0),
  brainLightDamage: z.boolean(),
  torment: z.number().min(0), // Arc Survivors

  // Head
  headArmor: z.number().min(0),
  headIntracranialHemorrhage: z.boolean(),
  headDeaf: z.boolean(),
  headBlindLeft: z.boolean(),
  headBlindRight: z.boolean(),
  headShatteredJaw: z.boolean(),
  headHeavyDamage: z.boolean(),

  // Arms
  armArmor: z.number().min(0),
  armDismemberedLeft: z.boolean(),
  armDismemberedRight: z.boolean(),
  armRupturedMuscle: z.boolean(),
  armContracture: z.number().min(0).max(5),
  armBrokenLeft: z.boolean(),
  armBrokenRight: z.boolean(),
  armLightDamage: z.boolean(),
  armHeavyDamage: z.boolean(),

  // Body
  bodyArmor: z.number().min(0),
  bodyGapingChestWound: z.number().min(0).max(5),
  bodyDestroyedBack: z.boolean(),
  bodyBrokenRib: z.number().min(0).max(5),
  bodyLightDamage: z.boolean(),
  bodyHeavyDamage: z.boolean(),

  // Waist
  waistArmor: z.number().min(0),
  waistIntestinalProlapse: z.boolean(),
  waistWarpedPelvis: z.number().min(0).max(5),
  waistDestroyedGenitals: z.boolean(),
  waistBrokenHip: z.boolean(),
  waistLightDamage: z.boolean(),
  waistHeavyDamage: z.boolean(),

  // Legs
  legArmor: z.number().min(0),
  legDismemberedLeft: z.boolean(),
  legDismemberedRight: z.boolean(),
  legHamstrung: z.boolean(),
  legBrokenLeft: z.boolean(),
  legBrokenRight: z.boolean(),
  legLightDamage: z.boolean(),
  legHeavyDamage: z.boolean(),

  // Weapon Proficiency
  weaponType: z
    .enum(Object.keys(WeaponType) as [WeaponType, ...WeaponType[]])
    .optional(),
  weaponProficiency: z.number().min(0).max(8),

  // Courage
  courage: z.number().min(0).max(9),
  hasStalwart: z.boolean(),
  hasPrepared: z.boolean(),
  hasMatchmaker: z.boolean(),

  // Understanding
  understanding: z.number().min(0).max(9),
  hasAnalyze: z.boolean(),
  hasExplore: z.boolean(),
  hasTinker: z.boolean(),

  // Next Departure
  nextDeparture: z.string().optional(),

  // Fighting Arts
  // TODO: Arc Survivors: Limited to one fighting art and secret fighting art.
  canUseFightingArtsOrKnowledges: z.boolean(),
  fightingArts: z.array(z.string()),
  secretFightingArts: z.array(z.string()),

  // Disorders
  disorders: z.array(z.string()).max(3),

  // Abilities and Impairments
  abilitiesAndImpairments: z.array(z.string()),
  skipNextHunt: z.boolean(),

  // Once Per Lifetime
  oncePerLifetime: z.array(z.string()),
  rerollUsed: z.boolean(),

  /**
   * Arc Survivors
   */

  // Philosophy
  philosophy: z
    .enum(Object.keys(Philosophy) as [Philosophy, ...Philosophy[]])
    .optional(),
  neurosis: z.string().optional(),
  tenetKnowledge: z.string().optional(),
  tenetKnowledgeObservationRank: z.number().min(0).max(9).optional(),
  tenetKnowledgeRules: z.string().optional(),
  tenetKnowledgeObservationConditions: z.string().optional(),
  tenetKnowledgeRankUp: z.number().min(0).max(9).optional(),

  // Knowledge
  knowledge1: z.string().optional(),
  knowledge1ObservationRank: z.number().min(0).max(9).optional(),
  knowledge1Rules: z.string().optional(),
  knowledge1ObservationConditions: z.string().optional(),
  knowledge1RankUp: z.number().min(0).max(9).optional(),

  knowledge2: z.string().optional(),
  knowledge2ObservationRank: z.number().min(0).max(9).optional(),
  knowledge2Rules: z.string().optional(),
  knowledge2ObservationConditions: z.string().optional(),
  knowledge2RankUp: z.number().min(0).max(9).optional(),

  /**
   * People of the Stars Survivors Only
   */
  // Gambler
  hasGamblerWitch: z.boolean(),
  hasGamblerRust: z.boolean(),
  hasGamblerStorm: z.boolean(),
  hasGamblerReaper: z.boolean(),

  // Absolute
  hasAbsoluteWitch: z.boolean(),
  hasAbsoluteRust: z.boolean(),
  hasAbsoluteStorm: z.boolean(),
  hasAbsoluteReaper: z.boolean(),

  // Sculptor
  hasSculptorWitch: z.boolean(),
  hasSculptorRust: z.boolean(),
  hasSculptorStorm: z.boolean(),
  hasSculptorReaper: z.boolean(),

  // Goblin
  hasGoblinWitch: z.boolean(),
  hasGoblinRust: z.boolean(),
  hasGoblinStorm: z.boolean(),
  hasGoblinReaper: z.boolean()
})
// .superRefine(async (data, ctx) => {
//   // There should only be 3 total fighting arts.
//   if (data.fightingArts.length + data.secretFightingArts.length > 3)
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: 'Limit: 3 Fighting Arts'
//     })
// })
