'use client'

import { Philosophy } from '@/lib/enums'
import { z } from 'zod'

/**
 * Settlement Knowledge Schema
 */
export const SettlementKnowledgeSchema = z.object({
  /** Knowledge Name */
  name: z.string().min(1, 'A nameless knowledge cannot be recorded.'),
  /** Philosophy */
  philosophy: z.enum(Philosophy).optional()
})

/**
 * Settlement Knowledge
 */
export type SettlementKnowledge = z.infer<typeof SettlementKnowledgeSchema>
