'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { BUTCHER } from '@/lib/monsters/butcher'
import { GOLD_SMOKE_KNIGHT } from '@/lib/monsters/gold-smoke-knight'
import { HAND } from '@/lib/monsters/hand'
import { KINGS_MAN } from '@/lib/monsters/kings-man'
import { PHOENIX } from '@/lib/monsters/phoenix'
import { SCREAMING_ANTELOPE } from '@/lib/monsters/screaming-antelope'
import { WATCHER } from '@/lib/monsters/watcher'
import { WHITE_LION } from '@/lib/monsters/white-lion'
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
  nemeses: [BUTCHER, KINGS_MAN, HAND, WATCHER, GOLD_SMOKE_KNIGHT],
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
  quarries: [WHITE_LION, SCREAMING_ANTELOPE, PHOENIX],
  timeline: [
    // Year 0 (Prologue)
    { completed: false, entries: [] },
    // Year 1
    { completed: false, entries: ['First Day', 'Returning Survivors'] },
    // Year 2
    { completed: false, entries: [] },
    // Year 3
    { completed: false, entries: [] },
    // Year 4
    { completed: false, entries: [] },
    // Year 5
    { completed: false, entries: ['Hands of Heat'] },
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
    { completed: false, entries: [] },
    // Year 12
    { completed: false, entries: ['Principle: Conviction'] },
    // Year 13
    { completed: false, entries: [] },
    // Year 14
    { completed: false, entries: [] },
    // Year 15
    { completed: false, entries: [] },
    // Year 16
    { completed: false, entries: [] },
    // Year 17
    { completed: false, entries: [] },
    // Year 18
    { completed: false, entries: [] },
    // Year 19
    { completed: false, entries: [] },
    // Year 20
    { completed: false, entries: [] },
    // Year 21
    { completed: false, entries: [] },
    // Year 22
    { completed: false, entries: [] },
    // Year 23
    { completed: false, entries: [] },
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
