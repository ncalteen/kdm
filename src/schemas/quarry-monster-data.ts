'use client'

import { MonsterNode, MonsterType } from '@/lib/enums'
import { AlternateMonsterDataSchema } from '@/schemas/alternate-monster-data'
import { HuntBoardSchema } from '@/schemas/hunt-board'
import { QuarryMonsterLevelSchema } from '@/schemas/monster-level'
import { MonsterTimelineEntrySchema } from '@/schemas/monster-timeline-entry'
import { SettlementCollectiveCognitionRewardSchema } from '@/schemas/settlement-cc-reward'
import { SettlementLocationSchema } from '@/schemas/settlement-location'
import { VignetteMonsterDataSchema } from '@/schemas/vignette-monster-data'
import { z } from 'zod'

/**
 * Quarry Monster Data Schema
 */
export const QuarryMonsterDataSchema = z.object({
  /** Alternate Monster Data */
  alternate: AlternateMonsterDataSchema.optional(),
  /** Collective Cognition Rewards */
  ccRewards: z.array(SettlementCollectiveCognitionRewardSchema).default([]),
  /** Hunt Board Configuration */
  huntBoard: HuntBoardSchema,
  /** Multi-Monster Encounter */
  multiMonster: z.boolean().default(false),
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Node */
  node: z.enum(MonsterNode),
  /** Prologue Monster */
  prologue: z.boolean().default(false),
  /** Level 1 Data */
  level1: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 2 Data */
  level2: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 3 Data */
  level3: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 4 Data */
  level4: z.array(QuarryMonsterLevelSchema).optional(),
  /** Locations */
  locations: z.array(SettlementLocationSchema).default([]),
  /** Timeline Entries */
  timeline: MonsterTimelineEntrySchema,
  /** Monster Type */
  type: z.literal(MonsterType.QUARRY),
  /** Vignette Monster Data */
  vignette: VignetteMonsterDataSchema.optional()
})

/**
 * Quarry Monster Data
 */
export type QuarryMonsterData = z.infer<typeof QuarryMonsterDataSchema>
