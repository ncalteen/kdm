'use client'

import {
  CampaignType,
  ResourceCategory,
  ResourceType,
  SurvivorType
} from '@/lib/enums'
import { z } from 'zod'

/**
 * Timeline Entry Schema
 */
export const TimelineEntrySchema = z.object({
  completed: z.boolean(),
  entries: z.array(z.string())
})

/**
 * Quarry Entry Schema
 */
export const QuarryEntrySchema = z.object({
  name: z.string(),
  unlocked: z.boolean(),
  node: z.enum(['Node 1', 'Node 2', 'Node 3', 'Node 4']),
  ccPrologue: z.boolean(),
  ccLevel1: z.boolean(),
  ccLevel2: z.array(z.boolean()).min(2).max(2),
  ccLevel3: z.array(z.boolean()).min(3).max(3)
})

/**
 * Nemesis Entry Schema
 */
export const NemesisEntrySchema = z.object({
  name: z.string(),
  unlocked: z.boolean(),
  level1: z.boolean(),
  level2: z.boolean(),
  level3: z.boolean(),
  ccLevel1: z.boolean(),
  ccLevel2: z.boolean(),
  ccLevel3: z.boolean()
})

/**
 * Milestone Entry Schema
 */
export const MilestoneEntrySchema = z.object({
  name: z.string(),
  complete: z.boolean(),
  event: z.string()
})

/**
 * Location Entry Schema
 */
export const LocationEntrySchema = z.object({
  name: z.string(),
  unlocked: z.boolean()
})

/**
 * Principle Entry Schema
 */
export const PrincipleEntrySchema = z.object({
  name: z.string(),
  option1Name: z.string(),
  option1Selected: z.boolean(),
  option2Name: z.string(),
  option2Selected: z.boolean()
})

/**
 * Resource Entry Schema
 */
export const ResourceEntrySchema = z.object({
  name: z.string(),
  category: z.enum(
    Object.keys(ResourceCategory) as [ResourceCategory, ...ResourceCategory[]]
  ),
  types: z
    .array(
      z.enum(Object.keys(ResourceType) as [ResourceType, ...ResourceType[]])
    )
    .min(1),
  amount: z.number().min(0)
})

/**
 * Collective Cognition Reward Entry Schema
 */
export const CcRewardEntrySchema = z.object({
  name: z.string(),
  cc: z.number().min(0),
  unlocked: z.boolean()
})

/**
 * Knowledge Entry Schema
 */
export const KnowledgeEntrySchema = z.object({
  name: z.string(),
  philosophy: z.string().optional()
})

/**
 * Squires of the Citadel Suspicion Entry Schema
 */
export const SquireSuspicionEntrySchema = z.object({
  name: z.string(),
  level1: z.boolean(),
  level2: z.boolean(),
  level3: z.boolean(),
  level4: z.boolean()
})

/**
 * Settlement Schema
 *
 * All settlement attributes and properties across all settlement types.
 */
export const SettlementSchema = z.object({
  // Main
  id: z.number(),
  campaignType: z.enum(
    Object.keys(CampaignType) as [CampaignType, ...CampaignType[]]
  ),
  survivorType: z.enum(
    Object.keys(SurvivorType) as [SurvivorType, ...SurvivorType[]]
  ),
  survivalLimit: z.number().min(0),
  lostSettlements: z.number().min(0).optional(),
  name: z.string().describe('Settlement Name').min(1),

  // Timeline
  timeline: z.array(TimelineEntrySchema),

  // Quarries
  quarries: z.array(QuarryEntrySchema),

  // Nemesis
  nemesis: z.array(NemesisEntrySchema),

  // Campaign Milestones
  milestones: z.array(MilestoneEntrySchema),

  // Departing Survivor Bonuses
  departingBonuses: z.array(z.string()),

  // Other
  deathCount: z.number().min(0),
  principles: z.array(PrincipleEntrySchema),
  patterns: z.array(z.string()),
  seedPatterns: z.array(z.string()),
  innovations: z.array(z.string()),
  locations: z.array(LocationEntrySchema),
  resources: z.array(ResourceEntrySchema),
  gear: z.array(z.string()),
  notes: z.string().optional(),

  // Custom
  population: z.number().min(0),
  ccValue: z.number().min(0).optional(),

  /**
   * Arc Survivor Settlements
   */
  ccRewards: z.array(CcRewardEntrySchema).optional(),
  philosophies: z.array(z.string()).optional(),
  knowledges: z.array(KnowledgeEntrySchema).optional(),

  /**
   * Campaign Types:
   *
   * - People of the Lantern
   * - People of the Sun
   */
  lanternResearchLevel: z.number().min(0).optional(),
  monsterVolumes: z.array(z.string()).optional(),

  /**
   * Campaign Types:
   *
   * - Squires of the Citadel
   */
  suspicions: z.array(SquireSuspicionEntrySchema).optional()
})
