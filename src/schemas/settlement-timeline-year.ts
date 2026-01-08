'use client'

import { z } from 'zod'

/**
 * Settlement Timeline Year Schema
 */
export const SettlementTimelineYearSchema = z.object({
  /** Lantern Year Completion */
  completed: z.boolean(),
  /** Timeline Entries */
  entries: z.array(z.string().min(1, 'A nameless event cannot be recorded.'))
})

/**
 * Settlement Timeline Year
 */
export type SettlementTimelineYear = z.infer<
  typeof SettlementTimelineYearSchema
>
