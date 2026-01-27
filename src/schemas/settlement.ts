'use client'

import { CampaignType, Philosophy, SurvivorType } from '@/lib/enums'
import { SettlementCollectiveCognitionRewardSchema } from '@/schemas/settlement-cc-reward'
import { SettlementKnowledgeSchema } from '@/schemas/settlement-knowledge'
import { SettlementLocationSchema } from '@/schemas/settlement-location'
import { SettlementMilestoneSchema } from '@/schemas/settlement-milestone'
import { SettlementNemesisSchema } from '@/schemas/settlement-nemesis'
import { SettlementPrincipleSchema } from '@/schemas/settlement-principle'
import { SettlementQuarrySchema } from '@/schemas/settlement-quarry'
import { SettlementResourceSchema } from '@/schemas/settlement-resource'
import { SettlementTimelineYearSchema } from '@/schemas/settlement-timeline-year'
import { SquireSuspicionSchema } from '@/schemas/squire-suspicion'
import { WandererSchema } from '@/schemas/wanderer'
import { z } from 'zod'

/**
 * Base Settlement Schema
 *
 * This includes all attributes and properties of a settlement that are known
 * before the user tries to create one.
 */
export const BaseSettlementSchema = z.object({
  /** Arriving Survivor Bonuses */
  arrivalBonuses: z
    .array(z.string().min(1, 'A nameless arrival bonus cannot be recorded.'))
    .default([]),
  /** Campaign Type */
  campaignType: z
    .enum(CampaignType)
    .default(CampaignType.PEOPLE_OF_THE_LANTERN),
  /** Death Count */
  deathCount: z.number().min(0).default(0),
  /** Departing Survivor Bonuses */
  departingBonuses: z
    .array(z.string().min(1, 'A nameless departing bonus cannot be recorded.'))
    .default([]),
  /** Gear */
  gear: z
    .array(z.string().min(1, 'A nameless gear item cannot be recorded.'))
    .default([]),
  /** Innovations */
  innovations: z
    .array(z.string().min(1, 'A nameless innovation cannot be recorded.'))
    .default([]),
  /** Locations */
  locations: z.array(SettlementLocationSchema).default([]),
  /** Lost Settlement Count */
  lostSettlements: z.number().min(0).default(0),
  /** Milestones */
  milestones: z.array(SettlementMilestoneSchema).default([]),
  /** Nemeses */
  nemeses: z.array(SettlementNemesisSchema).default([]),
  /** Notes */
  notes: z.string().optional(),
  /** Patterns */
  patterns: z
    .array(z.string().min(1, 'A nameless pattern cannot be recorded.'))
    .default([]),
  /** Population */
  population: z.number().min(0).default(0),
  /** Principles */
  principles: z.array(SettlementPrincipleSchema).default([]),
  /** Quarries */
  quarries: z.array(SettlementQuarrySchema).default([]),
  /** Resources */
  resources: z.array(SettlementResourceSchema).default([]),
  /** Seed Patterns */
  seedPatterns: z
    .array(z.string().min(1, 'A nameless seed pattern cannot be recorded.'))
    .default([]),
  /** Survival Limit */
  survivalLimit: z.number().min(1).default(1),
  /** Survivor Type */
  survivorType: z.enum(SurvivorType).default(SurvivorType.CORE),
  /** Settlment Timeline */
  timeline: z.array(SettlementTimelineYearSchema).default([]),
  /** Uses Scouts (determines if scouts are required for hunts/showdowns) */
  usesScouts: z.boolean().default(false),
  /** Wanderers */
  wanderers: z.array(WandererSchema).default([]),

  /*
   * Arc Survivor Settlements
   */

  /** Collective Cognition Rewards */
  ccRewards: z.array(SettlementCollectiveCognitionRewardSchema).optional(),
  /** Collective Cognition Value */
  ccValue: z.number().min(0).default(0).optional(),
  /** Settlement Knowledges */
  knowledges: z.array(SettlementKnowledgeSchema).default([]).optional(),
  /** Settlement Philosophies */
  philosophies: z.array(z.enum(Philosophy)).default([]).optional(),

  /*
   * People of the Lantern/Sun Campaigns
   */

  /** Lantern Research Level */
  lanternResearchLevel: z.number().min(0).default(0).optional(),
  /** Monster Volumes */
  monsterVolumes: z
    .array(z.string().min(1, 'A nameless monster volume cannot be recorded.'))
    .default([])
    .optional(),

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
    .min(1, 'A nameless settlement cannot be recorded.')
})

/**
 * Settlement
 *
 * All base settlement attributes, as well as those that are set when the user
 * chooses a campaign type and creates a new settlement.
 */
export type Settlement = z.infer<typeof SettlementSchema>
