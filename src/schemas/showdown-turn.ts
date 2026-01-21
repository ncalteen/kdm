'use client'

import { TurnType } from '@/lib/enums'
import { ShowdownMonsterTurnStateSchema } from '@/schemas/showdown-monster-turn-state'
import { ShowdownSurvivorTurnStateSchema } from '@/schemas/showdown-survivor-turn-state'
import { z } from 'zod'

/**
 * Showdown Turn Schema
 *
 * Tracks whose turn it is and survivor action states.
 */
export const ShowdownTurnSchema = z.object({
  /** Current Turn: 'monster' or 'survivors' */
  currentTurn: z.enum(TurnType).default(TurnType.MONSTER),
  /** Monster Turn State */
  monsterState: ShowdownMonsterTurnStateSchema.default({
    aiCardDrawn: false
  }),
  /** Survivor Turn States */
  survivorStates: z.array(ShowdownSurvivorTurnStateSchema).default([])
})

/**
 * Showdown Turn State
 */
export type ShowdownTurn = z.infer<typeof ShowdownTurnSchema>
