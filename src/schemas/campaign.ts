import { SettlementSchema } from '@/schemas/settlement'
import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Campaign Schema
 *
 * All of the data stored for all of the settlements and survivors for a player.
 */
export const CampaignSchema = z.object({
  settlements: z.array(SettlementSchema),
  survivors: z.array(SurvivorSchema),
  selectedSettlementId: z.number().optional()
})

/**
 * Campaign
 *
 * All of the data stored for all of the settlements and survivors for a player.
 */
export type Campaign = z.infer<typeof CampaignSchema>
