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
  entries: z.array(z.string().min(1, 'A nameless event cannot be recorded.'))
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
  name: z.string().min(1, 'A nameless quarry cannot be recorded.'),
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
  name: z.string().min(1, 'A nameless nemesis cannot be recorded.'),
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
  event: z.string().min(1, 'A nameless event cannot be recorded.'),
  /** Milestone Name */
  name: z.string().min(1, 'A nameless milestone cannot be recorded.')
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
  name: z.string().min(1, 'A nameless location cannot be recorded.'),
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
  name: z.string().min(1, 'A nameless principle cannot be recorded.'),
  /** Option 1 Name */
  option1Name: z
    .string()
    .min(1, 'A nameless principle option cannot be recorded.'),
  /** Option 1 Selected */
  option1Selected: z.boolean(),
  /** Option 2 Name */
  option2Name: z
    .string()
    .min(1, 'A nameless principle option cannot be recorded.'),
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
  name: z.string().min(1, 'A nameless resource cannot be recorded.'),
  /** Types (Bone, Hide, Organ, etc.) */
  types: z
    .array(z.nativeEnum(ResourceType))
    .min(1, 'A resource must have at least one type.')
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
  name: z.string().min(1, 'A nameless reward cannot be recorded.'),
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
  name: z.string().min(1, 'A nameless knowledge cannot be recorded.'),
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
  name: z.string().min(1, 'A nameless survivor cannot be recorded.')
})

/**
 * Squires of the Citadel Suspicion
 */
export type SquireSuspicion = z.infer<typeof SquireSuspicionSchema>

/**
 * Hunt Schema
 */
export const HuntSchema = z.object({
  /** Quarry Name */
  quarryName: z.string().min(1, 'The quarry name cannot be empty for a hunt.'),
  /** Quarry Level */
  quarryLevel: z.enum(['1', '2', '3', '4']),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.'),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Survivor Position on Hunt Board */
  survivorPosition: z.number().min(0).max(12).default(0),
  /** Quarry Position on Hunt Board */
  quarryPosition: z.number().min(0).max(12).default(6),
  /** Hunt Ended in Monster Ambushing Survivors */
  ambush: z.boolean().default(false)
})

/**
 * Hunt
 */
export type Hunt = z.infer<typeof HuntSchema>

/**
 * Showdown Schema
 */
export const ShowdownSchema = z.object({
  /** Monster Name (Quarry or Nemesis) */
  monsterName: z
    .string()
    .min(1, 'The monster name cannot be empty for a showdown.'),
  /** Monster Level (Quarry or Nemesis) */
  monsterLevel: z.enum(['1', '2', '3', '4']),
  /** Type of showdown */
  type: z.enum(['quarry', 'nemesis']),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the showdown.')
    .max(4, 'No more than four survivors can face a monster in showdown.'),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional()
})

/**
 * Showdown
 */
export type Showdown = z.infer<typeof ShowdownSchema>

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
    .nativeEnum(CampaignType)
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
  patterns: z
    .array(z.string().min(1, 'A nameless pattern cannot be recorded.'))
    .default([]),
  /** Population */
  population: z.number().min(0).default(0),
  /** Principles */
  principles: z.array(PrincipleSchema).default([]),
  /** Quarries */
  quarries: z.array(QuarrySchema).default([]),
  /** Resources */
  resources: z.array(ResourceSchema).default([]),
  /** Seed Patterns */
  seedPatterns: z
    .array(z.string().min(1, 'A nameless seed pattern cannot be recorded.'))
    .default([]),
  /** Survival Limit */
  survivalLimit: z.number().min(1).default(1),
  /** Survivor Type */
  survivorType: z.nativeEnum(SurvivorType).default(SurvivorType.CORE),
  /** Uses Scouts (determines if scouts are required for hunts/showdowns) */
  usesScouts: z.boolean().default(false),
  /** Settlment Timeline */
  timeline: z.array(TimelineYearSchema).default([]),

  /*
   * Hunt and Showdown Tracking
   */

  /** Hunt (mutually exclusive with showdown) */
  hunt: HuntSchema.optional(),
  /** Showdown (mutually exclusive with hunt) */
  showdown: ShowdownSchema.optional(),

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
  monsterVolumes: z
    .array(z.string().min(1, 'A nameless monster volume cannot be recorded.'))
    .default([]),

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
  .refine((data) => !(data.hunt && data.showdown), {
    message: 'A settlement cannot have both an active hunt and showdown.',
    path: ['hunt', 'showdown']
  })
  .refine(
    (data) => {
      // Skip validation if scouts are not used by this settlement
      if (!data.usesScouts) return true

      // Check if the hunt requires scout selection
      if (data.hunt && !data.hunt.scout) return false

      // Check if the showdown requires scout selection
      if (data.showdown && !data.showdown.scout) return false

      return true
    },
    {
      message:
        "When a settlement uses scouts, a scout must be selected for the hunt or showdown. The scout's keen eyes are essential for your survival.",
      path: ['hunt.scout', 'showdown.scout']
    }
  )
  .refine(
    (data) => {
      // Skip validation if settlement does not use scouts
      if (!data.usesScouts) return true

      // Confirm the selected scout is not also a selected survivor
      const scout = data.hunt?.scout || data.showdown?.scout

      // No scout selected, skip validation
      if (!scout) return true

      // Check if the selected scout is in the survivor list
      const survivors = data.hunt?.survivors || data.showdown?.survivors

      // No survivors selected, skip validation
      if (!survivors || survivors.length === 0) return true

      // Validate that the selected scout is not in the survivors list
      return !survivors.includes(scout)
    },
    {
      message:
        'The selected scout cannot also be one of the selected survivors for the hunt or showdown.',
      path: ['huntunt.scout', 'showdown.scout']
    }
  )

/**
 * Settlement
 *
 * All base settlement attributes, as well as those that are set when the user
 * chooses a campaign type and creates a new settlement.
 */
export type Settlement = z.infer<typeof SettlementSchema>
