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
 * Timeline Entry Schema
 */
export const TimelineEntrySchema = z.object({
  /** Lantern Year Completion */
  completed: z.boolean(),
  /** Timeline Entries */
  entries: z.array(z.string())
})

/**
 * Quarry Entry Schema
 */
export const QuarryEntrySchema = z.object({
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
 * Nemesis Entry Schema
 */
export const NemesisEntrySchema = z.object({
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
 * Milestone Entry Schema
 */
export const MilestoneEntrySchema = z.object({
  /** Completed */
  complete: z.boolean(),
  /** Event (Triggered on Completion) */
  event: z.string(),
  /** Milestone Name */
  name: z.string()
})

/**
 * Location Entry Schema
 */
export const LocationEntrySchema = z.object({
  /** Location Name */
  name: z.string(),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Principle Entry Schema
 */
export const PrincipleEntrySchema = z.object({
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
 * Resource Entry Schema
 */
export const ResourceEntrySchema = z.object({
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
 * Collective Cognition Reward Entry Schema
 */
export const CcRewardEntrySchema = z.object({
  /** Collective Cognition Value */
  cc: z.number().min(0),
  /** Collective Cognition Reward Name */
  name: z.string(),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Knowledge Entry Schema
 */
export const KnowledgeEntrySchema = z.object({
  /** Knowledge Name */
  name: z.string(),
  /** Philosophy */
  philosophy: z.nativeEnum(Philosophy).optional()
})

/**
 * Squires of the Citadel Suspicion Entry Schema
 */
export const SquireSuspicionEntrySchema = z.object({
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
  locations: z.array(LocationEntrySchema).default([]),
  /** Lost Settlement Count */
  lostSettlements: z.number().min(0).default(0),
  /** Milestones */
  milestones: z.array(MilestoneEntrySchema).default([]),
  /** Nemeses */
  nemeses: z.array(NemesisEntrySchema).default([]),
  /** Notes */
  notes: z.string().optional(),
  /** Patterns */
  patterns: z.array(z.string()).default([]),
  /** Population */
  population: z.number().min(0).default(0),
  /** Principles */
  principles: z.array(PrincipleEntrySchema).default([]),
  /** Quarries */
  quarries: z.array(QuarryEntrySchema).default([]),
  /** Resources */
  resources: z.array(ResourceEntrySchema).default([]),
  /** Seed Patterns */
  seedPatterns: z.array(z.string()).default([]),
  /** Survival Limit */
  survivalLimit: z.number().min(1).default(1),
  /** Survivor Type */
  survivorType: z.nativeEnum(SurvivorType).default(SurvivorType.CORE),
  /** Settlment Timeline */
  timeline: z.array(TimelineEntrySchema).default([]),

  /*
   * Arc Survivor Settlements
   */

  /** Collective Cognition Rewards */
  ccRewards: z.array(CcRewardEntrySchema).optional(),
  /** Collective Cognition Value */
  ccValue: z.number().min(0).default(0),
  /** Settlement Knowledges */
  knowledges: z.array(KnowledgeEntrySchema).default([]),
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
  suspicions: z.array(SquireSuspicionEntrySchema).optional()
})

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
