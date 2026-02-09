'use client'

import { SettlementPhaseStep } from '@/lib/enums'
import { z } from 'zod'

/**
 * Settlement Phase Schema
 */
export const SettlementPhaseSchema = z.object({
  /** Endeavors */
  endeavors: z.number().min(0).default(0),
  /** Returning Survivors */
  returningSurvivors: z.array(z.number()),
  /** Settlement ID */
  settlementId: z.string(),
  /** Settlement Phase Step */
  step: z.enum(SettlementPhaseStep)
})

/**
 * Settlement Phase
 */
export type SettlementPhase = z.infer<typeof SettlementPhaseSchema>
