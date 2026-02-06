'use client'

import { AmbushType, MonsterLevel } from '@/lib/enums'
import { ShowdownMonsterSchema } from '@/schemas/showdown-monster'
import { ShowdownSurvivorDetailsSchema } from '@/schemas/showdown-survivor-details'
import { ShowdownTurnSchema } from '@/schemas/showdown-turn'
import { z } from 'zod'

/**
 * Showdown Schema
 */
export const ShowdownSchema = z.object({
  /** Hunt Ended in Ambush */
  ambush: z.enum(AmbushType),
  /** Showdown ID */
  id: z.number(),
  /** Monster Level */
  level: z.enum(MonsterLevel).default(MonsterLevel.LEVEL_1),
  /** Showdown Monster(s) */
  monsters: z.array(ShowdownMonsterSchema),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Showdown Details */
  survivorDetails: z.array(ShowdownSurvivorDetailsSchema).default([]),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.'),
  /** Turn State */
  turn: ShowdownTurnSchema
})

/**
 * Active Showdown
 */
export type Showdown = z.infer<typeof ShowdownSchema>
