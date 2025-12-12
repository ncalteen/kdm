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
import { GREAT_DEVOURER } from '@/lib/monsters/sunstalker'
import { WHITE_LION } from '@/lib/monsters/white-lion'
import { CampaignData } from '@/lib/types'

/**
 * People of the Sun Campaign Data
 */
export const PeopleOfTheSunCampaignData: CampaignData = {
  ccRewards: [
    {
      name: 'Facets of Existence',
      cc: 1,
      unlocked: false
    },
    ...CoreCCRewards
  ],
  innovations: ['Language'],
  locations: [
    { name: 'Barber Surgeon', unlocked: false },
    { name: 'Blacksmith', unlocked: false },
    { name: 'Bone Smith', unlocked: false },
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Sacred Pool', unlocked: true },
    { name: 'Skinnery', unlocked: false },
    { name: 'The Sun', unlocked: true },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    ...CoreMilestones,
    {
      name: 'Settlement has 8 innovations',
      complete: false,
      event: 'Edged Tonometry'
    },
    {
      name: 'Not Victorious against Nemesis',
      complete: false,
      event: 'Game Over'
    }
  ],
  nemeses: [BUTCHER, GREAT_DEVOURER, HAND, KINGS_MAN],
  principles: [...CorePrinciples],
  quarries: [WHITE_LION, SCREAMING_ANTELOPE, PHOENIX],
  timeline: [
    // Year 0 (Prologue)
    { completed: false, entries: [] },
    // Year 1
    { completed: false, entries: ['The Pool and the Sun'] },
    // Year 2
    { completed: false, entries: [] },
    // Year 3
    { completed: false, entries: [] },
    // Year 4
    { completed: false, entries: ['Sun Dipping'] },
    // Year 5
    { completed: false, entries: ['The Great Sky Gift'] },
    // Year 6
    { completed: false, entries: [] },
    // Year 7
    { completed: false, entries: [] },
    // Year 8
    { completed: false, entries: [] },
    // Year 9
    { completed: false, entries: [] },
    // Year 10
    { completed: false, entries: ['Birth of Color'] },
    // Year 11
    { completed: false, entries: ['Principle: Conviction'] },
    // Year 12
    { completed: false, entries: ['Sun Dipping'] },
    // Year 13
    { completed: false, entries: ['The Great Sky Gift'] },
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
    { completed: false, entries: ['Sun Dipping'] },
    // Year 20
    { completed: false, entries: ['Final Gift'] },
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
