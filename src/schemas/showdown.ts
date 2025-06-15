'use client'

import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Active Showdown Schema
 *
 * Unlike the ShowdownSchema that is part of the Settlement, this includes any
 * additional information needed to track an active showdown. E.g., this
 * includes a subset of survivors and their details.
 */
export const ActiveShowdownSchema = z.object({
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
    .array(SurvivorSchema)
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.'),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: SurvivorSchema.optional()
})

/**
 * Active Showdown
 */
export type ActiveShowdown = z.infer<typeof ActiveShowdownSchema>
