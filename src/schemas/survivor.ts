'use client'

import { Gender, Philosophy, WeaponType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Survivor Schema
 *
 * All survivor attributes and properties across all settlement types. Depending
 * on the settlement type, some properties may be optional or different.
 */
export const SurvivorSchema = z.object({
  /** Abilities and Impairments */
  abilitiesAndImpairments: z.array(z.string()),
  /** Accuracy */
  accuracy: z.number().min(0),
  /** Can Dash */
  canDash: z.boolean().optional(),
  /** Can Dodge */
  canDodge: z.boolean().optional(),
  /** Can Fist Pump */
  canFistPump: z.boolean().optional(),
  /** Can Encourage */
  canEncourage: z.boolean().optional(),
  /** Can Spend Survival */
  canSpendSurvival: z.boolean().optional(),
  /** Can Surge */
  canSurge: z.boolean().optional(),
  /** Can Use Fighting Arts or Knowledges */
  canUseFightingArtsOrKnowledges: z.boolean().optional(),
  /** Courage */
  courage: z.number().min(0).max(9),
  /** Survivor is Dead */
  dead: z.boolean(),
  /** Disorders */
  disorders: z.array(z.string()).max(3),
  /** Evasion */
  evasion: z.number().min(0),
  /** Fighting Arts */
  fightingArts: z.array(z.string()),
  /** Gender */
  gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]]),
  /** Has Analyze */
  hasAnalyze: z.boolean(),
  /** Has Explore */
  hasExplore: z.boolean(),
  /** Has Matchmaker */
  hasMatchmaker: z.boolean(),
  /** Has Prepared */
  hasPrepared: z.boolean(),
  /** Has Stalwart */
  hasStalwart: z.boolean(),
  /** Has Tinker */
  hasTinker: z.boolean(),
  /** Hunt XP */
  huntXP: z.number().min(0).max(16),
  /** Hunt XP Rank Up Milestones */
  huntXPRankUp: z.array(z.number()),
  /** Survivor ID */
  id: z.number(),
  /** Insanity */
  insanity: z.number().min(0),
  /** Luck */
  luck: z.number().min(0),
  /** Movement */
  movement: z.number().min(0),
  /** Name */
  name: z.string().describe('Name').min(1),
  /** Next Departure */
  nextDeparture: z.string().optional(),
  /** Once Per Lifetime */
  oncePerLifetime: z.array(z.string()),
  /** Reroll Used */
  rerollUsed: z.boolean(),
  /** Survivor is Retired */
  retired: z.boolean(),
  /** Secret Fighting Arts */
  secretFightingArts: z.array(z.string()),
  /** Settlement ID */
  settlementId: z.number(),
  /** Skip Next Hunt */
  skipNextHunt: z.boolean(),
  /** Speed */
  speed: z.number().min(0),
  /** Strength */
  strength: z.number().min(0),
  /** Survival */
  survival: z.number().min(0),
  /** Understanding */
  understanding: z.number().min(0).max(9),
  /** Weapon Proficiency (Level) */
  weaponProficiency: z.number().min(0).max(8),
  /** Weapon Proficiency (Type) */
  weaponProficiencyType: z
    .enum(Object.keys(WeaponType) as [WeaponType, ...WeaponType[]])
    .optional(),

  /*
   * Hunt/Showdown Attributes
   *
   * These attributes are used for the Hunt and Showdown phases. They are
   * reset when the survivor returns to the settlement.
   */

  /** Arm: Armor */
  armArmor: z.number().min(0),
  /** Arm: Light Damage Received */
  armLightDamage: z.boolean(),
  /** Arm: Heavy Damage Received */
  armHeavyDamage: z.boolean(),
  /** Body: Armor */
  bodyArmor: z.number().min(0),
  /** Body: Light Damage */
  bodyLightDamage: z.boolean(),
  /** Body: Heavy Damage */
  bodyHeavyDamage: z.boolean(),
  /** Brain: Light Damage Received */
  brainLightDamage: z.boolean(),
  /** Head: Armor */
  headArmor: z.number().min(0),
  /** Head: Heavy Damage Received */
  headHeavyDamage: z.boolean(),
  /** Leg: Armor */
  legArmor: z.number().min(0),
  /** Leg: Light Damage Received */
  legLightDamage: z.boolean(),
  /** Leg: Heavy Damage Received */
  legHeavyDamage: z.boolean(),
  /** Waist: Armor */
  waistArmor: z.number().min(0),
  /** Waist: Light Damage Received */
  waistLightDamage: z.boolean(),
  /** Waist: Heavy Damage Received */
  waistHeavyDamage: z.boolean(),

  /*
   * Severe Injuries
   */

  /** Arm: Broken (Left) */
  armBrokenLeft: z.boolean(),
  /** Arm: Broken (Right) */
  armBrokenRight: z.boolean(),
  /** Arm: Contracture */
  armContracture: z.number().min(0).max(5),
  /** Arm: Dismembered (Left) */
  armDismemberedLeft: z.boolean(),
  /** Arm: Dismembered (Right) */
  armDismemberedRight: z.boolean(),
  /** Arm: Ruptured Muscle */
  armRupturedMuscle: z.boolean(),
  /** Body: Broken Rib */
  bodyBrokenRib: z.number().min(0).max(5),
  /** Body: Destroyed Back */
  bodyDestroyedBack: z.boolean(),
  /** Body: Gaping Chest Wound */
  bodyGapingChestWound: z.number().min(0).max(5),
  /** Head: Blind (Left) */
  headBlindLeft: z.boolean(),
  /** Head: Blind (Right) */
  headBlindRight: z.boolean(),
  /** Head: Deaf */
  headDeaf: z.boolean(),
  /** Head: Intracranial Hemorrhage */
  headIntracranialHemorrhage: z.boolean(),
  /** Head: Shattered Jaw */
  headShatteredJaw: z.boolean(),
  /** Leg: Broken (Left) */
  legBrokenLeft: z.boolean(),
  /** Leg: Broken (Right) */
  legBrokenRight: z.boolean(),
  /** Leg: Dismembered (Left) */
  legDismemberedLeft: z.boolean(),
  /** Leg: Dismembered (Right) */
  legDismemberedRight: z.boolean(),
  /** Leg: Hamstrung */
  legHamstrung: z.boolean(),
  /** Waist: Broken Hip */
  waistBrokenHip: z.boolean(),
  /** Waist: Destroyed Genitals */
  waistDestroyedGenitals: z.boolean(),
  /** Waist: Intestinal Prolapse */
  waistIntestinalProlapse: z.boolean(),
  /** Waist: Warped Pelvis */
  waistWarpedPelvis: z.number().min(0).max(5),

  /*
   * Arc Survivors
   */

  /** Can Endure */
  canEndure: z.boolean().optional(),
  /** Knowledge 1 */
  knowledge1: z.string().optional(),
  /** Knowledge 1: Observation Conditions */
  knowledge1ObservationConditions: z.string().optional(),
  /** Knowledge 1: Observation Ranks */
  knowledge1ObservationRank: z.number().min(0).max(9).optional(),
  /** Knowledge 1: Rank Up Milestone */
  knowledge1RankUp: z.number().min(0).max(9).optional(),
  /** Knowledge 1: Rules */
  knowledge1Rules: z.string().optional(),
  /** Knowledge 2 */
  knowledge2: z.string().optional(),
  /** Knowledge 2: Observation Conditions */
  knowledge2ObservationConditions: z.string().optional(),
  /** Knowledge 2: Observation Ranks */
  knowledge2ObservationRank: z.number().min(0).max(9).optional(),
  /** Knowledge 2: Rank Up Milestone */
  knowledge2RankUp: z.number().min(0).max(9).optional(),
  /** Knowledge 2: Rules */
  knowledge2Rules: z.string().optional(),
  /** Lumi */
  lumi: z.number().min(0),
  /** Neurosis */
  neurosis: z.string().optional(),
  /** Philosophy */
  philosophy: z
    .enum(Object.keys(Philosophy) as [Philosophy, ...Philosophy[]])
    .optional(),
  /** Systemic Pressure */
  systemicPressure: z.number().min(0),
  /** Tenet Knowledge */
  tenetKnowledge: z.string().optional(),
  /** Tenet Knowledge: Observation Conditions */
  tenetKnowledgeObservationConditions: z.string().optional(),
  /** Tenet Knowledge: Observation Ranks */
  tenetKnowledgeObservationRank: z.number().min(0).max(9).optional(),
  /** Tenet Knowledge: Rank Up Milestone */
  tenetKnowledgeRankUp: z.number().min(0).max(9).optional(),
  /** Tenet Knowledge: Rules */
  tenetKnowledgeRules: z.string().optional(),
  /** Torment */
  torment: z.number().min(0),

  /**
   * People of the Stars Survivors
   */

  /** Absolute / Reaper */
  hasAbsoluteReaper: z.boolean(),
  /** Absolute / Rust */
  hasAbsoluteRust: z.boolean(),
  /** Absolute / Storm */
  hasAbsoluteStorm: z.boolean(),
  /** Absolute / Witch */
  hasAbsoluteWitch: z.boolean(),
  /** Gambler / Reaper */
  hasGamblerReaper: z.boolean(),
  /** Gambler / Rust */
  hasGamblerRust: z.boolean(),
  /** Gambler / Storm */
  hasGamblerStorm: z.boolean(),
  /** Gambler / Witch */
  hasGamblerWitch: z.boolean(),
  /** Goblin / Reaper */
  hasGoblinReaper: z.boolean(),
  /** Goblin / Rust */
  hasGoblinRust: z.boolean(),
  /** Goblin / Storm */
  hasGoblinStorm: z.boolean(),
  /** Goblin / Witch*/
  hasGoblinWitch: z.boolean(),
  /** Sculptor / Reaper */
  hasSculptorReaper: z.boolean(),
  /** Sculptor / Rust */
  hasSculptorRust: z.boolean(),
  /** Sculptor / Storm */
  hasSculptorStorm: z.boolean(),
  /** Sculptor / Witch */
  hasSculptorWitch: z.boolean()
})
// TODO: Arc Survivors: Limited to one fighting art and secret fighting art.
// .superRefine(async (data, ctx) => {
//   // There should only be 3 total fighting arts.
//   if (data.fightingArts.length + data.secretFightingArts.length > 3)
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: 'Limit: 3 Fighting Arts'
//     })
// })
