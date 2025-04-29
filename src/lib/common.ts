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
    name: 'Lola',
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
