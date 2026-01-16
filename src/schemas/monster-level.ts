'use client'

import { z } from 'zod'

/**
 * Base Monster Level Schema
 *
 * Includes the common attributes for a monster at a particular level.
 */
export const MonsterLevelSchema = z.object({
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
  damage: z.number().int().default(0),
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
  /** Movement
   *
   * Negative values indicate infinite movement.
   */
  movement: z.number().int().default(1),
  /** Movement Tokens */
  movementTokens: z.number().int().default(0),
  /**
   * Name
   *
   * Optional name for specific monsters in multi-monster encounters.
   */
  name: z.string().min(1).optional(),
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
export type MonsterLevel = z.infer<typeof MonsterLevelSchema>

/**
 * Quarry Monster Level Schema
 */
export const QuarryMonsterLevelSchema = MonsterLevelSchema.extend({
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
export const NemesisMonsterLevelSchema = MonsterLevelSchema.extend({
  /** Life */
  life: z.number().int().min(1).optional()
})

/**
 * Nemesis Monster Level
 */
export type NemesisMonsterLevel = z.infer<typeof NemesisMonsterLevelSchema>
