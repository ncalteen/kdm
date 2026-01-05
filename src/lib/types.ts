'use client'

import { MonsterNode, MonsterType } from '@/lib/enums'
import {
  AlternateMonsterData,
  MonsterTimelineEntry,
  NemesisMonsterData,
  NemesisMonsterLevel,
  QuarryMonsterData,
  QuarryMonsterLevel,
  VignetteMonsterData
} from '@/schemas/monster'
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

/**
 * Monster Map Type
 */
export type MonsterMap = {
  [key: string]: {
    /** Monster Name */
    name: string
    /** Monster Node */
    node: MonsterNode
    /** Monster Type */
    type: MonsterType
    /** Level 1 Data */
    level1?: (NemesisMonsterLevel | QuarryMonsterLevel)[]
    /** Level 2 Data */
    level2?: (NemesisMonsterLevel | QuarryMonsterLevel)[]
    /** Level 3 Data */
    level3?: (NemesisMonsterLevel | QuarryMonsterLevel)[]
    /** Level 4 Data */
    level4?: (NemesisMonsterLevel | QuarryMonsterLevel)[]
    /** Timeline Entries */
    timeline: MonsterTimelineEntry
    /** Alternate Monster Data */
    alternate?: AlternateMonsterData
    /** Vignette Monster Data */
    vignette?: VignetteMonsterData
  }
}
