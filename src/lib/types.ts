import type {
  CampaignType,
  ResourceCategory,
  ResourceType,
  SurvivorType
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
 * Collective Cognition Quarry Victory
 */
export type CcQuarryVictory = {
  name: string
  prologue?: boolean
  level1: boolean
  level2: boolean[]
  level3: boolean[]
}

/**
 * Collective Cognition Nemesis Victory
 */
export type CcNemesisVictory = {
  name: string
  level1: boolean
  level2: boolean
  level3: boolean
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
  quarries: string[]
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
  ccQuarryVictories?: CcQuarryVictory[]
  ccNemesisVictoryEntrySchema?: CcNemesisVictory[]
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
  dead: boolean
  settlementId: number
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
