'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { ATNAS } from '@/lib/monsters/atnas'
import { BUTCHER } from '@/lib/monsters/butcher'
import { CRIMSON_CROCODILE } from '@/lib/monsters/crimson-crocodile'
import { GAMBLER } from '@/lib/monsters/gambler'
import { GODHAND } from '@/lib/monsters/godhand'
import { HAND } from '@/lib/monsters/hand'
import { KING } from '@/lib/monsters/king'
import { PHOENIX } from '@/lib/monsters/phoenix'
import { SMOG_SINGERS } from '@/lib/monsters/smog-singers'
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
  nemeses: [ATNAS, BUTCHER, GAMBLER, GODHAND, HAND],
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
  quarries: [CRIMSON_CROCODILE, KING, PHOENIX, SMOG_SINGERS],
  timeline: [
    // Year 0 (Prologue)
    { completed: false, entries: [] },
    // Year 1
    {
      completed: false,
      entries: [
        'First Crimson Day',
        'Dreamless Respite',
        'First Meal',
        'Extinguished Guidepost'
      ]
    },
    // Year 2
    { completed: false, entries: [] },
    // Year 3
    { completed: false, entries: ['Missing Statue'] },
    // Year 4
    { completed: false, entries: [] },
    // Year 5
    { completed: false, entries: ['Stained'] },
    // Year 6
    { completed: false, entries: [] },
    // Year 7
    { completed: false, entries: [] },
    // Year 8
    { completed: false, entries: [] },
    // Year 9
    { completed: false, entries: [] },
    // Year 10
    { completed: false, entries: [] },
    // Year 11
    { completed: false, entries: ['The Game'] },
    // Year 12
    { completed: false, entries: ['Principle: Conviction'] },
    // Year 13
    { completed: false, entries: [] },
    // Year 14
    { completed: false, entries: [] },
    // Year 15
    { completed: false, entries: ['Wondrous Design'] },
    // Year 16
    { completed: false, entries: [] },
    // Year 17
    { completed: false, entries: [] },
    // Year 18
    { completed: false, entries: [] },
    // Year 19
    { completed: false, entries: [] },
    // Year 20
    {
      completed: false,
      entries: ['Perfect Punt']
    },
    // Year 21
    { completed: false, entries: ['Lantern Festival'] },
    // Year 22
    { completed: false, entries: [] },
    // Year 23
    {
      completed: false,
      entries: ['Wanderer - Luck']
    },
    // Year 24
    { completed: false, entries: [] },
    // Year 25
    { completed: false, entries: [] },
    // Year 26
    { completed: false, entries: [] },
    // Year 27
    { completed: false, entries: [] },
    // Year 28
    { completed: false, entries: [] },
    // Year 29
    { completed: false, entries: [] },
    // Year 30
    { completed: false, entries: [] },
    // Year 31
    { completed: false, entries: [] },
    // Year 32
    { completed: false, entries: [] },
    // Year 33
    { completed: false, entries: [] },
    // Year 34
    { completed: false, entries: [] },
    // Year 35
    { completed: false, entries: [] },
    // Year 36
    { completed: false, entries: [] },
    // Year 37
    { completed: false, entries: [] },
    // Year 38
    { completed: false, entries: [] },
    // Year 39
    { completed: false, entries: [] },
    // Year 40
    { completed: false, entries: [] }
  ]
}
