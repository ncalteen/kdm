'use client'

import { MonsterType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Hunt Monster Schema
 */
export const HuntMonsterSchema = z.object({
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
  /** Knocked Down */
  knockedDown: z.boolean().default(false),
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
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Notes */
  notes: z.string().default(''),
  /** Speed */
  speed: z.number().int().default(0),
  /** Speed Tokens */
  speedTokens: z.number().int().default(0),
  /** Strength */
  strength: z.number().int().default(0),
  /** Strength Tokens */
  strengthTokens: z.number().int().default(0),
  /** Toughness */
  toughness: z.number().int().min(0).default(0),
  /** Traits */
  traits: z.array(z.string()).default([]),
  /** Monster Type */
  type: z.enum(MonsterType),
  /** Wounds */
  wounds: z.number().int().min(0).default(0)
})

/**
 * Hunt Monster
 */
export type HuntMonster = z.infer<typeof HuntMonsterSchema>
