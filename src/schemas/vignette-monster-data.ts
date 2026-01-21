'use client'

import { MonsterType } from '@/lib/enums'
import { HuntBoardSchema } from '@/schemas/hunt-board'
import {
  NemesisMonsterLevelSchema,
  QuarryMonsterLevelSchema
} from '@/schemas/monster-level'
import { MonsterTimelineEntrySchema } from '@/schemas/monster-timeline-entry'
import { SettlementLocationSchema } from '@/schemas/settlement-location'
import { z } from 'zod'

/**
 * Vignette Monster Data Schema
 */
export const VignetteMonsterDataSchema = z.object({
  /** Hunt Board Layout */
  huntBoard: HuntBoardSchema.optional(),
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Level 1 Data */
  level1: z
    .array(z.union([NemesisMonsterLevelSchema, QuarryMonsterLevelSchema]))
    .optional(),
  /** Level 2 Data */
  level2: z
    .array(z.union([NemesisMonsterLevelSchema, QuarryMonsterLevelSchema]))
    .optional(),
  /** Level 3 Data */
  level3: z
    .array(z.union([NemesisMonsterLevelSchema, QuarryMonsterLevelSchema]))
    .optional(),
  /** Level 4 Data */
  level4: z
    .array(z.union([NemesisMonsterLevelSchema, QuarryMonsterLevelSchema]))
    .optional(),
  /** Locations */
  locations: z.array(SettlementLocationSchema).optional(),
  /** Multi-Monster Flag */
  multiMonster: z.boolean().optional(),
  /** Timeline Entries */
  timeline: MonsterTimelineEntrySchema,
  /** Monster Type */
  type: z.enum(MonsterType)
})

/**
 * Vignette Monster Data
 */
export type VignetteMonsterData = z.infer<typeof VignetteMonsterDataSchema>
