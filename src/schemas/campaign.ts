import { SettlementSchema } from '@/schemas/settlement'
import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Campaign Schema
 */
export const CampaignSchema = z.object({
  settlements: z.array(SettlementSchema),
  survivors: z.array(SurvivorSchema)
})
