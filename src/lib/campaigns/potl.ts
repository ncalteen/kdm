'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { MonsterNode } from '@/lib/enums'
import { CampaignData } from '@/lib/types'

/**
 * People of the Lantern Campaign Data
 */
export const PeopleOfTheLanternCampaignData: CampaignData = {
  ccRewards: [
    {
      name: 'Facets of Existence',
      cc: 1,
      unlocked: false
    },
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
      name: 'White Lion Cuisine',
      cc: 6,
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
      name: 'Screaming Antelope Cuisine',
      cc: 16,
      unlocked: false
    },
    {
      name: 'Metabolic Improvements',
      cc: 21,
      unlocked: false
    },
    {
      name: 'Phoenix Cuisine',
      cc: 26,
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
  ],
  innovations: ['Language'],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Catarium', unlocked: false },
    { name: 'Exhausted Lantern Hoard', unlocked: false },
    { name: 'Lantern Hoard', unlocked: true },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Plumery', unlocked: false },
    { name: 'Skinnery', unlocked: false },
    { name: 'Stone Circle', unlocked: false },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    ...CoreMilestones,
    {
      name: 'Settlement has 5 innovations',
      complete: false,
      event: 'Hooded Knight'
    }
  ],
  nemeses: [
    {
      name: 'Butcher',
      level1: false,
      level2: false,
      level3: false,
      unlocked: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    },
    {
      name: "King's Man",
      level1: false,
      level2: false,
      level3: false,
      unlocked: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    },

    {
      name: 'The Hand',
      level1: false,
      level2: false,
      level3: false,
      unlocked: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    }
  ],
  principles: [
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
  ],
  quarries: [
    {
      name: 'White Lion',
      node: MonsterNode.NQ1,
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Screaming Antelope',
      node: MonsterNode.NQ2,
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Phoenix',
      node: MonsterNode.NQ3,
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }
  ],
  timeline: [
    { completed: false, entries: ['White Lion'] },
    { completed: false, entries: ['First Day', 'Returning Survivors'] },
    { completed: false, entries: ['Endless Screams'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 1'] },
    { completed: false, entries: ['Hands of Heat'] },
    { completed: false, entries: ['Armored Strangers'] },
    { completed: false, entries: ['Phoenix Feather'] },
    { completed: false, entries: [] },
    { completed: false, entries: ["Nemesis Encounter - King's Man Lvl 1"] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Regal Visit'] },
    { completed: false, entries: ['Principle: Conviction'] },
    { completed: false, entries: ['Nemesis Encounter - The Hand Lvl 1'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 2'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ["Nemesis Encounter - King's Man Lvl 2"] },
    { completed: false, entries: ['Watched'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 3'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Watcher'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ["Nemesis Encounter - King's Man Lvl 3"] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Gold Smoke Knight'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] }
  ]
}
