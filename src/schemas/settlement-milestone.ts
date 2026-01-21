'use client'

import { z } from 'zod'

/**
 * Settlement Milestone Schema
 */
export const SettlementMilestoneSchema = z.object({
  /** Completed */
  complete: z.boolean(),
  /** Event (Triggered on Completion) */
  event: z.string().min(1, 'A nameless event cannot be recorded.'),
  /** Milestone Name */
  name: z.string().min(1, 'A nameless milestone cannot be recorded.')
})

/**
 * Settlement Milestone
 */
export type SettlementMilestone = z.infer<typeof SettlementMilestoneSchema>
