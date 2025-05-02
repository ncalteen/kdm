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
  completed: boolean
  entries: string[]
}

/**
 * Settlement Nemesis
 */
export type Nemesis = {
  name: string
  level1: boolean
  level2: boolean
  level3: boolean
  unlocked: boolean
  ccLevel1: boolean
  ccLevel2: boolean
  ccLevel3: boolean
}

/**
 * Settlement Milestone
 */
export type Milestone = {
  name: string
  complete: boolean
  event: string
}

/**
 * Settlement Location
 */
export type Location = {
  name: string
  unlocked: boolean
}

/**
 * Settlement Principle
 */
export type Principle = {
  name: string
  option1Name: string
  option1Selected: boolean
  option2Name: string
  option2Selected: boolean
}

/**
 * Settlement Resource
 */
export type Resource = {
  name: string
  category: ResourceCategory
  types: ResourceType[]
  amount: number
}

/**
 * Quarry
 */
export type Quarry = {
  name: string
  node: 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
  unlocked: boolean
  ccPrologue: boolean
  ccLevel1: boolean
  ccLevel2: boolean[]
  ccLevel3: boolean[]
}

/**
 * Collective Cognition Reward
 */
export type CcReward = {
  name: string
  cc: number
  unlocked: boolean
}

/**
 * Squires of the Citadel Suspicion
 */
export type SquireSuspicion = {
  name: string
  level1: boolean
  level2: boolean
  level3: boolean
  level4: boolean
}

export type Settlement = {
  id: number
  campaignType: CampaignType
  survivorType: SurvivorType
  survivalLimit: number
  lostSettlements: number
  name: string
  timeline: TimelineEvent[]
  quarries: Quarry[]
  nemesis: Nemesis[]
  milestones: Milestone[]
  departingBonuses: string[]
  deathCount: number
  principles: Principle[]
  patterns: string[]
  innovations: string[]
  locations: Location[]
  resources: Resource[]
  gear: string[]
  notes?: string

  /**
   * Arc Survivor Settlements
   */
  ccRewards?: CcReward[]
  philosophies?: string[]
  knowledges?: string[]

  /**
   * Campaign Types:
   *
   * - People of the Lantern
   * - People of the Sun
   */
  lanternResearchLevel?: number
  monsterVolumes?: string[]

  /**
   * Campaign Types:
   *
   * - Squires of the Citadel
   */
  suspicions?: SquireSuspicion[]
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

/**
 * Campaign
 *
 * This is the main campaign object that is read from localStorage.
 */
export type Campaign = {
  settlements: Settlement[]
  survivors: Survivor[]
}

/**
 * Campaign Data
 *
 * Data used to generate a new settlement based on the campaign type.
 */
export type CampaignData = {
  ccRewards: CcReward[]
  innovations: string[]
  locations: Location[]
  milestones: Milestone[]
  nemesis: Nemesis[]
  principles: Principle[]
  quarries: Quarry[]
  timeline: TimelineEvent[]
}
