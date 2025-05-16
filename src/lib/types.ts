'use client'

import type {
  CampaignType,
  Gender,
  Philosophy,
  ResourceCategory,
  ResourceType,
  SurvivorType,
  WeaponType
} from './enums.js'

/**
 * Settlement Timeline Event
 */
export type TimelineEvent = {
  /** Lantern Year Completion */
  completed: boolean
  /** Timeline Entries */
  entries: string[]
}

/**
 * Settlement Nemesis
 */
export type Nemesis = {
  /** Collective Cognition (Level 1) */
  ccLevel1: boolean
  /** Collective Cognition (Level 2) */
  ccLevel2: boolean
  /** Collective Cognition (Level 3) */
  ccLevel3: boolean
  /** Nemesis Name */
  name: string
  /** Completed (Level 1) */
  level1: boolean
  /** Completed (Level 2) */
  level2: boolean
  /** Completed (Level 3) */
  level3: boolean
  /** Unlocked */
  unlocked: boolean
}

/**
 * Settlement Milestone
 */
export type Milestone = {
  /** Completed */
  complete: boolean
  /** Event (Triggered on Completion) */
  event: string
  /** Milestone Name */
  name: string
}

/**
 * Settlement Location
 */
export type Location = {
  /** Location Name */
  name: string
  /** Unlocked */
  unlocked: boolean
}

/**
 * Settlement Knowledge
 */
export type Knowledge = {
  /** Knowledge Name */
  name: string
  /** Philosophy */
  philosophy?: Philosophy
}

/**
 * Settlement Principle
 */
export type Principle = {
  /** Principle Name */
  name: string
  /** Option 1 Name */
  option1Name: string
  /** Option 1 Selected */
  option1Selected: boolean
  /** Option 2 Name */
  option2Name: string
  /** Option 2 Selected */
  option2Selected: boolean
}

/**
 * Settlement Resource
 */
export type Resource = {
  /** Amount/Quantity */
  amount: number
  /** Category (Basic, Monster, Strange, etc.) */
  category: ResourceCategory
  /** Resource Name */
  name: string
  /** Types (Bone, Hide, Organ, etc.) */
  types: ResourceType[]
}

/**
 * Quarry
 */
export type Quarry = {
  /** Collective Cognition (Level 1) */
  ccLevel1: boolean
  /** Collective Cognition (Level 2) */
  ccLevel2: boolean[]
  /** Collective Cognition (Level 3) */
  ccLevel3: boolean[]
  /** Collective Cognition (Prologue) */
  ccPrologue: boolean
  /** Quarry Name */
  name: string
  /** Node Level */
  node: 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
  /** Unlocked */
  unlocked: boolean
}

/**
 * Collective Cognition Reward
 */
export type CcReward = {
  /** Collective Cognition Value */
  cc: number
  /** Collective Cognition Reward Name */
  name: string
  /** Unlocked */
  unlocked: boolean
}

/**
 * Squires of the Citadel Suspicion
 */
export type SquireSuspicion = {
  /** Suspicion Level 1 */
  level1: boolean
  /** Suspicion Level 2 */
  level2: boolean
  /** Suspicion Level 3 */
  level3: boolean
  /** Suspicion Level 4 */
  level4: boolean
  /** Survivor Name */
  name: string
}

/**
 * Settlement
 */
export type Settlement = {
  /** Campaign Type */
  campaignType: CampaignType
  /** Death Count */
  deathCount: number
  /** Departing Survivor Bonuses */
  departingBonuses: string[]
  /** Gear */
  gear: string[]
  /** Settlement ID */
  id: number
  /** Innovations */
  innovations: string[]
  /** Locations */
  locations: Location[]
  /** Lost Settlement Count */
  lostSettlements: number
  /** Milestones */
  milestones: Milestone[]
  /** Settlement Name */
  name: string
  /** Nemeses */
  nemeses: Nemesis[]
  /** Notes */
  notes?: string
  /** Patterns */
  patterns: string[]
  /** Population */
  population: number
  /** Principles */
  principles: Principle[]
  /** Quarries */
  quarries: Quarry[]
  /** Resources */
  resources: Resource[]
  /** Seed Patterns */
  seedPatterns: string[]
  /** Survival Limit */
  survivalLimit: number
  /** Survivor Type */
  survivorType: SurvivorType
  /** Settlment Timeline */
  timeline: TimelineEvent[]

  /*
   * Arc Survivor Settlements
   */

  /** Collective Cognition Rewards */
  ccRewards?: CcReward[]
  /** Collective Cognition Value */
  ccValue?: number
  /** Settlement Knowledges */
  knowledges?: Knowledge[]
  /** Settlement Philosophies */
  philosophies?: string[]

  /*
   * People of the Lantern/Sun Campaigns
   */

  /** Lantern Research Level */
  lanternResearchLevel?: number
  /** Monster Volumes */
  monsterVolumes?: string[]

  /*
   * Squires of the Citadel Campaigns
   */

  /** Suspicion Levels */
  suspicions?: SquireSuspicion[]
}

/**
 * Campaign
 *
 * This is the main campaign object that is read from localStorage.
 */
export type Campaign = {
  /** Settlements */
  settlements: Settlement[]
  /** Survivors */
  survivors: Survivor[]
}

/**
 * Campaign Data
 *
 * Data used to generate a new settlement based on the campaign type.
 */
export type CampaignData = {
  /** Collective Cognition Rewards */
  ccRewards: CcReward[]
  /** Innovations */
  innovations: string[]
  /** Locations */
  locations: Location[]
  /** Milestones */
  milestones: Milestone[]
  /** Nemeses */
  nemeses: Nemesis[]
  /** Principles */
  principles: Principle[]
  /** Quarries */
  quarries: Quarry[]
  /** Settlement Timeline */
  timeline: TimelineEvent[]
}

/**
 * Survivor
 */
export type Survivor = {
  /** Abilities and Impairments */
  abilitiesAndImpairments: string[]
  /** Accuracy */
  accuracy: number
  /** Can Dash */
  canDash: boolean
  /** Can Dodge */
  canDodge: boolean
  /** Can Fist Pump */
  canFistPump: boolean
  /** Can Encourage */
  canEncourage: boolean
  /** Can Spend Survival */
  canSpendSurvival: boolean
  /** Can Surge */
  canSurge: boolean
  /** Can Use Fighting Arts or Knowledges */
  canUseFightingArtsOrKnowledges: boolean
  /** Courage */
  courage: number
  /** Survivor is Dead */
  dead: boolean
  /** Disorders */
  disorders: string[]
  /** Evasion */
  evasion: number
  /** Fighting Arts */
  fightingArts: string[]
  /** Gender */
  gender: Gender
  /** Has Analyze */
  hasAnalyze: boolean
  /** Has Explore */
  hasExplore: boolean
  /** Has Matchmaker */
  hasMatchmaker: boolean
  /** Has Prepared */
  hasPrepared: boolean
  /** Has Stalwart */
  hasStalwart: boolean
  /** Has Tinker */
  hasTinker: boolean
  /** Hunt XP */
  huntXP: number
  /** Hunt XP Rank Up Milestones */
  huntXPRankUp: number[]
  /** Survivor ID */
  id: number
  /** Insanity */
  insanity: number
  /** Luck */
  luck: number
  /** Movement */
  movement: number
  /** Name */
  name: string
  /** Next Departure */
  nextDeparture?: string
  /** Notes */
  notes?: string
  /** Once Per Lifetime */
  oncePerLifetime: string[]
  /** Reroll Used */
  rerollUsed: boolean
  /** Retired */
  retired: boolean
  /** Secret Fighting Arts */
  secretFightingArts: string[]
  /** Settlement ID */
  settlementId: number
  /** Skip Next Hunt */
  skipNextHunt: boolean
  /** Speed */
  speed: number
  /** Strength */
  strength: number
  /** Survival (Named survivors start with 1 survival) */
  survival: number
  /** Understanding */
  understanding: number
  /** Weapon Proficiency (Level) */
  weaponProficiency: number
  /** Weapon Proficiency (Type) */
  weaponProficiencyType?: WeaponType

  /*
   * Hunt/Showdown Attributes
   *
   * These attributes are used for the Hunt and Showdown phases. They are
   * reset when the survivor returns to the settlement.
   */

  /** Arm: Armor */
  armArmor: number
  /** Arm: Light Damage Received */
  armLightDamage: boolean
  /** Arm: Heavy Damage Received */
  armHeavyDamage: boolean
  /** Body: Armor */
  bodyArmor: number
  /** Body: Light Damage Received */
  bodyLightDamage: boolean
  /** Body: Heavy Damage Received */
  bodyHeavyDamage: boolean
  /** Brain: Light Damage Received */
  brainLightDamage: boolean
  /** Head: Armor */
  headArmor: number
  /** Head: Heavy Damage Received */
  headHeavyDamage: boolean
  /** Leg: Armor */
  legArmor: number
  /** Leg: Light Damage Received */
  legLightDamage: boolean
  /** Leg: Heavy Damage Received */
  legHeavyDamage: boolean
  /** Waist: Armor */
  waistArmor: number
  /** Waist: Light Damage Received */
  waistLightDamage: boolean
  /** Waist: Heavy Damage Received */
  waistHeavyDamage: boolean

  /*
   * Severe Injuries
   */

  /** Arm: Broken */
  armBroken: number
  /** Arm: Contracture */
  armContracture: number
  /** Arm: Dismembered */
  armDismembered: number
  /** Arm: Ruptured Muscle */
  armRupturedMuscle: boolean
  /** Body: Broken Rib */
  bodyBrokenRib: number
  /** Body: Destroyed Back */
  bodyDestroyedBack: boolean
  /** Body: Gaping Chest Wound */
  bodyGapingChestWound: number
  /** Head: Blind */
  headBlind: number
  /** Head: Deaf */
  headDeaf: boolean
  /** Head: Intracranial Hemorrhage */
  headIntracranialHemorrhage: boolean
  /** Head: Shattered Jaw */
  headShatteredJaw: boolean
  /** Leg: Broken */
  legBroken: number
  /** Leg: Dismembered */
  legDismembered: number
  /** Leg: Hamstrung */
  legHamstrung: boolean
  /** Waist: Broken Hip */
  waistBrokenHip: boolean
  /** Waist: Destroyed Genitals */
  waistDestroyedGenitals: boolean
  /** Waist: Intestinal Prolapse */
  waistIntestinalProlapse: boolean
  /** Waist: Warped Pelvis */
  waistWarpedPelvis: number

  /*
   * Arc Survivors
   */

  /** Can Endure */
  canEndure: boolean
  /** Knowledge 1 */
  knowledge1?: string
  /** Knowledge 1: Observation Conditions */
  knowledge1ObservationConditions?: string
  /** Knowledge 1: Observation Ranks */
  knowledge1ObservationRank: number
  /** Knowledge 1: Rank Up Milestone */
  knowledge1RankUp?: number
  /** Knowledge 1: Rules */
  knowledge1Rules?: string
  /** Knowledge 2 */
  knowledge2?: string
  /** Knowledge 2: Observation Conditions */
  knowledge2ObservationConditions?: string
  /** Knowledge 2: Observation Ranks */
  knowledge2ObservationRank: number
  /** Knowledge 2: Rank Up Milestone */
  knowledge2RankUp?: number
  /** Knowledge 2: Rules */
  knowledge2Rules?: string
  /** Lumi */
  lumi: number
  /** Neurosis */
  neurosis?: string
  /** Philosophy */
  philosophy?: Philosophy
  /** Philosophy Rank */
  philosophyRank: number
  /** Systemic Pressure */
  systemicPressure: number
  /** Tenet Knowledge */
  tenetKnowledge?: string
  /** Tenet Knowledge: Observation Conditions */
  tenetKnowledgeObservationConditions?: string
  /** Tenet Knowledge: Observation Ranks */
  tenetKnowledgeObservationRank: number
  /** Tenet Knowledge: Rank Up Milestone */
  tenetKnowledgeRankUp?: number
  /** Tenet Knowledge: Rules */
  tenetKnowledgeRules?: string
  /** Torment */
  torment: number

  /*
   * People of the Stars Survivors
   */

  /** Absolute / Reaper */
  hasAbsoluteReaper: boolean
  /** Absolute / Rust */
  hasAbsoluteRust: boolean
  /** Absolute / Storm */
  hasAbsoluteStorm: boolean
  /** Absolute / Witch */
  hasAbsoluteWitch: boolean
  /** Gambler / Reaper */
  hasGamblerReaper: boolean
  /** Gambler / Rust */
  hasGamblerRust: boolean
  /** Gambler / Storm */
  hasGamblerStorm: boolean
  /** Gambler / Witch */
  hasGamblerWitch: boolean
  /** Goblin / Reaper */
  hasGoblinReaper: boolean
  /** Goblin / Rust */
  hasGoblinRust: boolean
  /** Goblin / Storm */
  hasGoblinStorm: boolean
  /** Goblin / Witch */
  hasGoblinWitch: boolean
  /** Sculptor / Reaper */
  hasSculptorReaper: boolean
  /** Sculptor / Rust */
  hasSculptorRust: boolean
  /** Sculptor / Storm */
  hasSculptorStorm: boolean
  /** Sculptor / Witch */
  hasSculptorWitch: boolean
}
