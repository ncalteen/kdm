'use client'

import { Gender } from '@/lib/enums'
import { z } from 'zod'

/**
 * Wanderer Schema
 */
export const WandererSchema = z.object({
  /** Abilities and Impairments */
  abilitiesAndImpairments: z.array(z.string()).default([]),
  /** Accuracy */
  accuracy: z.number().int().default(0),
  /** Arc Wanderer */
  arc: z.boolean(),
  /** Courage */
  courage: z.number().int().default(0),
  /** Disposition */
  disposition: z.number().int().default(0),
  /** Evasion */
  evasion: z.number().int().default(0),
  /** Fighting Arts */
  fightingArts: z.array(z.string()).default([]),
  /** Gender */
  gender: z.enum(Gender),
  /** Hunt XP */
  huntXP: z.number().int().default(0),
  /** Hunt XP Rank Up Milestones */
  huntXPRankUp: z.array(z.number().int()).default([]),
  /** Insanity */
  insanity: z.number().int().default(0),
  /** Luck */
  luck: z.number().int().default(0),
  /** Lumi */
  lumi: z.number().int().default(0),
  /** Movement */
  movement: z.number().int().default(0),
  /** Name */
  name: z.string(),
  /** Permanent Injuries */
  permanentInjuries: z.array(z.string()).default([]),
  /** Rare Gear */
  rareGear: z.array(z.string()).default([]),
  /** Speed */
  speed: z.number().int().default(0),
  /** Strength */
  strength: z.number().int().default(0),
  /** Survival */
  survival: z.number().int().default(0),
  /** Systemic Pressure */
  systemicPressure: z.number().int().default(0),
  /** Timeline */
  timeline: z.record(z.string(), z.array(z.string())),
  /** Torment */
  torment: z.number().int().default(0),
  /** Understanding */
  understanding: z.number().int().default(0)
})

/**
 * Wanderer
 */
export type Wanderer = z.infer<typeof WandererSchema>
