'use client'

import { z } from 'zod'

/**
 * Showdown Survivor Turn State Schema
 *
 * Tracks movement and activation usage for each survivor during their turn.
 */
export const ShowdownSurvivorTurnStateSchema = z.object({
  /** Activation Used */
  activationUsed: z.boolean().default(false),
  /** Survivor ID */
  id: z.number().int().min(0),
  /** Movement Used */
  movementUsed: z.boolean().default(false)
})

/**
 * ShowdownSurvivor Turn State
 */
export type ShowdownSurvivorTurnState = z.infer<
  typeof ShowdownSurvivorTurnStateSchema
>
