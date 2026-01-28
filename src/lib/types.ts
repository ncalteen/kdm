'use client'

import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { SettlementCollectiveCognitionReward } from '@/schemas/settlement-cc-reward'
import { SettlementLocation } from '@/schemas/settlement-location'
import { SettlementMilestone } from '@/schemas/settlement-milestone'
import { SettlementPrinciple } from '@/schemas/settlement-principle'
import { SettlementTimelineYear } from '@/schemas/settlement-timeline-year'
import { Wanderer } from '@/schemas/wanderer'

/**
 * Campaign Template
 *
 * Base information used to create a new settlement using a campaign template.
 */
export type CampaignTemplate = {
  /** Collective Cognition Rewards */
  ccRewards: SettlementCollectiveCognitionReward[]
  /** Innovations */
  innovations: string[]
  /** Locations */
  locations: SettlementLocation[]
  /** Milestones */
  milestones: SettlementMilestone[]
  /** Nemesis IDs */
  nemeses: NemesisMonsterData[]
  /** Principles */
  principles: SettlementPrinciple[]
  /** Quarry IDs */
  quarries: QuarryMonsterData[]
  /** Settlement Timeline */
  timeline: SettlementTimelineYear[]
  /** Wanderers */
  wanderers: Wanderer[]
}
