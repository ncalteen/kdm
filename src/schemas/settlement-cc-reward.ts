'use client'

import { z } from 'zod'

/**
 * Settlement Collective Cognition Reward Schema
 */
export const SettlementCollectiveCognitionRewardSchema = z.object({
  /** Collective Cognition Value */
  cc: z.number().min(0),
  /** Collective Cognition Reward Name */
  name: z.string().min(1, 'A nameless reward cannot be recorded.'),
  /** Unlocked */
  unlocked: z.boolean()
})

/**
 * SettlementCollective Cognition Reward
 */
export type SettlementCollectiveCognitionReward = z.infer<
  typeof SettlementCollectiveCognitionRewardSchema
>
