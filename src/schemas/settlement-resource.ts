'use client'

import { MonsterNode, ResourceCategory, ResourceType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Settlement Resource Schema
 */
export const SettlementResourceSchema = z.object({
  /** Amount/Quantity */
  amount: z.number().min(0),
  /** Category (Basic, Monster, Strange, etc.) */
  category: z.enum(ResourceCategory),
  /**
   * Monster Name
   *
   * This is only required for Monster resources. It is used for tracking which
   * resources can be used to craft Seed Patterns with specific era
   * requirements.
   */
  monsterName: z.string().min(1).optional(),
  /**
   * Monster Node
   *
   * This is only required for Monster resources. It is used for tracking which
   * resources can be used to craft Seed Patterns with specific era
   * requirements.
   */
  monsterNode: z.enum(MonsterNode).optional(),
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
