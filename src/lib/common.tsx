'use client'

import { CampaignData } from '@/lib/types'
import { Milestone } from '@/schemas/settlement'
import { GrabIcon, ScrollIcon } from 'lucide-react'

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
    name: 'First child is born',
    complete: false,
    event: 'Principle: New Life'
  },
  {
    name: 'First time death count is updated',
    complete: false,
    event: 'Principle: Death'
  }
]

/**
 * Custom Campaign Data
 */
export const CustomCampaignData: CampaignData = {
  ccRewards: [],
  innovations: [],
  locations: [],
  milestones: CoreMilestones,
  nemeses: [],
  principles: [],
  quarries: [],
  timeline: Array(40).fill({
    completed: false,
    entries: []
  })
}

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
      node: 'Node 1',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Screaming Antelope',
      node: 'Node 2',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Phoenix',
      node: 'Node 3',
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
      node: 'Node 1',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Smog Singers',
      node: 'Node 2',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Phoenix',
      node: 'Node 3',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'The King',
      node: 'Node 4',
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
      node: 'Node 1',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Screaming Antelope',
      node: 'Node 2',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Phoenix',
      node: 'Node 3',
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
    { name: 'Leather Worker', unlocked: false },
    { name: 'Mask Maker', unlocked: false },
    { name: 'Organ Grinder', unlocked: false },
    { name: 'Plumery', unlocked: false },
    { name: 'Sacred Pool', unlocked: true },
    { name: 'Skinnery', unlocked: false },
    { name: 'Stone Circle', unlocked: false },
    { name: 'The Sun', unlocked: true },
    { name: 'Weapon Crafter', unlocked: false }
  ],
  milestones: [
    {
      name: 'First time death count is updated',
      complete: false,
      event: 'Principle: Death'
    },
    {
      name: 'Population reaches 15',
      complete: false,
      event: 'Principle: Society'
    },
    {
      name: 'Settlement has 8 innovations',
      complete: false,
      event: 'Edged Tonometry'
    },
    {
      name: 'Population reaches 0',
      complete: false,
      event: 'Game Over'
    },
    {
      name: 'Not Victorious against Nemesis',
      complete: false,
      event: 'Game Over'
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
      option2Selected: true
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
      node: 'Node 1',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Screaming Antelope',
      node: 'Node 2',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    },
    {
      name: 'Phoenix',
      node: 'Node 3',
      unlocked: false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }
  ],
  timeline: [
    { completed: false, entries: ['The Pool and the Sun'] },
    { completed: false, entries: ['Endless Screams'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Sun Dipping'] },
    { completed: false, entries: ['The Great Sky Gift'] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Phoenix Feather'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Birth of Color'] },
    { completed: false, entries: ['Principle: Conviction'] },
    { completed: false, entries: ['Sun Dipping'] },
    { completed: false, entries: ['The Great Sky Gift'] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: [] },
    { completed: false, entries: ['Sun Dipping'] },
    { completed: false, entries: ['Final Gift'] },
    { completed: false, entries: ["Nemesis Encounter - King's Man Lvl 2"] },
    { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 3'] },
    { completed: false, entries: ["Nemesis Encounter - King's Man Lvl 3"] },
    { completed: false, entries: ['Nemesis Encounter - The Hand Lvl 3'] },
    { completed: false, entries: ['Nemesis Encounter - The Great Devourer'] },
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

/**
 * Squires of the Citadel Campaign Data
 */
export const SquiresOfTheCitadelCampaignData: CampaignData = {
  ccRewards: [],
  innovations: [],
  locations: [],
  milestones: [],
  nemeses: [],
  principles: [],
  quarries: [],
  timeline: [
    { completed: false, entries: ['The Feral Guardian'] },
    { completed: false, entries: ['Mountain Lion'] },
    { completed: false, entries: ['The Quest'] },
    { completed: false, entries: ['Glimpse into the Future'] },
    { completed: false, entries: ['Secrets, Secrets'] }
  ]
}

/**
 * Squire Card Data
 */
export const SquireCardData = [
  {
    name: 'Squire Cain',
    rows: [
      { name: 'Age 1', value: '-' },
      { name: 'Age 2', value: '-' },
      {
        name: 'Age 3',
        value: '+3 grand or +3 sword weapon proficiency levels.'
      },
      {
        name: 'Age 4',
        value:
          'Cain is older than he lets on. Suffer -2 strength and -1 evasion.'
      },
      {
        name: 'Retired',
        value: 'The quest cannot be abandoned; you still hunt.'
      }
    ]
  },
  {
    name: 'Squire Elle',
    rows: [
      { name: 'Age 1', value: '-' },
      {
        name: 'Age 2',
        value: (
          <span className="flex items-center">
            <GrabIcon className="h-4 w-4" />
            &nbsp; Piercer
          </span>
        )
      },
      {
        name: 'Age 3',
        value: '+3 weapon proficiency levels in any weapon type.'
      },
      {
        name: 'Age 4',
        value: '[Story] Black Roots'
      },
      {
        name: 'Retired',
        value: 'The quest cannot be abandoned; you still hunt.'
      }
    ]
  },
  {
    name: 'Squire Owen',
    rows: [
      { name: 'Age 1', value: '-' },
      {
        name: 'Age 2',
        value: (
          <span className="flex items-center">
            <GrabIcon className="h-4 w-4" />
            &nbsp; Escape Artist
          </span>
        )
      },
      {
        name: 'Age 3',
        value: '+1 strength.'
      },
      {
        name: 'Age 4',
        value: (
          <span className="flex items-center">
            <ScrollIcon className="h-4 w-4" />
            &nbsp; Old Body, Old Mind
          </span>
        )
      },
      {
        name: 'Retired',
        value: 'The quest cannot be abandoned; you still hunt.'
      }
    ]
  },
  {
    name: 'Squire Iola',
    rows: [
      { name: 'Age 1', value: '-' },
      { name: 'Age 2', value: '-' },
      {
        name: 'Age 3',
        value: (
          <span className="flex items-center">
            <GrabIcon className="h-4 w-4" />
            &nbsp; Feral Strength
          </span>
        )
      },
      {
        name: 'Age 4',
        value: '+3 club weapon proficiency levels.'
      },
      {
        name: 'Retired',
        value: 'The quest cannot be abandoned; you still hunt.'
      }
    ]
  }
]

/**
 * Default Squires of the Citadel Suspicion
 */
export const DefaultSquiresSuspicion = [
  {
    name: 'Cain',
    level1: false,
    level2: false,
    level3: false,
    level4: false
  },
  {
    name: 'Elle',
    level1: false,
    level2: false,
    level3: false,
    level4: false
  },
  {
    name: 'Iola',
    level1: false,
    level2: false,
    level3: false,
    level4: false
  },
  {
    name: 'Owen',
    level1: false,
    level2: false,
    level3: false,
    level4: false
  }
]
