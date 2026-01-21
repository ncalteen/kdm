'use client'

import { z } from 'zod'

/**
 * Squires of the Citadel Suspicion Schema
 */
export const SquireSuspicionSchema = z.object({
  /** Suspicion Level 1 */
  level1: z.boolean(),
  /** Suspicion Level 2 */
  level2: z.boolean(),
  /** Suspicion Level 3 */
  level3: z.boolean(),
  /** Suspicion Level 4 */
  level4: z.boolean(),
  /** Survivor Name */
  name: z.string().min(1, 'A nameless survivor cannot be recorded.')
})

/**
 * Squires of the Citadel Suspicion
 */
export type SquireSuspicion = z.infer<typeof SquireSuspicionSchema>
