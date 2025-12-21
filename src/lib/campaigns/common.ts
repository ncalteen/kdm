'use client'

import {
  CollectiveCognitionReward,
  Location,
  Milestone,
  Principle
} from '@/schemas/settlement'

/**
 * Core Collective Cognition Rewards
 */
export const CoreCCRewards: CollectiveCognitionReward[] = [
  {
    name: 'Pleasing Plating',
    cc: 2,
    unlocked: false
  },
  {
    name: 'Comprehensive Construction',
    cc: 5,
    unlocked: false
  },
  {
    name: 'Communal Larder',
    cc: 8,
    unlocked: false
  },
  {
    name: 'Sated Enlightenment',
    cc: 13,
    unlocked: false
  },
  {
    name: 'Metabolic Improvements',
    cc: 21,
    unlocked: false
  },
  {
    name: 'Shared Illumination',
    cc: 30,
    unlocked: false
  },
  {
    name: 'Culinary Ingenuity',
    cc: 46,
    unlocked: false
  }
]

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
    name: 'First time death count is updated',
    complete: false,
    event: 'Principle: Death'
  }
]

/**
 * Core Campaign Principles
 */
export const CorePrinciples: Principle[] = [
  {
    name: 'New Life',
    option1Name: 'Protect the Young',
    option1Selected: false,
    option2Name: 'Survival of the Fittest',
    option2Selected: false
  },
  {
    name: 'Death',
    option1Name: 'Graves',
    option1Selected: false,
    option2Name: 'Cannibalize',
    option2Selected: false
  },
  {
    name: 'Society',
    option1Name: 'Collective Toil',
    option1Selected: false,
    option2Name: 'Accept Darkness',
    option2Selected: false
  },
  {
    name: 'Conviction',
    option1Name: 'Romantic',
    option1Selected: false,
    option2Name: 'Barbaric',
    option2Selected: false
  }
]

/**
 * Scout Campaign Data
 */
export const ScoutCampaignData: {
  locations: Location[]
} = {
  locations: [{ name: 'Outskirts', unlocked: false }]
}
