'use client'

import { z } from 'zod'

/**
 * Settlement Location Schema
 */
export const SettlementLocationSchema = z.object({
  /** Location Name */
  name: z.string().min(1, 'A nameless location cannot be recorded.'),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * Settlement Location
 */
export type SettlementLocation = z.infer<typeof SettlementLocationSchema>
