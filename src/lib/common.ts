import {
  CcNemesisVictory,
  CcQuarryVictory,
  Milestone,
  TimelineEvent
} from './types'

/**
 * Empty Timeline
 */
export const EmptyTimeline: TimelineEvent[] = Array(40).fill({
  completed: false,
  entries: []
})

/**
 * Squires of the Citadel Timeline
 */
export const SquiresTimeline: TimelineEvent[] = [
  { completed: false, entries: ['The Feral Guardian'] },
  { completed: false, entries: ['Mountain Lion'] },
  { completed: false, entries: ['The Quest'] },
  { completed: false, entries: ['Glimpse into the Future'] },
  { completed: false, entries: ['Secrets, Secrets'] }
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
 * People of the Lantern Campaign Milestones
 */
export const PotLMilestones: Milestone[] = [
  ...CoreMilestones,
  {
    name: 'Settlement has 5 innovations',
    complete: false,
    event: 'Hooded Knight'
  }
]

/**
 * People of the Dream Keeper Campaign Milestones
 */
export const PotDKMilestones: Milestone[] = [
  ...CoreMilestones,
  {
    name: 'First survivor to reach 3 understanding',
    complete: false,
    event: 'Designs & Dandelions'
  }
]

/**
 * People of the Stars Campaign Milestones
 */
export const PotStarsMilestones: Milestone[] = [...CoreMilestones]

/**
 * People of the Sun Campaign Milestones
 */
export const PotSunMilestones: Milestone[] = [
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
]

/**
 * Default Collective Cognition Quarry Victories
 */
export const DefaultCcQuarryVictories: CcQuarryVictory[] = [
  {
    name: '',
    prologue: false,
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  },
  {
    name: '',
    level1: false,
    level2: [false, false],
    level3: [false, false, false]
  }
]

/**
 * Default Collective Cognition Nemesis Victories
 */
export const DefaultCcNemesisVictories: CcNemesisVictory[] = [
  {
    name: '',
    level1: false,
    level2: false,
    level3: false
  },
  {
    name: '',
    level1: false,
    level2: false,
    level3: false
  },
  {
    name: '',
    level1: false,
    level2: false,
    level3: false
  },
  {
    name: '',
    level1: false,
    level2: false,
    level3: false
  }
]

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
      { name: 'Age 2', value: '[Fighting Art] Piercer' },
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
    name: 'Owen',
    rows: [
      { name: 'Age 1', value: '-' },
      { name: 'Age 2', value: '[Fighting Art] Escape Artist' },
      {
        name: 'Age 3',
        value: '+1 strength.'
      },
      {
        name: 'Age 4',
        value: '[Story Event] Old Body, old Mind'
      },
      {
        name: 'Retired',
        value: 'The quest cannot be abandoned; you still hunt.'
      }
    ]
  },
  {
    name: 'Iola',
    rows: [
      { name: 'Age 1', value: '-' },
      { name: 'Age 2', value: '-' },
      {
        name: 'Age 3',
        value: '[Fighting Art] Feral Strength'
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

/**
 * People of the Lantern Timeline
 */
export const PotLTimeline: TimelineEvent[] = [
  { completed: false, entries: ['White Lion'] },
  { completed: false, entries: ['First Day', 'Returning Survivors'] },
  { completed: false, entries: ['Endless Screams'] },
  { completed: false, entries: [] },
  { completed: false, entries: ['Nemesis Encounter - Butcher Lvl 1'] },
  { completed: false, entries: ['Hands of heat'] },
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

/**
 * People of the Dream Keeper Timeline
 */
export const PotDKTimeline: TimelineEvent[] = [
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

/**
 * People of the Stars Timeline
 */
export const PotStarsTimeline: TimelineEvent[] = [
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

/**
 * People of the Sun Timeline
 */
export const PotSunTimeline: TimelineEvent[] = [
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
