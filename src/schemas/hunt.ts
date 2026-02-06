'use client'

import { MonsterLevel } from '@/lib/enums'
import { HuntBoardSchema } from '@/schemas/hunt-board'
import { HuntMonsterSchema } from '@/schemas/hunt-monster'
import { HuntSurvivorDetailsSchema } from '@/schemas/hunt-survivor-details'
import { z } from 'zod'

/**
 * Hunt Schema
 *
 * This includes any information needed to track a selected hunt.
 */
export const HuntSchema = z.object({
  /** Hunt Board */
  huntBoard: HuntBoardSchema.optional(),
  /** Hunt ID */
  id: z.number().int().min(0),
  /** Monster Level */
  level: z.enum(MonsterLevel).default(MonsterLevel.LEVEL_1),
  /** Hunt Monster(s) */
  monsters: z.array(HuntMonsterSchema),
  /** Monster Position on Hunt Board */
  monsterPosition: z.number().min(0).max(12),
  /**
   * Selected Scout
   *
   * Required if settlement uses scouts.
   */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Hunt Details */
  survivorDetails: z.array(HuntSurvivorDetailsSchema).default([]),
  /** Survivor Position on Hunt Board */
  survivorPosition: z.number().min(0).max(12).default(0),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.')
})

/**
 * Hunt
 */
export type Hunt = z.infer<typeof HuntSchema>
