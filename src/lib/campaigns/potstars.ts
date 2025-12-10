'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { MonsterNode } from '@/lib/enums'
import { CampaignData } from '@/lib/types'

/**
 * People of the Stars Campaign Data
 */
export const PeopleOfTheStarsCampaignData: CampaignData = {
  ccRewards: [],
  innovations: ['Dragon Speech'],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Catarium', unlocked: false },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Plumery', unlocked: false },
    { name: 'Skinnery', unlocked: false },
    { name: 'Stone Circle', unlocked: false },
    { name: 'Throne', unlocked: true },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: CoreMilestones,
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
    { completed: false, entries: ['Foundlings'] },
    { completed: false, entries: ['Endless Screams'] },
    { completed: false, entries: [] },
    {
      completed: false,
      entries: ['Nemesis Encounter - Dragon King Tyrant Lvl 1']
    },
    { completed: false, entries: ["Midnight's Children"] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Phoenix Feather'] },
    { completed: false, entries: [] },
    {
      completed: false,
      entries: ['Nemesis Encounter - Dragon King Tyrant Lvl 2']
    },
    { completed: false, entries: ['Unveil the Sky'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Principle: Conviction'] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 2'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemeis Encounter - Lvl 2'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    {
      completed: false,
      entries: ['Nemesis Encounter - Dragon King Tyrant Lvl 3']
    },
    { completed: false, entries: ["The Dragon's Tomb"] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Nemeis Encounter - Lvl 3'] },
    { completed: false, entries: [] },
    {
      completed: false,
      entries: ['Nemesis Encounter - Death of the Dragon King']
    },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
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
