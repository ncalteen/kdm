'use client'

import { ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Survivor Hunt Details Schema
 *
 * Used to assign details to survivors that only persist during a hunt.
 */
export const SurvivorHuntDetailsSchema = z.object({
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Survivor Color Code */
  color: z.nativeEnum(ColorChoice).default(ColorChoice.SLATE),
  /** Survivor Notes */
  notes: z.string().default('')
})

/**
 * Hunt Monster Schema
 */
export const HuntMonsterSchema = z.object({
  /** Accuracy */
  accuracy: z.number().int().min(0).default(0),
  /** Accuracy Tokens */
  accuracyTokens: z.number().int().default(0),
  /** AI Deck Size */
  aiDeckSize: z.number().int().min(0).default(0),
  /** Damage */
  damage: z.number().int().min(0).default(0),
  /** Damage Tokens */
  damageTokens: z.number().int().default(0),
  /** Evasion */
  evasion: z.number().int().min(0).default(0),
  /** Evasion Tokens */
  evasionTokens: z.number().int().default(0),
  /** Knocked Down */
  knockedDown: z.boolean().default(false),
  /** Monster Level */
  level: z.nativeEnum(MonsterLevel).default(MonsterLevel.LEVEL_1),
  /** Luck */
  luck: z.number().int().min(0).default(0),
  /** Luck Tokens */
  luckTokens: z.number().int().default(0),
  /** Moods */
  moods: z.array(z.string()).default([]),
  /** Movement */
  movement: z.number().int().min(0).default(0),
  /** Movement Tokens */
  movementTokens: z.number().int().default(0),
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Monster Notes */
  notes: z.string().default(''),
  /** Speed */
  speed: z.number().int().min(0).default(0),
  /** Speed Tokens */
  speedTokens: z.number().int().default(0),
  /** Strength */
  strength: z.number().int().min(0).default(0),
  /** Strength Tokens */
  strengthTokens: z.number().int().default(0),
  /** Toughness */
  toughness: z.number().int().min(0).default(0),
  /** Traits */
  traits: z.array(z.string()).default([]),
  /** Monster Type */
  type: z.nativeEnum(MonsterType),
  /** Wounds */
  wounds: z.number().int().min(0).default(0)
})

/**
 * Hunt Monster
 */
export type HuntMonster = z.infer<typeof HuntMonsterSchema>

/**
 * Hunt Schema
 *
 * This includes any information needed to track a selected hunt.
 */
export const HuntSchema = z.object({
  /** Hunt ID */
  id: z.number().int().min(0),
  /** Hunt Monster */
  monster: HuntMonsterSchema,
  /** Monster Position on Hunt Board */
  monsterPosition: z.number().min(0).max(12),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Hunt Details */
  survivorDetails: z.array(SurvivorHuntDetailsSchema).default([]),
  /** Survivor Position on Hunt Board */
  survivorPosition: z.number().min(0).max(12).default(0),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.')
})

/**
 * Hunt
 */
export type Hunt = z.infer<typeof HuntSchema>
