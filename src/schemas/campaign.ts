import { TabType } from '@/lib/enums'
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
  hunts: z.array(HuntSchema).nullable().optional(),
  /** Selected Hunt ID */
  selectedHuntId: z.number().nullable().optional(),
  /** Selected Showdown ID */
  selectedShowdownId: z.number().nullable().optional(),
  /** Selected Settlement ID */
  selectedSettlementId: z.number().nullable().optional(),
  /** Selected Survivor ID */
  selectedSurvivorId: z.number().nullable().optional(),
  /** Selected Tab Name */
  selectedTab: z.nativeEnum(TabType).nullable().optional(),
  /** Settlements */
  settlements: z.array(SettlementSchema),
  /** Showdowns */
  showdowns: z.array(ShowdownSchema).nullable().optional(),
  /** Survivors */
  survivors: z.array(SurvivorSchema)
})

/**
 * Campaign
 */
export type Campaign = z.infer<typeof CampaignSchema>
