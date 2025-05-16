'use client'

import type {
  CollectiveCognitionReward,
  Location,
  Milestone,
  Nemesis,
  Principle,
  Quarry,
  TimelineYear
} from '@/schemas/settlement'

/**
 * Campaign Data
 *
 * Data used to generate a new settlement based on the campaign type.
 */
export type CampaignData = {
  /** Collective Cognition Rewards */
  ccRewards: CollectiveCognitionReward[]
  /** Innovations */
  innovations: string[]
  /** Locations */
  locations: Location[]
  /** Milestones */
  milestones: Milestone[]
  /** Nemeses */
  nemeses: Nemesis[]
  /** Principles */
  principles: Principle[]
  /** Quarries */
  quarries: Quarry[]
  /** Settlement Timeline */
  timeline: TimelineYear[]
}
