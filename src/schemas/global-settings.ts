'use client'

import { z } from 'zod'

/**
 * Global Settings Schema
 */
export const GlobalSettingsSchema = z.object({
  /** Disable Toast Notifications */
  disableToasts: z.boolean().default(false),
  /** Unlocked Special Monsters */
  unlockedMonsters: z.object({
    /** Killenium Butcher Nemesis */
    killeniumButcher: z.boolean().default(false),
    /** Screaming Nukalope Quarry */
    screamingNukalope: z.boolean().default(false),
    /** White Gigalion Quarry */
    whiteGigalion: z.boolean().default(false)
  })
})

/**
 * Global Settings
 */
export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>
