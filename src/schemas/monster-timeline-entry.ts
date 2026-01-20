'use client'

import { CampaignType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Monster Timeline Entry Schema
 */
export const MonsterTimelineEntrySchema = z
  .record(
    z.string(),
    z.array(
      z.union([
        z.string(),
        z.object({
          title: z.string().min(1, 'Title is required.'),
          campaigns: z.array(z.enum(CampaignType)).default([])
        })
      ])
    )
  )
  .transform((obj) => {
    const result: Record<
      number,
      Array<string | { title: string; campaigns: CampaignType[] }>
    > = {}
    Object.entries(obj).forEach(([key, value]) => {
      const numKey = Number(key)
      if (!isNaN(numKey) && numKey >= 0) result[numKey] = value
    })
    return result
  })

/**
 * Monster Timeline Entry
 */
export type MonsterTimelineEntry = z.infer<typeof MonsterTimelineEntrySchema>
