'use client'

import {
  CoreCCRewards,
  CoreMilestones,
  CorePrinciples
} from '@/lib/campaigns/common'
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
    ...CoreCCRewards
  ],
  innovations: [],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Forum', unlocked: false },
    { name: 'Keeper of Dreams', unlocked: true },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Skinnery', unlocked: false },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    ...CoreMilestones,
    {
      name: 'First child is born',
      complete: false,
      event: 'Principle: New Life'
    },
    {
      name: 'First survivor to reach 3 understanding',
      complete: false,
      event: 'Designs & Dandelions'
    }
  ],
  nemeses: [ATNAS, BUTCHER, GAMBLER, GODHAND, HAND],
  principles: [...CorePrinciples],
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
