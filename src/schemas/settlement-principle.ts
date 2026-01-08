'use client'

import { z } from 'zod'

/**
 * Settlement Principle Schema
 */
export const SettlementPrincipleSchema = z.object({
  /** Principle Name */
  name: z.string().min(1, 'A nameless principle cannot be recorded.'),
  /** Option 1 Name */
  option1Name: z
    .string()
    .min(1, 'A nameless principle option cannot be recorded.'),
  /** Option 1 Selected */
  option1Selected: z.boolean(),
  /** Option 2 Name */
  option2Name: z
    .string()
    .min(1, 'A nameless principle option cannot be recorded.'),
  /** Option 2 Selected */
  option2Selected: z.boolean()
})

/**
 * Settlement Principle
 */
export type SettlementPrinciple = z.infer<typeof SettlementPrincipleSchema>
