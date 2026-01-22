'use client'

import { z } from 'zod'

/**
 * Survivor Hunt Details Schema
 *
 * Used to assign details to survivors that only persist during a hunt.
 */
export const HuntSurvivorDetailsSchema = z.object({
  /** Accuracy Tokens */
  accuracyTokens: z.number().int().default(0),
  /** Evasion Tokens */
  evasionTokens: z.number().int().default(0),
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Insanity Tokens */
  insanityTokens: z.number().int().default(0),
  /** Luck Tokens */
  luckTokens: z.number().int().default(0),
  /** Movement Tokens */
  movementTokens: z.number().int().default(0),
  /** Survivor Notes */
  notes: z.string().default(''),
  /** Speed Tokens */
  speedTokens: z.number().int().default(0),
  /** Strength Tokens */
  strengthTokens: z.number().int().default(0),
  /** Survival Tokens */
  survivalTokens: z.number().int().default(0)
})

/**
 * Survivor Hunt Details
 */
export type HuntSurvivorDetails = z.infer<typeof HuntSurvivorDetailsSchema>
