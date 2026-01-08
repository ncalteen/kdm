'use client'

import { HuntEventType } from '@/lib/enums'
import { z } from 'zod'

/**
 * Hunt Board Schema
 */
export const HuntBoardSchema = z.object({
  /** Position 0 (Start) */
  0: z.undefined(),
  /** Position 1 */
  1: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 2 */
  2: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 3 */
  3: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 4 */
  4: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 5 */
  5: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 6 (Overwhelming Darkness) */
  6: z.undefined(),
  /** Position 7 */
  7: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 8 */
  8: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 9 */
  9: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 10 */
  10: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 11 */
  11: z.union([z.enum(HuntEventType), z.undefined()]),
  /** Position 12 (Starvation) */
  12: z.undefined()
})

/**
 * Hunt Board
 */
export type HuntBoard = z.infer<typeof HuntBoardSchema>
