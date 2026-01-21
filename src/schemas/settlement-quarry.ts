'use client'

import { MonsterNode } from '@/lib/enums'
import { AlternateMonsterDataSchema } from '@/schemas/alternate-monster-data'
import { HuntBoardSchema } from '@/schemas/hunt-board'
import { QuarryMonsterLevelSchema } from '@/schemas/monster-level'
import { VignetteMonsterDataSchema } from '@/schemas/vignette-monster-data'
import { z } from 'zod'

/**
 * Settlement Quarry Schema
 */
export const SettlementQuarrySchema = z.object({
  /** Alternate Monster Data */
  alternate: AlternateMonsterDataSchema.optional(),
  /** Collective Cognition (Level 1) */
  ccLevel1: z.boolean().optional(),
  /** Collective Cognition (Level 2) */
  ccLevel2: z.array(z.boolean()).min(2).max(2).optional(),
  /** Collective Cognition (Level 3) */
  ccLevel3: z.array(z.boolean()).min(3).max(3).optional(),
  /** Collective Cognition (Prologue) */
  ccPrologue: z.boolean().optional(),
  /** Hunt Board Layout */
  huntBoard: HuntBoardSchema,
  /** Level 1 Data */
  level1: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 2 Data */
  level2: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 3 Data */
  level3: z.array(QuarryMonsterLevelSchema).optional(),
  /** Level 4 Data */
  level4: z.array(QuarryMonsterLevelSchema).optional(),
  /** Name */
  name: z.string().min(1, 'A nameless quarry cannot be recorded.'),
  /** Node */
  node: z.enum(MonsterNode),
  /** Unlocked */
  unlocked: z.boolean(),
  /** Vignette Monster Data */
  vignette: VignetteMonsterDataSchema.optional()
})

/**
 * Settlement Quarry
 */
export type SettlementQuarry = z.infer<typeof SettlementQuarrySchema>
