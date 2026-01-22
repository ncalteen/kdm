'use client'

import { z } from 'zod'

/**
 * Showdown Survivor Details Schema
 *
 * Used to assign details to survivors that only persist during a showdown.
 */
export const ShowdownSurvivorDetailsSchema = z.object({
  /** Accuracy Tokens */
  accuracyTokens: z.number().int().default(0),
  /** Bleeding Tokens */
  bleedingTokens: z.number().int().min(0).default(0),
  /** Block Tokens */
  blockTokens: z.number().int().min(0).default(0),
  /** Deflect Tokens */
  deflectTokens: z.number().int().min(0).default(0),
  /** Evasion Tokens */
  evasionTokens: z.number().int().default(0),
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Insanity Tokens */
  insanityTokens: z.number().int().default(0),
  /** Knocked Down */
  knockedDown: z.boolean().default(false),
  /** Luck Tokens */
  luckTokens: z.number().int().default(0),
  /** Movement Tokens */
  movementTokens: z.number().int().default(0),
  /** Survivor Notes */
  notes: z.string().default(''),
  /** Priority Target */
  priorityTarget: z.boolean().default(false),
  /** Speed Tokens */
  speedTokens: z.number().int().default(0),
  /** Strength Tokens */
  strengthTokens: z.number().int().default(0),
  /** Survival Tokens */
  survivalTokens: z.number().int().default(0)
})

/**
 * Showdown Survivor Details
 */
export type ShowdownSurvivorDetails = z.infer<
  typeof ShowdownSurvivorDetailsSchema
>
