'use client'

import {
  AmbushType,
  ColorChoice,
  MonsterLevel,
  MonsterType,
  TurnType
} from '@/lib/enums'
import { z } from 'zod'

/**
 * Showdown Monster Schema
 */
export const ShowdownMonsterSchema = z.object({
  /** Accuracy */
  accuracy: z.number().int().min(0).default(0),
  /** AI Deck Size */
  aiDeckSize: z.number().int().min(0).default(0),
  /** Evasion */
  evasion: z.number().int().min(0).default(0),
  /** Knocked Down */
  knockedDown: z.boolean().default(false),
  /** Monster Level */
  level: z.nativeEnum(MonsterLevel).default(MonsterLevel.LEVEL_1),
  /** Luck */
  luck: z.number().int().min(0).default(0),
  /** Moods */
  moods: z.array(z.string()).default([]),
  /** Movement */
  movement: z.number().int().min(0).default(0),
  /** Monster Name */
  name: z.string().min(1, 'Monster name is required.'),
  /** Speed */
  speed: z.number().int().min(0).default(0),
  /** Strength */
  strength: z.number().int().min(0).default(0),
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
 * Showdown Monster
 */
export type ShowdownMonster = z.infer<typeof ShowdownMonsterSchema>

/**
 * Survivor Color Schema
 *
 * Used to assign colors to survivors in a hunt.
 */
export const SurvivorColorSchema = z.object({
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Survivor Color Code */
  color: z.nativeEnum(ColorChoice).default(ColorChoice.SLATE)
})

/**
 * Survivor Turn State Schema
 *
 * Tracks movement and activation usage for each survivor during their turn.
 */
export const SurvivorTurnStateSchema = z.object({
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Movement Used */
  movementUsed: z.boolean().default(false),
  /** Activation Used */
  activationUsed: z.boolean().default(false)
})

/**
 * Survivor Turn State
 */
export type SurvivorTurnState = z.infer<typeof SurvivorTurnStateSchema>

/**
 * Turn Schema
 *
 * Tracks whose turn it is and survivor action states.
 */
export const TurnSchema = z.object({
  /** Current Turn: 'monster' or 'survivors' */
  currentTurn: z.nativeEnum(TurnType).default(TurnType.MONSTER),
  /** Survivor Turn States */
  survivorStates: z.array(SurvivorTurnStateSchema).default([]),
  /** Turn Number (0 === ambush) */
  turnNumber: z.number().int().min(0).default(1)
})

/**
 * Turn State
 */
export type Turn = z.infer<typeof TurnSchema>

/**
 * Showdown Schema
 */
export const ShowdownSchema = z.object({
  /** Hunt Ended in Ambush */
  ambush: z.nativeEnum(AmbushType),
  /** Showdown ID */
  id: z.number(),
  /** Showdown Monster */
  monster: ShowdownMonsterSchema,
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Color Selection */
  survivorColors: z.array(SurvivorColorSchema).default([]),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.'),
  /** Turn State */
  turn: TurnSchema
})

/**
 * Active Showdown
 */
export type Showdown = z.infer<typeof ShowdownSchema>
