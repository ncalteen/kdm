'use client'

import { ResourceCategory, ResourceType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Settlement Resource Schema
 */
export const SettlementResourceSchema = z.object({
  /** Amount/Quantity */
  amount: z.number().min(0),
  /** Category (Basic, Monster, Strange, etc.) */
  category: z.enum(ResourceCategory),
  /** Resource Name */
  name: z.string().min(1, 'A nameless resource cannot be recorded.'),
  /** Types (Bone, Hide, Organ, etc.) */
  types: z
    .array(z.enum(ResourceType))
    .min(1, 'A resource must have at least one type.')
})

/**
 * Resource
 */
export type SettlementResource = z.infer<typeof SettlementResourceSchema>
