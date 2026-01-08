'use client'

import { NemesisMonsterData, QuarryMonsterData } from '@/schemas/monster'
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
  nemeses: NemesisMonsterData[]
  /** Principles */
  principles: Principle[]
  /** Quarry IDs */
  quarries: QuarryMonsterData[]
  /** Settlement Timeline */
  timeline: TimelineYear[]
}
