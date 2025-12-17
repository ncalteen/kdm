import { TabType } from '@/lib/enums'
import { HuntSchema } from '@/schemas/hunt'
import {
  NemesisMonsterDataSchema,
  QuarryMonsterDataSchema
} from '@/schemas/monster'
import { SettlementSchema } from '@/schemas/settlement'
import { ShowdownSchema } from '@/schemas/showdown'
import { SurvivorSchema } from '@/schemas/survivor'
import { z } from 'zod'

/**
 * Global Settings Schema
 */
export const GlobalSettingsSchema = z.object({
  /** Disable Toast Notifications */
  disableToasts: z.boolean().default(false),
  /** Unlocked Special Monsters */
  unlockedMonsters: z.object({
    /** Killenium Butcher Nemesis */
    killeniumButcher: z.boolean().default(false),
    /** Screaming Nukalope Quarry */
    screamingNukalope: z.boolean().default(false),
    /** White Gigalion Quarry */
    whiteGigalion: z.boolean().default(false)
  })
})

/**
 * Global Settings
 */
export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>

/**
 * Campaign Schema
 *
 * All of the data stored for all of the settlements and survivors for a player.
 */
export const CampaignSchema = z.object({
  /** Custom Monsters */
  customMonsters: z
    .array(z.union([NemesisMonsterDataSchema, QuarryMonsterDataSchema]))
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
  survivors: z.array(SurvivorSchema)
})

/**
 * Campaign
 */
export type Campaign = z.infer<typeof CampaignSchema>
