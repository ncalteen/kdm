'use client'

import { AmbushType, ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Survivor Color Schema
 *
 * Used to assign colors to survivors in a hunt.
 */
export const SurvivorColorSchema = z.object({
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Survivor Color Code */
  color: z.nativeEnum(ColorChoice).default(ColorChoice.SLATE)
})

/**
 * Showdown Schema
 */
export const ShowdownSchema = z.object({
  /** Hunt Ended in Ambush */
  ambush: z.nativeEnum(AmbushType),
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
  /** Survivor Color Selection */
  survivorColors: z.array(SurvivorColorSchema).default([]),
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
