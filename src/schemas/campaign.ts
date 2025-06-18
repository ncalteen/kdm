import { HuntSchema } from '@/schemas/hunt'
import { SettlementSchema } from '@/schemas/settlement'
import { ShowdownSchema } from '@/schemas/showdown'
import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Campaign Schema
 *
 * All of the data stored for all of the settlements and survivors for a player.
 */
export const CampaignSchema = z.object({
  /** Hunts */
  hunts: z.array(HuntSchema),
  /** Selected Hunt ID */
  selectedHuntId: z.number().optional(),
  /** Selected Showdown ID */
  selectedShowdownId: z.number().optional(),
  /** Selected Settlement ID */
  selectedSettlementId: z.number().optional(),
  /** Selected Survivor ID */
  selectedSurvivorId: z.number().optional(),
  /** Selected Tab Name */
  selectedTab: z.string().optional(),
  /** Settlements */
  settlements: z.array(SettlementSchema),
  /** Showdowns */
  showdowns: z.array(ShowdownSchema),
  /** Survivors */
  survivors: z.array(SurvivorSchema)
})

/**
 * Campaign
 */
export type Campaign = z.infer<typeof CampaignSchema>
