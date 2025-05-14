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
  philosophy: Philosophy
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
  id: number
  settlementId: number
  name: string
  gender: Gender
  huntXP: number
  huntXPRankUp: number[]
  survival: number
  canSpendSurvival: boolean
  canDodge: boolean
  canEncourage: boolean
  canSurge: boolean
  canDash: boolean
  canFistPump: boolean
  canEndure: boolean // Arc Survivors
  systemicPressure: number // Arc Survivors
  movement: number
  accuracy: number
  strength: number
  evasion: number
  luck: number
  speed: number
  lumi: number // Arc Survivors
  insanity: number
  brainLightDamage: boolean
  torment: number // Arc Survivors
  headArmor: number
  headIntracranialHemorrhage: boolean
  headDeaf: boolean
  headBlindLeft: boolean
  headBlindRight: boolean
  headShatteredJaw: boolean
  headHeavyDamage: boolean
  armArmor: number
  armDismemberedLeft: boolean
  armDismemberedRight: boolean
  armRupturedMuscle: boolean
  armContracture: number
  armBrokenLeft: boolean
  armBrokenRight: boolean
  armLightDamage: boolean
  armHeavyDamage: boolean
  bodyArmor: number
  bodyGapingChestWound: number
  bodyDestroyedBack: boolean
  bodyBrokenRib: number
  bodyLightDamage: boolean
  bodyHeavyDamage: boolean
  waistArmor: number
  waistIntestinalProlapse: boolean
  waistWarpedPelvis: number
  waistDestroyedGenitals: boolean
  waistBrokenHip: boolean
  waistLightDamage: boolean
  waistHeavyDamage: boolean
  legArmor: number
  legDismemberedLeft: boolean
  legDismemberedRight: boolean
  legHamstrung: boolean
  legBrokenLeft: boolean
  legBrokenRight: boolean
  legLightDamage: boolean
  legHeavyDamage: boolean
  weaponProficiencyType?: WeaponType
  weaponProficiency: number
  courage: number
  hasStalwart: boolean
  hasPrepared: boolean
  hasMatchmaker: boolean
  understanding: number
  hasAnalyze: boolean
  hasExplore: boolean
  hasTinker: boolean
  nextDeparture?: string
  canUseFightingArtsOrKnowledges: boolean
  fightingArts: string[]
  secretFightingArts: string[]
  disorders: string[]
  abilitiesAndImpairments: string[]
  skipNextHunt: boolean
  oncePerLifetime: string[]
  rerollUsed: boolean
  dead: boolean
  retired: boolean
  notes?: string

  /**
   * Arc Survivors
   */

  philosophy?: Philosophy
  neurosis?: string
  tenetKnowledge?: string
  tenetKnowledgeObservationRank?: number
  tenetKnowledgeRules?: string
  tenetKnowledgeObservationConditions?: string
  tenetKnowledgeRankUp?: number
  knowledge1?: string
  knowledge1ObservationRank?: number
  knowledge1Rules?: string
  knowledge1ObservationConditions?: string
  knowledge1RankUp?: number
  knowledge2?: string
  knowledge2ObservationRank?: number
  knowledge2Rules?: string
  knowledge2ObservationConditions?: string
  knowledge2RankUp?: number

  /**
   * People of the Stars Survivors Only
   */

  hasGamblerWitch: boolean
  hasGamblerRust: boolean
  hasGamblerStorm: boolean
  hasGamblerReaper: boolean
  hasAbsoluteWitch: boolean
  hasAbsoluteRust: boolean
  hasAbsoluteStorm: boolean
  hasAbsoluteReaper: boolean
  hasSculptorWitch: boolean
  hasSculptorRust: boolean
  hasSculptorStorm: boolean
  hasSculptorReaper: boolean
  hasGoblinWitch: boolean
  hasGoblinRust: boolean
  hasGoblinStorm: boolean
  hasGoblinReaper: boolean
}
