'use client'

import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Active Hunt Schema
 *
 * Unlike the HuntSchema that is part of the Settlement, this includes any
 * additional information needed to track an active hunt. E.g., this includes
 * a subset of survivors and their details.
 */
export const ActiveHuntSchema = z.object({
  /** Quarry Name */
  quarryName: z.string().min(1, 'The quarry name cannot be empty for a hunt.'),
  /** Quarry Level */
  quarryLevel: z.enum(['1', '2', '3', '4']),
  /** Selected Survivors */
  survivors: z
    .array(SurvivorSchema)
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.'),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: SurvivorSchema.optional(),
  /** Survivor Position on Hunt Board */
  survivorPosition: z.number().min(0).max(12).default(0),
  /** Quarry Position on Hunt Board */
  quarryPosition: z.number().min(0).max(12).default(6),
  /** Hunt Ended in Monster Ambushing Survivors */
  ambush: z.boolean().default(false)
})

/**
 * Active Hunt
 */
export type ActiveHunt = z.infer<typeof ActiveHuntSchema>
