'use client'

import { CampaignType, SurvivorType } from '@/lib/enums'
import { NemesisMonsterDataSchema } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterDataSchema } from '@/schemas/quarry-monster-data'
import { BaseSettlementSchema } from '@/schemas/settlement'
import { WandererSchema } from '@/schemas/wanderer'
import { z } from 'zod'

/**
 * New Settlement Input Schema
 *
 * This is used to ensure that when creating a new settlement, the necessary
 * data is included based on the selected campaign type.
 */
export const NewSettlementInputSchema = BaseSettlementSchema.extend({
  /** Campaign Type */
  campaignType: z
    .enum(CampaignType)
    .default(CampaignType.PEOPLE_OF_THE_LANTERN),
  /** Settlement Name */
  name: z.string().min(1, 'A nameless settlement cannot be recorded.'),
  /** Survivor Type */
  survivorType: z.enum(SurvivorType).default(SurvivorType.CORE),
  /** Uses Scouts */
  usesScouts: z.boolean().default(false),
  /**
   * Monster Selection
   *
   * It's normally recommended to only have one monster per node, but custom
   * campaigns allow for more flexibility.
   */
  monsters: z.object({
    /** Node Quarry 1 Monster Selection */
    NQ1: z.array(QuarryMonsterDataSchema).default([]),
    /** Node Quarry 2 Monster Selection */
    NQ2: z.array(QuarryMonsterDataSchema).default([]),
    /** Node Quarry 3 Monster Selection */
    NQ3: z.array(QuarryMonsterDataSchema).default([]),
    /** Node Quarry 4 Monster Selection */
    NQ4: z.array(QuarryMonsterDataSchema).default([]),
    /** Node Nemesis 1 Monster Selection */
    NN1: z.array(NemesisMonsterDataSchema).default([]),
    /** Node Nemesis 2 Monster Selection */
    NN2: z.array(NemesisMonsterDataSchema).default([]),
    /** Node Nemesis 3 Monster Selection */
    NN3: z.array(NemesisMonsterDataSchema).default([]),
    /** Core Monster Selection */
    CO: z.array(NemesisMonsterDataSchema).default([]),
    /** Finale Monster Selection */
    FI: z.array(NemesisMonsterDataSchema).default([])
  }),
  wanderers: z.array(WandererSchema).default([])
})

/**
 * New Settlement Input Schema
 *
 * This is used to ensure that when creating a new settlement, the necessary
 * data is included based on the selected campaign type.
 */
export type NewSettlementInput = z.infer<typeof NewSettlementInputSchema>
