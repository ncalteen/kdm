'use client'

import { ColorChoice, MonsterLevel } from '@/lib/enums'
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
 * Hunt Schema
 *
 * This includes any information needed to track a selected hunt.
 */
export const HuntSchema = z.object({
  /** Hunt ID */
  id: z.number().int().min(0),
  /** Quarry Name */
  quarryName: z.string().min(1, 'The quarry name cannot be empty for a hunt.'),
  /** Quarry Level */
  quarryLevel: z.nativeEnum(MonsterLevel),
  /** Quarry Position on Hunt Board */
  quarryPosition: z.number().min(0).max(12).default(6),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Color Selection */
  survivorColors: z.array(SurvivorColorSchema).default([]),
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
