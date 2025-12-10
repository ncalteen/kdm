'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { MonsterNode } from '@/lib/enums'
import { CampaignData } from '@/lib/types'

/**
 * People of the Dream Keeper Campaign Data
 */
export const PeopleOfTheDreamKeeperCampaignData: CampaignData = {
  ccRewards: [
    {
      name: 'Facets of Power',
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
      name: 'Crimson Crocodile Cuisine',
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
      name: 'Smog Singer Cuisine',
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
      name: 'King Cuisine',
      cc: 36,
      unlocked: false
    },
    {
      name: 'Culinary Ingenuity',
      cc: 46,
      unlocked: false
    }
  ],
  innovations: [],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Chorusseum', unlocked: false },
    { name: 'Crimson Crockery', unlocked: false },
    { name: 'Forum', unlocked: false },
    { name: 'Keeper of Dreams', unlocked: true },
    { name: 'Kingsmith', unlocked: false },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Outskirts', unlocked: false },
    { name: 'Plumery', unlocked: false },
    { name: 'Skinnery', unlocked: false },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    ...CoreMilestones,
    {
      name: 'First survivor to reach 3 understanding',
      complete: false,
      event: 'Designs & Dandelions'
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
      name: 'Atnas',
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
      name: 'Crimson Crocodile',
      node: MonsterNode.NQ1,
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Smog Singers',
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
    },
    {
      name: 'The King',
      node: MonsterNode.NQ4,
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }
  ],
  timeline: [
    { completed: false, entries: ['Crimson Crocodile'] },
    {
      completed: false,
      entries: [
        'First Crimson Day',
        'Dreamless Respite',
        'First Meal',
        'Extinguished Guidepost'
      ]
    },
    { completed: false, entries: ['Death of Song'] },
    { completed: false, entries: ['Missing Statue'] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 1'] },
    { completed: false, entries: ['Stained'] },
    { completed: false, entries: ['Unwanted Gifts'] },
    { completed: false, entries: ['Phoenix Feather'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Atnas Lvl 1'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['The Game'] },
    { completed: false, entries: ['Principle: Conviction'] },
    { completed: false, entries: ['Nemesis Encounter - The Hand Lvl 1'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Wondrous Design'] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 2'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Atnas Lvl 2'] },
    { completed: false, entries: [] },
    {
      completed: false,
      entries: ['Perfect Punt', 'Nemesis Encounter - The Gambler']
    },
    { completed: false, entries: ['Lantern Festival'] },
    { completed: false, entries: ['The Awaited'] },
    {
      completed: false,
      entries: ['Wanderer - Luck', 'Nemesis Encounter - Butcher Lvl 3']
    },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Atnas Lvl 3'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemesis Encounter - Godhand'] },
    { completed: false, entries: [] },
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
