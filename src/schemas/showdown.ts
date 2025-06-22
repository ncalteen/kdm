'use client'

import { MonsterLevel, MonsterType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Showdown Schema
 */
export const ShowdownSchema = z.object({
  /** Showdown ID */
  id: z.number(),
  /** Monster Name (Quarry or Nemesis) */
  monsterName: z
    .string()
    .min(1, 'The monster name cannot be empty for a showdown.'),
  /** Monster Level (Quarry or Nemesis) */
  monsterLevel: z.nativeEnum(MonsterLevel),
  /** Monster Type */
  monsterType: z.nativeEnum(MonsterType),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.')
})

/**
 * Active Showdown
 */
export type Showdown = z.infer<typeof ShowdownSchema>
