'use client'

import { MonsterNode } from '@/lib/enums'
import { NemesisMonsterLevelSchema } from '@/schemas/monster-level'
import { VignetteMonsterDataSchema } from '@/schemas/vignette-monster-data'
import { z } from 'zod'

/**
 * Settlement Nemesis Schema
 */
export const SettlementNemesisSchema = z.object({
  /** Collective Cognition (Level 1) */
  ccLevel1: z.boolean().optional(),
  /** Collective Cognition (Level 2) */
  ccLevel2: z.boolean().optional(),
  /** Collective Cognition (Level 3) */
  ccLevel3: z.boolean().optional(),
  /** Level 1 Data */
  level1: z.array(NemesisMonsterLevelSchema).optional(),
  /** Defeated (Level 1) */
  level1Defeated: z.boolean().optional(),
  /** Level 2 Data */
  level2: z.array(NemesisMonsterLevelSchema).optional(),
  /** Defeated (Level 2) */
  level2Defeated: z.boolean().optional(),
  /** Level 3 Data */
  level3: z.array(NemesisMonsterLevelSchema).optional(),
  /** Defeated (Level 3) */
  level3Defeated: z.boolean().optional(),
  /** Level 4 Data */
  level4: z.array(NemesisMonsterLevelSchema).optional(),
  /** Defeated (Level 4) */
  level4Defeated: z.boolean().optional(),
  /** Name */
  name: z.string().min(1, 'A nameless nemesis cannot be recorded.'),
  /** Node */
  node: z.enum(MonsterNode),
  /** Unlocked */
  unlocked: z.boolean(),
  /** Vignette */
  vignette: VignetteMonsterDataSchema.optional()
})

/**
 * Settlement Nemesis
 */
export type SettlementNemesis = z.infer<typeof SettlementNemesisSchema>
