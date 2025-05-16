'use client'

import {
  CampaignType,
  Philosophy,
  ResourceCategory,
  ResourceType,
  SurvivorType
} from '@/lib/enums'
import { z } from 'zod'

/**
 * Timeline Year Schema
 */
export const TimelineYearSchema = z.object({
  /** Lantern Year Completion */
  completed: z.boolean(),
  /** Timeline Entries */
  entries: z.array(z.string())
})

/**
 * Timeline Year
 */
export type TimelineYear = z.infer<typeof TimelineYearSchema>

/**
 * Quarry Schema
 */
export const QuarrySchema = z.object({
  /** Collective Cognition (Level 1) */
  ccLevel1: z.boolean(),
  /** Collective Cognition (Level 2) */
  ccLevel2: z.array(z.boolean()).min(2).max(2),
  /** Collective Cognition (Level 3) */
  ccLevel3: z.array(z.boolean()).min(3).max(3),
  /** Collective Cognition (Prologue) */
  ccPrologue: z.boolean(),
  /** Quarry Name */
  name: z.string(),
  /** Node Level */
  node: z.enum(['Node 1', 'Node 2', 'Node 3', 'Node 4']),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Quarry
 */
export type Quarry = z.infer<typeof QuarrySchema>

/**
 * Nemesis Schema
 */
export const NemesisSchema = z.object({
  /** Collective Cognition (Level 1) */
  ccLevel1: z.boolean(),
  /** Collective Cognition (Level 2) */
  ccLevel2: z.boolean(),
  /** Collective Cognition (Level 3) */
  ccLevel3: z.boolean(),
  /** Nemesis Name */
  name: z.string(),
  /** Completed (Level 1) */
  level1: z.boolean(),
  /** Completed (Level 2) */
  level2: z.boolean(),
  /** Completed (Level 3) */
  level3: z.boolean(),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Nemesis
 */
export type Nemesis = z.infer<typeof NemesisSchema>

/**
 * Milestone Schema
 */
export const MilestoneSchema = z.object({
  /** Completed */
  complete: z.boolean(),
  /** Event (Triggered on Completion) */
  event: z.string(),
  /** Milestone Name */
  name: z.string()
})

/**
 * Milestone
 */
export type Milestone = z.infer<typeof MilestoneSchema>

/**
 * Location Schema
 */
export const LocationSchema = z.object({
  /** Location Name */
  name: z.string(),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Location
 */
export type Location = z.infer<typeof LocationSchema>

/**
 * Principle Schema
 */
export const PrincipleSchema = z.object({
  /** Principle Name */
  name: z.string(),
  /** Option 1 Name */
  option1Name: z.string(),
  /** Option 1 Selected */
  option1Selected: z.boolean(),
  /** Option 2 Name */
  option2Name: z.string(),
  /** Option 2 Selected */
  option2Selected: z.boolean()
})

/**
 * Principle
 */
export type Principle = z.infer<typeof PrincipleSchema>

/**
 * Resource Schema
 */
export const ResourceSchema = z.object({
  /** Amount/Quantity */
  amount: z.number().min(0),
  /** Category (Basic, Monster, Strange, etc.) */
  category: z.nativeEnum(ResourceCategory),
  /** Resource Name */
  name: z.string(),
  /** Types (Bone, Hide, Organ, etc.) */
  types: z.array(z.nativeEnum(ResourceType)).min(1)
})

/**
 * Resource
 */
export type Resource = z.infer<typeof ResourceSchema>

/**
 * Collective Cognition Reward Schema
 */
export const CollectiveCognitionRewardSchema = z.object({
  /** Collective Cognition Value */
  cc: z.number().min(0),
  /** Collective Cognition Reward Name */
  name: z.string(),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Collective Cognition Reward
 */
export type CollectiveCognitionReward = z.infer<
  typeof CollectiveCognitionRewardSchema
>

/**
 * Knowledge Schema
 */
export const KnowledgeSchema = z.object({
  /** Knowledge Name */
  name: z.string(),
  /** Philosophy */
  philosophy: z.nativeEnum(Philosophy).optional()
})

/**
 * Knowledge
 */
export type Knowledge = z.infer<typeof KnowledgeSchema>

/**
 * Squires of the Citadel Suspicion Schema
 */
export const SquireSuspicionSchema = z.object({
  /** Suspicion Level 1 */
  level1: z.boolean(),
  /** Suspicion Level 2 */
  level2: z.boolean(),
  /** Suspicion Level 3 */
  level3: z.boolean(),
  /** Suspicion Level 4 */
  level4: z.boolean(),
  /** Survivor Name */
  name: z.string()
})

/**
 * Squires of the Citadel Suspicion
 */
export type SquireSuspicion = z.infer<typeof SquireSuspicionSchema>

/**
 * Base Settlement Schema
 *
 * This includes all attributes and properties of a settlement that are known
 * before the user tries to create one.
 */
export const BaseSettlementSchema = z.object({
  /** Campaign Type */
  campaignType: z
    .nativeEnum(CampaignType)
    .default(CampaignType.PEOPLE_OF_THE_LANTERN),
  /** Death Count */
  deathCount: z.number().min(0).default(0),
  /** Departing Survivor Bonuses */
  departingBonuses: z.array(z.string()).default([]),
  /** Gear */
  gear: z.array(z.string()).default([]),
  /** Innovations */
  innovations: z.array(z.string()).default([]),
  /** Locations */
  locations: z.array(LocationSchema).default([]),
  /** Lost Settlement Count */
  lostSettlements: z.number().min(0).default(0),
  /** Milestones */
  milestones: z.array(MilestoneSchema).default([]),
  /** Nemeses */
  nemeses: z.array(NemesisSchema).default([]),
  /** Notes */
  notes: z.string().optional(),
  /** Patterns */
  patterns: z.array(z.string()).default([]),
  /** Population */
  population: z.number().min(0).default(0),
  /** Principles */
  principles: z.array(PrincipleSchema).default([]),
  /** Quarries */
  quarries: z.array(QuarrySchema).default([]),
  /** Resources */
  resources: z.array(ResourceSchema).default([]),
  /** Seed Patterns */
  seedPatterns: z.array(z.string()).default([]),
  /** Survival Limit */
  survivalLimit: z.number().min(1).default(1),
  /** Survivor Type */
  survivorType: z.nativeEnum(SurvivorType).default(SurvivorType.CORE),
  /** Settlment Timeline */
  timeline: z.array(TimelineYearSchema).default([]),

  /*
   * Arc Survivor Settlements
   */

  /** Collective Cognition Rewards */
  ccRewards: z.array(CollectiveCognitionRewardSchema).optional(),
  /** Collective Cognition Value */
  ccValue: z.number().min(0).default(0),
  /** Settlement Knowledges */
  knowledges: z.array(KnowledgeSchema).default([]),
  /** Settlement Philosophies */
  philosophies: z.array(z.nativeEnum(Philosophy)).default([]),

  /*
   * People of the Lantern/Sun Campaigns
   */

  /** Lantern Research Level */
  lanternResearchLevel: z.number().min(0).default(0),
  /** Monster Volumes */
  monsterVolumes: z.array(z.string()).default([]),

  /*
   * Squires of the Citadel Campaigns
   */

  /** Suspicion Levels */
  suspicions: z.array(SquireSuspicionSchema).optional()
})

/**
 * Base Settlement
 *
 * This includes all attributes and properties of a settlement that are known
 * before the user tries to create one.
 */
export type BaseSettlement = z.infer<typeof BaseSettlementSchema>

/**
 * Settlement Schema
 *
 * All base settlement attributes, as well as those that are set when the user
 * chooses a campaign type and creates a new settlement.
 */
export const SettlementSchema = BaseSettlementSchema.extend({
  /** Settlement ID */
  id: z.number(),
  /** Settlement Name */
  name: z
    .string()
    .describe('Settlement Name')
    .min(1, 'Settlement name is required')
})

/**
 * Settlement
 *
 * All base settlement attributes, as well as those that are set when the user
 * chooses a campaign type and creates a new settlement.
 */
export type Settlement = z.infer<typeof SettlementSchema>
