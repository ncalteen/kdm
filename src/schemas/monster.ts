'use client'

import { CampaignType, MonsterNode, MonsterType } from '@/lib/enums'
import { HuntBoardSchema } from '@/schemas/hunt'
import {
  CollectiveCognitionRewardSchema,
  LocationSchema
} from '@/schemas/settlement'
import { z } from 'zod'

/**
 * Base Monster Level Schema
 *
 * Includes the common attributes for a monster at a particular level.
 */
export const BaseMonsterLevelSchema = z.object({
  /** Accuracy */
  accuracy: z.number().int().default(0),
  /** Accuracy Tokens */
  accuracyTokens: z.number().int().default(0),
  /** AI Deck */
  aiDeck: z.object({
    /** Basic Cards */
    basic: z.number().int().min(0).default(0),
    /** Advanced Cards */
    advanced: z.number().int().min(0).default(0),
    /** Legendary Cards */
    legendary: z.number().int().min(0).default(0),
    /** Overtone Cards */
    overtone: z.number().int().min(0).default(0).optional()
  }),
  /** AI Deck Remaining */
  aiDeckRemaining: z.number().int().min(0).default(0),
  /** Damage */
  damage: z.number().int().min(0).default(0),
  /** Damage Tokens */
  damageTokens: z.number().int().default(0),
  /** Evasion */
  evasion: z.number().int().default(0),
  /** Evasion Tokens */
  evasionTokens: z.number().int().default(0),
  /** Luck */
  luck: z.number().int().default(0),
  /** Luck Tokens */
  luckTokens: z.number().int().default(0),
  /** Moods */
  moods: z.array(z.string()).default([]),
  /** Movement */
  movement: z.number().int().min(1).default(1),
  /** Movement Tokens */
  movementTokens: z.number().int().default(0),
  /** Speed */
  speed: z.number().int().default(0),
  /** Speed Tokens */
  speedTokens: z.number().int().default(0),
  /** Strength */
  strength: z.number().int().default(0),
  /** Strength Tokens */
  strengthTokens: z.number().int().default(0),
  /** Survivor Statuses */
  survivorStatuses: z.array(z.string()).default([]),
  /** Toughness */
  toughness: z.number().int().min(0).default(0),
  /** Toughness Tokens */
  toughnessTokens: z.number().int().default(0),
  /** Traits */
  traits: z.array(z.string()).default([])
})

/**
 * Base Monster Level
 *
 * Includes the common attributes for a monster at a particular level.
 */
export type BaseMonsterLevel = z.infer<typeof BaseMonsterLevelSchema>

/**
 * Quarry Monster Level Schema
 */
export const QuarryMonsterLevelSchema = BaseMonsterLevelSchema.extend({
  /** Monster Hunt Board Starting Position */
  huntPos: z.number().int().min(0).default(12),
  /** Survivor Hunt Board Starting Position */
  survivorHuntPos: z.number().int().min(0).default(0)
})

/**
 * Quarry Monster Level
 */
export type QuarryMonsterLevel = z.infer<typeof QuarryMonsterLevelSchema>

/**
 * Nemesis Monster Level Schema
 */
export const NemesisMonsterLevelSchema = BaseMonsterLevelSchema.extend({
  /** Life */
  life: z.number().int().min(1).optional()
})

/**
 * Nemesis Monster Level
 */
export type NemesisMonsterLevel = z.infer<typeof NemesisMonsterLevelSchema>

/**
 * Nemesis Monster Data Schema
 */
export const NemesisMonsterDataSchema = z.object({
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Node */
  node: z.enum(MonsterNode),
  /** Level 1 Data */
  level1: NemesisMonsterLevelSchema.optional(),
  /** Level 2 Data */
  level2: NemesisMonsterLevelSchema.optional(),
  /** Level 3 Data */
  level3: NemesisMonsterLevelSchema.optional(),
  /** Level 4 Data */
  level4: NemesisMonsterLevelSchema.optional(),
  /** Timeline Entries */
  timeline: z
    .record(
      z.string(),
      z.array(
        z.union([
          z.string(),
          z.object({
            title: z.string().min(1, 'Title is required.'),
            campaigns: z.array(z.enum(CampaignType)).default([])
          })
        ])
      )
    )
    .transform((obj) => {
      const result: Record<
        number,
        Array<string | { title: string; campaigns: CampaignType[] }>
      > = {}
      Object.entries(obj).forEach(([key, value]) => {
        const numKey = Number(key)
        if (!isNaN(numKey) && numKey >= 1) result[numKey] = value
      })
      return result
    }),
  /** Monster Type */
  type: z.literal(MonsterType.NEMESIS)
})

/**
 * Nemesis Monster Data
 */
export type NemesisMonsterData = z.infer<typeof NemesisMonsterDataSchema>

/**
 * Quarry Monster Data Schema
 */
export const QuarryMonsterDataSchema = z.object({
  /** Collective Cognition Rewards */
  ccRewards: z.array(CollectiveCognitionRewardSchema).default([]),
  /** Hunt Board Configuration */
  huntBoard: HuntBoardSchema,
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Node */
  node: z.enum(MonsterNode),
  /** Prologue Monster */
  prologue: z.boolean().default(false),
  /** Level 1 Data */
  level1: QuarryMonsterLevelSchema.optional(),
  /** Level 2 Data */
  level2: QuarryMonsterLevelSchema.optional(),
  /** Level 3 Data */
  level3: QuarryMonsterLevelSchema.optional(),
  /** Level 4 Data */
  level4: QuarryMonsterLevelSchema.optional(),
  /** Locations */
  locations: z.array(LocationSchema).default([]),
  /** Timeline Entries */
  timeline: z
    .record(
      z.string(),
      z.array(
        z.union([
          z.string(),
          z.object({
            title: z.string().min(1, 'Title is required.'),
            campaigns: z.array(z.enum(CampaignType)).default([])
          })
        ])
      )
    )
    .transform((obj) => {
      const result: Record<
        number,
        Array<string | { title: string; campaigns: CampaignType[] }>
      > = {}
      Object.entries(obj).forEach(([key, value]) => {
        const numKey = Number(key)
        if (!isNaN(numKey) && numKey >= 0) result[numKey] = value
      })
      return result
    }),
  /** Monster Type */
  type: z.literal(MonsterType.QUARRY)
})

/**
 * Quarry Monster Data
 */
export type QuarryMonsterData = z.infer<typeof QuarryMonsterDataSchema>
