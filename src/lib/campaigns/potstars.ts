'use client'

import {
  CoreCCRewards,
  CoreMilestones,
  CorePrinciples
} from '@/lib/campaigns/common'
import { BUTCHER } from '@/lib/monsters/butcher'
import { HAND } from '@/lib/monsters/hand'
import { KINGS_MAN } from '@/lib/monsters/kings-man'
import { PHOENIX } from '@/lib/monsters/phoenix'
import { SCREAMING_ANTELOPE } from '@/lib/monsters/screaming-antelope'
import { TYRANT } from '@/lib/monsters/tyrant'
import { WHITE_LION } from '@/lib/monsters/white-lion'
import { CampaignData } from '@/lib/types'

/**
 * People of the Stars Campaign Data
 */
export const PeopleOfTheStarsCampaignData: CampaignData = {
  ccRewards: [
    {
      name: 'Facets of Existence',
      cc: 1,
      unlocked: false
    },
    ...CoreCCRewards
  ],
  innovations: ['Dragon Speech'],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Skinnery', unlocked: false },
    { name: 'Throne', unlocked: true },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    ...CoreMilestones,
    {
      name: 'First child is born',
      complete: false,
      event: 'Principle: New Life'
    }
  ],
  nemeses: [BUTCHER, KINGS_MAN, HAND, TYRANT],
  principles: [...CorePrinciples],
  quarries: [WHITE_LION, SCREAMING_ANTELOPE, PHOENIX],
  timeline: [
    // Year 0 (Prologue)
    { completed: false, entries: [] },
    // Year 1
    { completed: false, entries: ['Foundlings'] },
    // Year 2
    { completed: false, entries: [] },
    // Year 3
    {
      completed: false,
      entries: []
    },
    // Year 4
    { completed: false, entries: [] },
    // Year 5
    { completed: false, entries: ["Midnight's Children"] },
    // Year 6
    { completed: false, entries: [] },
    // Year 7
    { completed: false, entries: [] },
    // Year 8
    {
      completed: false,
      entries: []
    },
    // Year 9
    { completed: false, entries: [] },
    // Year 10
    { completed: false, entries: ['Unveil the Sky'] },
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
    {
      completed: false,
      entries: []
    },
    // Year 19
    { completed: false, entries: [] },
    // Year 20
    { completed: false, entries: ["The Dragon's Tomb"] },
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
