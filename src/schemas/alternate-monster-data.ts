'use client'

import { MonsterType } from '@/lib/enums'
import { HuntBoardSchema } from '@/schemas/hunt-board'
import {
  NemesisMonsterLevelSchema,
  QuarryMonsterLevelSchema
} from '@/schemas/monster-level'
import { SettlementLocationSchema } from '@/schemas/settlement-location'
import { z } from 'zod'

/**
 * Alternate Monster Data Schema
 *
 * These are alternate versions of monsters that can be fought. E.g. the
 * Screaming Nukalope or White Gigalion.
 */
export const AlternateMonsterDataSchema = z.object({
  /** Hunt Board Layout */
  huntBoard: HuntBoardSchema.optional(),
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
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Locations */
  locations: z.array(SettlementLocationSchema).optional(),
  /** Multi-Monster Flag */
  multiMonster: z.boolean().optional(),
  /** Monster Type */
  type: z.enum(MonsterType)
})

/**
 * Alternate Monster Data
 */
export type AlternateMonsterData = z.infer<typeof AlternateMonsterDataSchema>
