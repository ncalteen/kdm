'use client'

import { MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterLevelSchema } from '@/schemas/monster-level'
import { MonsterTimelineEntrySchema } from '@/schemas/monster-timeline-entry'
import { VignetteMonsterDataSchema } from '@/schemas/vignette-monster-data'
import { z } from 'zod'

/**
 * Nemesis Monster Data Schema
 */
export const NemesisMonsterDataSchema = z.object({
  /** Level 1 Data */
  level1: z.array(NemesisMonsterLevelSchema).optional(),
  /** Level 2 Data */
  level2: z.array(NemesisMonsterLevelSchema).optional(),
  /** Level 3 Data */
  level3: z.array(NemesisMonsterLevelSchema).optional(),
  /** Level 4 Data */
  level4: z.array(NemesisMonsterLevelSchema).optional(),
  /** Multi-Monster Encounter */
  multiMonster: z.boolean().default(false),
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Node */
  node: z.enum(MonsterNode),
  /** Timeline Entries */
  timeline: MonsterTimelineEntrySchema,
  /** Monster Type */
  type: z.literal(MonsterType.NEMESIS),
  /** Vignette Monster Data */
  vignette: VignetteMonsterDataSchema.optional()
})

/**
 * Nemesis Monster Data
 */
export type NemesisMonsterData = z.infer<typeof NemesisMonsterDataSchema>
