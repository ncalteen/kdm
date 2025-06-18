'use client'

import { MonsterLevel } from '@/lib/enums'
import { z } from 'zod'

/**
 * Hunt Schema
 *
 * This includes any information needed to track a selected hunt.
 */
export const HuntSchema = z.object({
  /** Hunt Ended in Monster Ambushing Survivors */
  ambush: z.boolean().default(false),
  /** Hunt ID */
  id: z.number().int().min(0),
  /** Quarry Name */
  quarryName: z.string().min(1, 'The quarry name cannot be empty for a hunt.'),
  /** Quarry Level */
  quarryLevel: z.nativeEnum(MonsterLevel),
  /** Selected Survivors */
  survivors: z
    .array(z.number())
    .min(1, 'At least one survivor must be selected for the hunt.')
    .max(4, 'No more than four survivors can embark on a hunt.'),
  /** Selected Scout (Required if Settlement uses Scouts) */
  scout: z.number().optional(),
  /** Settlement ID */
  settlementId: z.number().int().min(0),
  /** Survivor Position on Hunt Board */
  survivorPosition: z.number().min(0).max(12).default(0),
  /** Quarry Position on Hunt Board */
  quarryPosition: z.number().min(0).max(12).default(6)
})

/**
 * Hunt
 */
export type Hunt = z.infer<typeof HuntSchema>

// .refine((data) => !(data.hunt && data.showdown), {
//     message: 'A settlement cannot have both an active hunt and showdown.',
//     path: ['hunt', 'showdown']
//   })
//   .refine(
//     (data) => {
//       // Skip validation if scouts are not used by this settlement
//       if (!data.usesScouts) return true

//       // Check if the hunt requires scout selection
//       if (data.hunt && !data.hunt.scout) return false

//       // Check if the showdown requires scout selection
//       if (data.showdown && !data.showdown.scout) return false

//       return true
//     },
//     {
//       message:
//         "When a settlement uses scouts, a scout must be selected for the hunt or showdown. The scout's keen eyes are essential for your survival.",
//       path: ['hunt.scout', 'showdown.scout']
//     }
//   )
//   .refine(
//     (data) => {
//       // Skip validation if settlement does not use scouts
//       if (!data.usesScouts) return true

//       // Confirm the selected scout is not also a selected survivor
//       const scout = data.hunt?.scout || data.showdown?.scout

//       // No scout selected, skip validation
//       if (!scout) return true

//       // Check if the selected scout is in the survivor list
//       const survivors = data.hunt?.survivors || data.showdown?.survivors

//       // No survivors selected, skip validation
//       if (!survivors || survivors.length === 0) return true

//       // Validate that the selected scout is not in the survivors list
//       return !survivors.includes(scout)
//     },
//     {
//       message:
//         'The selected scout cannot also be one of the selected survivors for the hunt or showdown.',
//       path: ['huntunt.scout', 'showdown.scout']
//     }
//   )
