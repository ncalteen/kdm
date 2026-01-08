'use client'

import { z } from 'zod'

/**
 * Showdown Monster Turn State Schema
 *
 * Tracks AI card draw and other actions for monsters during their turn.
 */
export const ShowdownMonsterTurnStateSchema = z.object({
  /** AI Card Drawn */
  aiCardDrawn: z.boolean().default(false)
})

/**
 * Survivor Turn State
 */
export type ShowdownMonsterTurnState = z.infer<
  typeof ShowdownMonsterTurnStateSchema
>
