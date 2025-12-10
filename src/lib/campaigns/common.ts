'use client'

import { Milestone } from '@/schemas/settlement'

/**
 * Core Campaign Milestones
 */
export const CoreMilestones: Milestone[] = [
  {
    name: 'Population reaches 0',
    complete: false,
    event: 'Game Over'
  },
  {
    name: 'Population reaches 15',
    complete: false,
    event: 'Principle: Society'
  },
  {
    name: 'First child is born',
    complete: false,
    event: 'Principle: New Life'
  },
  {
    name: 'First time death count is updated',
    complete: false,
    event: 'Principle: Death'
  }
]
