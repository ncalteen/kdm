'use client'

import {
  CampaignType,
  HuntEventType,
  MonsterNode,
  MonsterType
} from '@/lib/enums'
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
 * Campaign Data
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
  nemeses: NemesisMonsterData[]
  /** Principles */
  principles: Principle[]
  /** Quarries */
  quarries: QuarryMonsterData[]
  /** Settlement Timeline */
  timeline: TimelineYear[]
}

/**
 * Base Monster Data (per Level)
 */
export type BaseMonsterLevelData = {
  /** Accuracy */
  accuracy: number
  /** Accuracy Tokens */
  accuracyTokens: number
  /** AI Deck */
  aiDeck: {
    /** Basic Card Count */
    basic: number
    /** Advanced Card Count */
    advanced: number
    /** Legendary Card Count */
    legendary: number
    /** Overtone Card Count */
    overtone?: number
  }
  /** Damage */
  damage: number
  /** Damage Tokens */
  damageTokens: number
  /** Evasion */
  evasion: number
  /** Evasion Tokens */
  evasionTokens: number
  /** Luck */
  luck: number
  /** Luck Tokens */
  luckTokens: number
  /** Moods */
  moods: string[]
  /** Movement */
  movement: number
  /** Movement Tokens */
  movementTokens: number
  /** Speed */
  speed: number
  /** Speed Tokens */
  speedTokens: number
  /** Strength */
  strength: number
  /** Strength Tokens */
  strengthTokens: number
  /** Survivor Statuses */
  survivorStatuses: string[]
  /** Toughness */
  toughness: number
  /** Toughness Tokens */
  toughnessTokens: number
  /** Traits */
  traits: string[]
}

/**
 * Quarry Monster Data (per Level)
 */
export type QuarryMonsterLevelData = BaseMonsterLevelData & {
  /** Monster Hunt Board Starting Position */
  huntPos: number
  /** Survivor Hunt Board Starting Position */
  survivorHuntPos?: number
}

/**
 * Nemesis Monster Data (per Level)
 */
export type NemesisMonsterLevelData = BaseMonsterLevelData & {
  /** Life */
  life?: number
}

/**
 * Nemesis Monster Data
 */
export type NemesisMonsterData = {
  /** Monster Name */
  name: string
  /** Monster Node */
  node: MonsterNode
  /** Monster Type */
  type: MonsterType.NEMESIS
  /** Level 1 Data */
  level1?: NemesisMonsterLevelData
  /** Level 2 Data */
  level2?: NemesisMonsterLevelData
  /** Level 3 Data */
  level3?: NemesisMonsterLevelData
  /** Level 4 Data */
  level4?: NemesisMonsterLevelData
  /** Timeline Entries */
  timeline: {
    [key: number]: (string | { title: string; campaigns: CampaignType[] })[]
  }
}

/**
 * Quarry Monster Data
 */
export type QuarryMonsterData = {
  /** Collective Cognition Rewards */
  ccRewards: CollectiveCognitionReward[]
  /** Hunt Board Configuration */
  huntBoard: {
    [key: number]: HuntEventType.BASIC | HuntEventType.MONSTER | undefined
  }
  /** Monster Name */
  name: string
  /** Monster Node */
  node: MonsterNode
  /** Prologue Monster */
  prologue: boolean
  /** Monster Type */
  type: MonsterType.QUARRY
  /** Level 1 Data */
  level1?: QuarryMonsterLevelData
  /** Level 2 Data */
  level2?: QuarryMonsterLevelData
  /** Level 3 Data */
  level3?: QuarryMonsterLevelData
  /** Level 4 Data */
  level4?: QuarryMonsterLevelData
  /** Locations */
  locations: Location[]
  /** Timeline Entries */
  timeline: {
    [key: number]: (string | { title: string; campaigns: CampaignType[] })[]
  }
}
