'use client'

import type {
  CollectiveCognitionReward,
  Location,
  Milestone,
  Principle,
  TimelineYear
} from '@/schemas/settlement'

/**
 * Campaign Template
 *
 * Base information used to create a new settlement using a campaign template.
 */
export type CampaignTemplate = {
  /** Collective Cognition Rewards */
  ccRewards: CollectiveCognitionReward[]
  /** Innovations */
  innovations: string[]
  /** Locations */
  locations: Location[]
  /** Milestones */
  milestones: Milestone[]
  /** Nemesis IDs */
  nemeses: number[]
  /** Principles */
  principles: Principle[]
  /** Quarry IDs */
  quarries: number[]
  /** Settlement Timeline */
  timeline: TimelineYear[]
}
