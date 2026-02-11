'use client'

import { TabType } from '@/lib/enums'
import { GlobalSettingsSchema } from '@/schemas/global-settings'
import { HuntSchema } from '@/schemas/hunt'
import { NemesisMonsterDataSchema } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterDataSchema } from '@/schemas/quarry-monster-data'
import { SettlementSchema } from '@/schemas/settlement'
import { SettlementPhaseSchema } from '@/schemas/settlement-phase'
import { ShowdownSchema } from '@/schemas/showdown'
import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Campaign Schema
 *
 * All of the data stored for all of the settlements and survivors for a player.
 */
export const CampaignSchema = z.object({
  /** Custom Nemeses */
  customNemeses: z
    .record(
      /** Nemesis ID */
      z.string(),
      /** Nemesis Data */
      NemesisMonsterDataSchema
    )
    .nullable()
    .optional(),
  /** Custom Quarries */
  customQuarries: z
    .record(
      /** Quarry ID */
      z.string(),
      /** Quarry Data */
      QuarryMonsterDataSchema
    )
    .nullable()
    .optional(),
  /** Hunts */
  hunts: z.array(HuntSchema).nullable().optional(),
  /** Selected Hunt ID */
  selectedHuntId: z.number().nullable().optional(),
  /**
   * Selected Hunt Monster Index
   *
   * Always zero for single monster hunts, or the index of the selected monster
   * in multi-monster hunts.
   */
  selectedHuntMonsterIndex: z.number().default(0).optional(),
  /** Selected Showdown ID */
  selectedShowdownId: z.number().nullable().optional(),
  /**
   * Selected Showdown Monster Index
   *
   * Always zero for single monster showdowns, or the index of the selected
   * monster in multi-monster showdowns.
   */
  selectedShowdownMonsterIndex: z.number().default(0).optional(),
  /** Selected Settlement ID */
  selectedSettlementId: z.number().nullable().optional(),
  /** Selected Settlement Phase ID */
  selectedSettlementPhaseId: z.number().nullable().optional(),
  /** Selected Survivor ID */
  selectedSurvivorId: z.number().nullable().optional(),
  /** Selected Tab Name */
  selectedTab: z.enum(TabType).nullable().optional(),
  /** Global Settings */
  settings: GlobalSettingsSchema,
  /** Settlement Phases */
  settlementPhases: z.array(SettlementPhaseSchema),
  /** Settlements */
  settlements: z.array(SettlementSchema),
  /** Showdowns */
  showdowns: z.array(ShowdownSchema),
  /** Survivors */
  survivors: z.array(SurvivorSchema),
  /** Version */
  version: z.string().optional()
})

/**
 * Campaign
 */
export type Campaign = z.infer<typeof CampaignSchema>
