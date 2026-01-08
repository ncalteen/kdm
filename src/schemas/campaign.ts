'use client'

import { TabType } from '@/lib/enums'
import { GlobalSettingsSchema } from '@/schemas/global-settings'
import { HuntSchema } from '@/schemas/hunt'
import { NemesisMonsterDataSchema } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterDataSchema } from '@/schemas/quarry-monster-data'
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
  /** Custom Monsters */
  customMonsters: z
    .record(
      /** Monster ID */
      z.string(),
      /** Monster Data */
      z.record(
        z.literal('main'),
        z.union([NemesisMonsterDataSchema, QuarryMonsterDataSchema])
      )
    )
    .nullable()
    .optional(),
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
  selectedTab: z.enum(TabType).nullable().optional(),
  /** Global Settings */
  settings: GlobalSettingsSchema,
  /** Settlements */
  settlements: z.array(SettlementSchema),
  /** Showdowns */
  showdowns: z.array(ShowdownSchema).nullable().optional(),
  /** Survivors */
  survivors: z.array(SurvivorSchema),
  /** Version */
  version: z.string().optional()
})

/**
 * Campaign
 */
export type Campaign = z.infer<typeof CampaignSchema>
