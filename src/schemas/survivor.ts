'use client'

import { ColorChoice, Gender, Philosophy, WeaponType } from '@/lib/enums'
import { AenasState } from '@/lib/wanderers/aenas'
import { z } from 'zod'

/**
 * Base Survivor Schema
 *
 * This includes all attributes and properties of a survivor that are known
 * before the user tries to create one.
 */
export const BaseSurvivorSchema = z.object({
  /** Abilities and Impairments */
  abilitiesAndImpairments: z
    .array(
      z.string().min(1, 'A nameless ability/impairment cannot be recorded.')
    )
    .default([]),
  /** Accuracy */
  accuracy: z.number().default(0),
  /** Can Dash */
  canDash: z.boolean().default(false),
  /** Can Dodge */
  canDodge: z.boolean().default(true),
  /** Can Fist Pump */
  canFistPump: z.boolean().default(false),
  /** Can Encourage */
  canEncourage: z.boolean().default(false),
  /** Can Spend Survival */
  canSpendSurvival: z.boolean().default(true),
  /** Can Surge */
  canSurge: z.boolean().default(false),
  /** Can Use Fighting Arts or Knowledges */
  canUseFightingArtsOrKnowledges: z.boolean().default(true),
  /** Survivor Color Code */
  color: z.enum(ColorChoice).default(ColorChoice.SLATE),
  /** Courage */
  courage: z
    .number()
    .min(0, 'Courage cannot be negative.')
    .max(9, 'Courage may not exceed 9.')
    .default(0),
  /** Cursed Gear */
  cursedGear: z
    .array(z.string().min(1, 'A nameless cursed gear item cannot be recorded.'))
    .default([]),
  /** Survivor is Dead */
  dead: z.boolean().default(false),
  /** Disorders */
  disorders: z
    .array(z.string().min(1, 'A nameless disorder cannot be recorded.'))
    .max(3, 'A survivor may not have more than three disorders.')
    .default([]),
  /** Disposition (Wanderers) */
  disposition: z.number().optional(),
  /** Evasion */
  evasion: z.number().default(0),
  /** Fighting Arts */
  fightingArts: z
    .array(z.string().min(1, 'A nameless fighting art cannot be recorded.'))
    .default([]),
  /** Has Analyze */
  hasAnalyze: z.boolean().default(false),
  /** Has Explore */
  hasExplore: z.boolean().default(false),
  /** Has Matchmaker */
  hasMatchmaker: z.boolean().default(false),
  /** Has Prepared */
  hasPrepared: z.boolean().default(false),
  /** Has Stalwart */
  hasStalwart: z.boolean().default(false),
  /** Has Tinker */
  hasTinker: z.boolean().default(false),
  /** Hunt XP */
  huntXP: z
    .number()
    .min(0, 'Hunt XP cannot be negative.')
    .max(16, 'Hunt XP cannot exceed 16.')
    .default(0),
  /** Insanity */
  insanity: z.number().min(0, 'Insanity cannot be negative.').default(0),
  /** Luck */
  luck: z.number().default(0),
  /** Movement */
  movement: z.number().min(1, 'Movement cannot be less than 1.').default(5),
  /** Next Departure */
  nextDeparture: z
    .array(z.string().min(1, 'A nameless departure bonus cannot be recorded.'))
    .default([]),
  /** Notes */
  notes: z.string().optional(),
  /** Once Per Lifetime */
  oncePerLifetime: z
    .array(z.string().min(1, 'A nameless lifetime bonus cannot be recorded.'))
    .default([]),
  /** Reroll Used */
  rerollUsed: z.boolean().default(false),
  /** Retired */
  retired: z.boolean().default(false),
  /** Secret Fighting Arts */
  secretFightingArts: z
    .array(
      z.string().min(1, 'A nameless secret fighting art cannot be recorded.')
    )
    .default([]),
  /** Skip Next Hunt */
  skipNextHunt: z.boolean().default(false),
  /** Speed */
  speed: z.number().default(0),
  /**
   * State
   *
   * Used by the Aenas (Wanderer) to track state while in the settlement.
   */
  state: z.enum(AenasState).optional(),
  /** Strength */
  strength: z.number().default(0),
  /** Survival (Named survivors start with 1 survival) */
  survival: z.number().min(0, 'Survival cannot be negative.').default(1),
  /** Understanding */
  understanding: z
    .number()
    .min(0, 'Understanding cannot be negative.')
    .max(9, 'Understanding cannot exceed 9.')
    .default(0),
  /** Survivor is a Wanderer */
  wanderer: z.boolean().default(false),
  /** Weapon Proficiency (Level) */
  weaponProficiency: z
    .number()
    .min(0, 'Weapon proficiency cannot be negative.')
    .max(8, 'Weapon proficiency cannot exceed 8.')
    .default(0),
  /** Weapon Proficiency (Type) */
  weaponProficiencyType: z.enum(WeaponType).optional(),

  /*
   * Hunt/Showdown Attributes
   *
   * These attributes are used for the Hunt and Showdown phases. They are
   * reset when the survivor returns to the settlement.
   */

  /** Arm: Armor */
  armArmor: z.number().min(0, 'Arm armor cannot be negative.').default(0),
  /** Arm: Light Damage Received */
  armLightDamage: z.boolean().default(false),
  /** Arm: Heavy Damage Received */
  armHeavyDamage: z.boolean().default(false),
  /** Body: Armor */
  bodyArmor: z.number().min(0, 'Body armor cannot be negative.').default(0),
  /** Body: Light Damage */
  bodyLightDamage: z.boolean().default(false),
  /** Body: Heavy Damage */
  bodyHeavyDamage: z.boolean().default(false),
  /** Brain: Light Damage Received */
  brainLightDamage: z.boolean().default(false),
  /** Head: Armor */
  headArmor: z.number().min(0, 'Head armor cannot be negative.').default(0),
  /** Head: Heavy Damage Received */
  headHeavyDamage: z.boolean().default(false),
  /** Leg: Armor */
  legArmor: z.number().min(0, 'Leg armor cannot be negative.').default(0),
  /** Leg: Light Damage Received */
  legLightDamage: z.boolean().default(false),
  /** Leg: Heavy Damage Received */
  legHeavyDamage: z.boolean().default(false),
  /** Waist: Armor */
  waistArmor: z.number().min(0, 'Waist armor cannot be negative.').default(0),
  /** Waist: Light Damage Received */
  waistLightDamage: z.boolean().default(false),
  /** Waist: Heavy Damage Received */
  waistHeavyDamage: z.boolean().default(false),

  /*
   * Severe Injuries
   */

  /** Arm: Broken */
  armBroken: z
    .number()
    .min(0, 'Broken arm count cannot be negative.')
    .max(2, 'Broken arm count cannot exceed 2.')
    .default(0),
  /** Arm: Contracture */
  armContracture: z
    .number()
    .min(0, 'Arm contracture count cannot be negative.')
    .max(5, 'Arm contracture count cannot exceed 5.')
    .default(0),
  /** Arm: Dismembered */
  armDismembered: z
    .number()
    .min(0, 'Dismembered arm count cannot be negative.')
    .max(2, 'Dismembered arm count cannot exceed 2.')
    .default(0),
  /** Arm: Ruptured Muscle */
  armRupturedMuscle: z.boolean().default(false),
  /** Body: Broken Rib */
  bodyBrokenRib: z
    .number()
    .min(0, 'Broken rib count cannot be negative.')
    .max(5, 'Broken rib count cannot exceed 5.')
    .default(0),
  /** Body: Destroyed Back */
  bodyDestroyedBack: z.boolean().default(false),
  /** Body: Gaping Chest Wound */
  bodyGapingChestWound: z
    .number()
    .min(0, 'Gaping chest wound count cannot be negative.')
    .max(5, 'Gaping chest wound count cannot exceed 5.')
    .default(0),
  /** Head: Blind */
  headBlind: z
    .number()
    .min(0, 'Blind count cannot be negative.')
    .max(2, 'Blind count cannot exceed 2.')
    .default(0),
  /** Head: Deaf */
  headDeaf: z.boolean().default(false),
  /** Head: Intracranial Hemorrhage */
  headIntracranialHemorrhage: z.boolean().default(false),
  /** Head: Shattered Jaw */
  headShatteredJaw: z.boolean().default(false),
  /** Leg: Broken */
  legBroken: z
    .number()
    .min(0, 'Broken leg count cannot be negative.')
    .max(2, 'Broken leg count cannot exceed 2.')
    .default(0),
  /** Leg: Dismembered */
  legDismembered: z
    .number()
    .min(0, 'Dismembered leg count cannot be negative.')
    .max(2, 'Dismembered leg count cannot exceed 2.')
    .default(0),
  /** Leg: Hamstrung */
  legHamstrung: z.boolean().default(false),
  /** Waist: Broken Hip */
  waistBrokenHip: z.boolean().default(false),
  /** Waist: Destroyed Genitals */
  waistDestroyedGenitals: z.boolean().default(false),
  /** Waist: Intestinal Prolapse */
  waistIntestinalProlapse: z.boolean().default(false),
  /** Waist: Warped Pelvis */
  waistWarpedPelvis: z
    .number()
    .min(0, 'Warped pelvis count cannot be negative.')
    .max(5, 'Warped pelvis count cannot exceed 5.')
    .default(0),

  /*
   * Arc Survivors
   */

  /** Can Endure */
  canEndure: z.boolean().default(false),
  /** Knowledge 1 */
  knowledge1: z.string().optional(),
  /** Knowledge 1: Observation Conditions */
  knowledge1ObservationConditions: z.string().optional(),
  /** Knowledge 1: Observation Ranks */
  knowledge1ObservationRank: z
    .number()
    .min(0, 'Knowledge observation rank count cannot be negative.')
    .max(9, 'Knowledge observation rank count cannot exceed 9.')
    .default(0),
  /** Knowledge 1: Rank Up Milestone */
  knowledge1RankUp: z
    .number()
    .min(0, 'Knowledge observation rank count cannot be negative.')
    .max(9, 'Knowledge observation rank count cannot exceed 9.')
    .optional(),
  /** Knowledge 1: Rules */
  knowledge1Rules: z.string().optional(),
  /** Knowledge 2 */
  knowledge2: z.string().optional(),
  /** Knowledge 2: Observation Conditions */
  knowledge2ObservationConditions: z.string().optional(),
  /** Knowledge 2: Observation Ranks */
  knowledge2ObservationRank: z
    .number()
    .min(0, 'Knowledge observation rank count cannot be negative.')
    .max(9, 'Knowledge observation rank count cannot exceed 9.')
    .default(0),
  /** Knowledge 2: Rank Up Milestone */
  knowledge2RankUp: z
    .number()
    .min(0, 'Knowledge observation rank count cannot be negative.')
    .max(9, 'Knowledge observation rank count cannot exceed 9.')
    .optional(),
  /** Knowledge 2: Rules */
  knowledge2Rules: z.string().optional(),
  /** Lumi */
  lumi: z.number().min(0, 'Lumi cannot be negative.').default(0),
  /** Neurosis */
  neurosis: z.string().optional(),
  /** Philosophy */
  philosophy: z.enum(Philosophy).nullable().optional(),
  /** Philosophy Rank */
  philosophyRank: z
    .number()
    .min(0, 'Philosophy rank cannot be negative.')
    .default(0),
  /** Systemic Pressure */
  systemicPressure: z
    .number()
    .min(0, 'Systemic pressure cannot be negative.')
    .default(0),
  /** Tenet Knowledge */
  tenetKnowledge: z.string().optional(),
  /** Tenet Knowledge: Observation Conditions */
  tenetKnowledgeObservationConditions: z.string().optional(),
  /** Tenet Knowledge: Observation Ranks */
  tenetKnowledgeObservationRank: z
    .number()
    .min(0, 'Knowledge observation rank count cannot be negative.')
    .max(9, 'Knowledge observation rank count cannot exceed 9.')
    .default(0),
  /** Tenet Knowledge: Rank Up Milestone */
  tenetKnowledgeRankUp: z.number().min(0).max(9).optional(),
  /** Tenet Knowledge: Rules */
  tenetKnowledgeRules: z.string().optional(),
  /** Torment */
  torment: z.number().min(0, 'Torment cannot be negative.').default(0),

  /*
   * People of the Stars Survivors
   */

  /** Absolute / Reaper */
  hasAbsoluteReaper: z.boolean().default(false),
  /** Absolute / Rust */
  hasAbsoluteRust: z.boolean().default(false),
  /** Absolute / Storm */
  hasAbsoluteStorm: z.boolean().default(false),
  /** Absolute / Witch */
  hasAbsoluteWitch: z.boolean().default(false),
  /** Gambler / Reaper */
  hasGamblerReaper: z.boolean().default(false),
  /** Gambler / Rust */
  hasGamblerRust: z.boolean().default(false),
  /** Gambler / Storm */
  hasGamblerStorm: z.boolean().default(false),
  /** Gambler / Witch */
  hasGamblerWitch: z.boolean().default(false),
  /** Goblin / Reaper */
  hasGoblinReaper: z.boolean().default(false),
  /** Goblin / Rust */
  hasGoblinRust: z.boolean().default(false),
  /** Goblin / Storm */
  hasGoblinStorm: z.boolean().default(false),
  /** Goblin / Witch*/
  hasGoblinWitch: z.boolean().default(false),
  /** Sculptor / Reaper */
  hasSculptorReaper: z.boolean().default(false),
  /** Sculptor / Rust */
  hasSculptorRust: z.boolean().default(false),
  /** Sculptor / Storm */
  hasSculptorStorm: z.boolean().default(false),
  /** Sculptor / Witch */
  hasSculptorWitch: z.boolean().default(false)
})

/**
 * Base Survivor
 *
 * This includes all attributes and properties of a survivor that are known
 * before the user tries to create one.
 */
export type BaseSurvivor = z.infer<typeof BaseSurvivorSchema>

/**
 * Survivor Schema
 *
 * All base survivor attributes, as well as those that are set when the user
 * chooses a settlement and creates a new survivor.
 */
export const SurvivorSchema = BaseSurvivorSchema.extend({
  /** Gender */
  gender: z.enum(Gender).default(Gender.FEMALE),
  /** Hunt XP Rank Up Milestones */
  huntXPRankUp: z.array(z.number()).default([]),
  /** Survivor ID */
  id: z.number().default(0),
  /** Name */
  name: z.string().optional(),
  /** Settlement ID */
  settlementId: z.number().default(0)
})

/**
 * Survivor
 *
 * All base survivor attributes, as well as those that are set when the user
 * chooses a settlement and creates a new survivor.
 */
export type Survivor = z.infer<typeof SurvivorSchema>
