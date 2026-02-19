'use client'

import { CustomCampaign } from '@/lib/campaigns/custom'
import { PeopleOfTheDreamKeeper } from '@/lib/campaigns/potdk'
import { PeopleOfTheLantern } from '@/lib/campaigns/potl'
import { PeopleOfTheStars } from '@/lib/campaigns/potstars'
import { PeopleOfTheSun } from '@/lib/campaigns/potsun'
import {
  AmbushType,
  CampaignType,
  ColorChoice,
  Gender,
  HuntEventType,
  MonsterLevel,
  MonsterNode,
  MonsterType,
  Philosophy,
  ResourceCategory,
  ResourceType,
  SurvivorType,
  TabType,
  TurnType,
  WeaponType
} from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { saveCampaignToLocalStorage } from '@/lib/utils'
import { WANDERERS } from '@/lib/wanderers'
import type { Campaign } from '@/schemas/campaign'
import type { Hunt } from '@/schemas/hunt'
import {
  NemesisMonsterLevel,
  QuarryMonsterLevel
} from '@/schemas/monster-level'
import type { MonsterTimelineEntry } from '@/schemas/monster-timeline-entry'
import type { Settlement } from '@/schemas/settlement'
import type { SettlementTimelineYear } from '@/schemas/settlement-timeline-year'
import type { Showdown } from '@/schemas/showdown'
import type { Survivor } from '@/schemas/survivor'
import packageJson from '../../package.json'
import { basicHuntBoard } from './common'

/**
 * Seed Quarries by Campaign Type
 */
const quarryMap = {
  [CampaignType.PEOPLE_OF_THE_LANTERN]: QUARRIES.WHITE_LION,
  [CampaignType.PEOPLE_OF_THE_SUN]: QUARRIES.WHITE_LION,
  [CampaignType.PEOPLE_OF_THE_STARS]: QUARRIES.WHITE_LION,
  [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: QUARRIES.CRIMSON_CROCODILE,
  [CampaignType.CUSTOM]: QUARRIES.WHITE_LION
}

/**
 * Seed Nemeses by Campaign Type
 */
const nemesisMap = {
  [CampaignType.PEOPLE_OF_THE_LANTERN]: NEMESES.BUTCHER,
  [CampaignType.PEOPLE_OF_THE_SUN]: NEMESES.BUTCHER,
  [CampaignType.PEOPLE_OF_THE_STARS]: NEMESES.BUTCHER,
  [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: NEMESES.ATNAS,
  [CampaignType.CUSTOM]: NEMESES.BUTCHER
}

/**
 * Add Monster Timeline Entries to Settlement Timeline.
 *
 * @param timeline Timeline
 * @param monsterTimeline Monster Timeline Entries
 * @param campaignType Campaign Type
 */
function addMonsterTimelineEntries(
  timeline: SettlementTimelineYear[],
  monsterTimeline: MonsterTimelineEntry,
  campaignType: CampaignType
) {
  for (const [yearStr, entries] of Object.entries(monsterTimeline)) {
    const year = Number(yearStr)

    if (year >= 0 && year < timeline.length && entries)
      for (const entry of entries) {
        if (typeof entry === 'string') {
          if (!timeline[year].entries.includes(entry))
            timeline[year].entries.push(entry)
        } else if (entry.campaigns.includes(campaignType)) {
          if (!timeline[year].entries.includes(entry.title))
            timeline[year].entries.push(entry.title)
        }
      }
  }
}

/**
 * Generate Seed Data
 *
 * Creates comprehensive test data including multiple campaigns of each type
 * with settlements, survivors, hunts, and showdowns in various states.
 */
export function generateSeedData() {
  let settlementIdCounter = 1
  let survivorIdCounter = 1
  let huntIdCounter = 1
  let showdownIdCounter = 1

  const settlements: Settlement[] = []
  const survivors: Survivor[] = []
  const hunts: Hunt[] = []
  const showdowns: Showdown[] = []

  // People of the Lantern Campaigns
  for (let i = 0; i < 2; i++) {
    const settlement = createPeopleOfTheLanternSettlement(
      settlementIdCounter++,
      i + 1
    )
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      10 + i * 3
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to even numbered settlements
    if (i % 2 === 0)
      hunts.push(
        createHunt(
          CampaignType.PEOPLE_OF_THE_LANTERN,
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )

    // Add showdown to odd numbered settlements
    if (i % 2 === 1)
      showdowns.push(
        createShowdown(
          CampaignType.PEOPLE_OF_THE_LANTERN,
          showdownIdCounter++,
          i + 1 === 2 ? MonsterType.NEMESIS : MonsterType.QUARRY,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )
  }

  // People of the Sun Campaigns
  for (let i = 0; i < 2; i++) {
    const settlement = createPeopleOfTheSunSettlement(
      settlementIdCounter++,
      i + 1
    )
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      10 + i * 3
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to even numbered settlements
    if (i % 2 === 0)
      hunts.push(
        createHunt(
          CampaignType.PEOPLE_OF_THE_SUN,
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )

    // Add showdown to odd numbered settlements
    if (i % 2 === 1)
      showdowns.push(
        createShowdown(
          CampaignType.PEOPLE_OF_THE_SUN,
          showdownIdCounter++,
          i + 1 === 2 ? MonsterType.NEMESIS : MonsterType.QUARRY,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )
  }

  // People of the Stars Campaigns
  for (let i = 0; i < 2; i++) {
    const settlement = createPeopleOfTheStarsSettlement(
      settlementIdCounter++,
      i + 1
    )
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      10 + i * 3
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to even numbered settlements
    if (i % 2 === 0)
      hunts.push(
        createHunt(
          CampaignType.PEOPLE_OF_THE_STARS,
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )

    // Add showdown to odd numbered settlements
    if (i % 2 === 1)
      showdowns.push(
        createShowdown(
          CampaignType.PEOPLE_OF_THE_STARS,
          showdownIdCounter++,
          i + 1 === 2 ? MonsterType.NEMESIS : MonsterType.QUARRY,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )
  }

  // People of the Dream Keeper Campaigns
  for (let i = 0; i < 2; i++) {
    const settlement = createPeopleOfTheDreamKeeperSettlement(
      settlementIdCounter++,
      i + 1
    )
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      10 + i * 3
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to even numbered settlements
    if (i % 2 === 0)
      hunts.push(
        createHunt(
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )

    // Add showdown to odd numbered settlements
    if (i % 2 === 1)
      showdowns.push(
        createShowdown(
          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
          showdownIdCounter++,
          i + 1 === 2 ? MonsterType.NEMESIS : MonsterType.QUARRY,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )
  }

  // Custom Campaigns
  for (let i = 0; i < 3; i++) {
    const settlement = createCustomSettlement(settlementIdCounter++, i + 1)
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      10 + i * 3
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to even numbered settlements
    if (i % 2 === 0)
      hunts.push(
        createHunt(
          CampaignType.CUSTOM,
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )

    // Add showdown to odd numbered settlements
    if (i % 2 === 1)
      showdowns.push(
        createShowdown(
          CampaignType.CUSTOM,
          showdownIdCounter++,
          i + 1 === 2 ? MonsterType.NEMESIS : MonsterType.QUARRY,
          settlement.id,
          survivorIdCounter - 4,
          i + 1 === 2
        )
      )
  }

  // Create campaign object
  const campaign: Campaign = {
    customNemeses: createCustomNemeses(),
    customQuarries: createCustomQuarries(),
    hunts,
    selectedHuntId: null,
    selectedShowdownId: null,
    selectedSettlementId: null,
    selectedSurvivorId: null,
    selectedTab: TabType.TIMELINE,
    settings: {
      disableToasts: false,
      unlockedMonsters: {
        killeniumButcher: false,
        screamingNukalope: false,
        whiteGigalion: false
      }
    },
    settlementPhases: [],
    settlements,
    showdowns,
    survivors,
    version: packageJson.version
  }

  // Save to localStorage
  saveCampaignToLocalStorage(campaign)
}

/**
 * Create People of the Lantern Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 * @returns Settlement
 */
function createPeopleOfTheLanternSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  const settlement: Settlement = {
    id,
    name: `PotL ${variant}`,
    arrivalBonuses: variant === 2 ? ['+1 Survival'] : [],
    campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
    deathCount: variant * 2,
    departingBonuses: variant === 2 ? ['+3 Insanity'] : [],
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant === 2
        ? ['Cat Eye Circlet', 'Lantern Armor', 'Screaming Bracers']
        : [])
    ],
    innovations: [
      ...PeopleOfTheLantern.innovations,
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      ...PeopleOfTheLantern.locations.map((loc) => ({
        ...loc,
        unlocked: variant === 2 || loc.unlocked
      })),
      ...QUARRIES.WHITE_LION.locations,
      ...QUARRIES.SCREAMING_ANTELOPE.locations,
      ...QUARRIES.PHOENIX.locations
    ],
    lostSettlements: 0,
    milestones: [
      ...PeopleOfTheLantern.milestones.map((ms) => ({
        ...ms,
        complete: variant === 2 || ms.complete
      }))
    ],
    nemeses: [
      {
        ...NEMESES.BUTCHER,
        unlocked: true,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.KINGS_MAN,
        unlocked: false,
        level1Defeated: false,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.HAND,
        unlocked: false,
        level1Defeated: false,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.WATCHER,
        unlocked: false,
        level1Defeated: false,
        level2Defeated: false,
        level3Defeated: false,
        level4Defeated: false
      },
      {
        ...NEMESES.GOLD_SMOKE_KNIGHT,
        unlocked: false,
        level1Defeated: false,
        level2Defeated: false,
        level3Defeated: false
      }
    ],
    notes:
      variant === 1
        ? 'Early game settlement'
        : 'Mid-game settlement with multiple innovations',
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    population: 15 + variant * 5,
    principles: [
      ...PeopleOfTheLantern.principles.map((prin) => ({
        ...prin,
        option1Selected: variant === 1 ? prin.option1Selected : false,
        option2Selected: variant === 2 ? prin.option2Selected : false
      }))
    ],
    quarries: [
      {
        ...QUARRIES.WHITE_LION,
        unlocked: true
      },
      { ...QUARRIES.SCREAMING_ANTELOPE, unlocked: variant === 2 },
      { ...QUARRIES.PHOENIX, unlocked: false }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 10 + variant * 5,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Bone',
        amount: 8 + variant * 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'White Lion Claw',
        amount: 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'Iron',
        amount: 5,
        category: ResourceCategory.BASIC,
        types: [ResourceType.SCRAP]
      }
    ],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    survivalLimit: variant === 1 ? 1 : 3,
    survivorType: SurvivorType.CORE,
    timeline: PeopleOfTheLantern.timeline.map((year, index) => ({
      completed: index < lanternYear,
      entries: year.entries
    })),
    usesScouts: variant === 2,
    wanderers: [
      WANDERERS.AENAS,
      WANDERERS.CANDY_COLA,
      WANDERERS.DEATH_DRIFTER,
      WANDERERS.GOTH,
      WANDERERS.LUCK
    ],

    lanternResearchLevel: variant,
    monsterVolumes: variant === 2 ? ['White Lion Vol. 1'] : []
  }

  addMonsterTimelineEntries(
    settlement.timeline,
    quarryMap[CampaignType.PEOPLE_OF_THE_LANTERN].timeline,
    CampaignType.PEOPLE_OF_THE_LANTERN
  )
  addMonsterTimelineEntries(
    settlement.timeline,
    nemesisMap[CampaignType.PEOPLE_OF_THE_LANTERN].timeline,
    CampaignType.PEOPLE_OF_THE_LANTERN
  )

  return settlement
}

/**
 * Create People of the Sun Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 * @returns Settlement
 */
function createPeopleOfTheSunSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  const settlement: Settlement = {
    id,
    name: `PotSun ${variant}`,
    arrivalBonuses: variant === 2 ? ['+1 Survival'] : [],
    campaignType: CampaignType.PEOPLE_OF_THE_SUN,
    deathCount: variant * 3,
    departingBonuses: variant === 2 ? ['+3 Insanity'] : [],
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant === 2
        ? ['Cat Eye Circlet', 'Lantern Armor', 'Screaming Bracers']
        : [])
    ],
    innovations: [
      ...PeopleOfTheSun.innovations,
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      ...PeopleOfTheSun.locations.map((loc) => ({
        ...loc,
        unlocked: variant === 2 || loc.unlocked
      })),
      ...QUARRIES.WHITE_LION.locations,
      ...QUARRIES.SCREAMING_ANTELOPE.locations,
      ...QUARRIES.PHOENIX.locations
    ],
    lostSettlements: 0,
    milestones: [
      ...PeopleOfTheSun.milestones.map((ms) => ({
        ...ms,
        complete: variant === 2 || ms.complete
      }))
    ],
    nemeses: [
      {
        ...NEMESES.BUTCHER,
        unlocked: true,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.KINGS_MAN,
        unlocked: false,
        level1Defeated: false,
        level2Defeated: false,
        level3Defeated: false
      }
    ],
    notes: variant === 1 ? 'Focused path' : 'Exploring different innovations',
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    population: 15 + variant * 5,
    principles: [
      ...PeopleOfTheSun.principles.map((prin) => ({
        ...prin,
        option1Selected: variant === 1 ? prin.option1Selected : false,
        option2Selected: variant === 2 ? prin.option2Selected : false
      }))
    ],
    quarries: [
      { ...QUARRIES.WHITE_LION, unlocked: true },
      { ...QUARRIES.SCREAMING_ANTELOPE, unlocked: variant === 2 },
      { ...QUARRIES.PHOENIX, unlocked: false }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 15,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Organ',
        amount: 6,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.ORGAN]
      },
      {
        name: 'Love Juice',
        amount: 2,
        category: ResourceCategory.STRANGE,
        types: [ResourceType.ORGAN]
      }
    ],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    survivalLimit: variant === 1 ? 1 : 3,
    survivorType: SurvivorType.CORE,
    timeline: PeopleOfTheSun.timeline.map((year, index) => ({
      completed: index < lanternYear,
      entries: year.entries
    })),
    usesScouts: variant === 2,
    wanderers: [
      WANDERERS.AENAS,
      WANDERERS.CANDY_COLA,
      WANDERERS.DEATH_DRIFTER,
      WANDERERS.GOTH,
      WANDERERS.LUCK
    ]
  }

  addMonsterTimelineEntries(
    settlement.timeline,
    quarryMap[CampaignType.PEOPLE_OF_THE_SUN].timeline,
    CampaignType.PEOPLE_OF_THE_SUN
  )
  addMonsterTimelineEntries(
    settlement.timeline,
    nemesisMap[CampaignType.PEOPLE_OF_THE_SUN].timeline,
    CampaignType.PEOPLE_OF_THE_SUN
  )

  return settlement
}

/**
 * Create People of the Stars Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 * @returns Settlement
 */
function createPeopleOfTheStarsSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  const settlement: Settlement = {
    id,
    name: `PotStars ${variant}`,
    arrivalBonuses: variant === 2 ? ['+1 Survival'] : [],
    campaignType: CampaignType.PEOPLE_OF_THE_STARS,
    deathCount: variant * 2,
    departingBonuses: variant === 2 ? ['+3 Insanity'] : [],
    gear: ['Founding Stone'],
    innovations: [
      ...PeopleOfTheStars.innovations,
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      ...PeopleOfTheStars.locations.map((loc) => ({
        ...loc,
        unlocked: variant === 2 || loc.unlocked
      })),
      ...QUARRIES.WHITE_LION.locations,
      ...QUARRIES.SCREAMING_ANTELOPE.locations,
      ...QUARRIES.PHOENIX.locations
    ],
    lostSettlements: 0,
    milestones: [
      ...PeopleOfTheStars.milestones.map((ms) => ({
        ...ms,
        complete: variant === 2 || ms.complete
      }))
    ],
    nemeses: [
      {
        ...NEMESES.BUTCHER,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.KINGS_MAN,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.HAND,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.WATCHER,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false,
        level4Defeated: false
      },
      {
        ...NEMESES.DYING_GOD,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      }
    ],
    notes: 'Arc survivor campaign with collective cognition mechanics',
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    population: 15 + variant * 5,
    principles: [
      ...PeopleOfTheStars.principles.map((prin) => ({
        ...prin,
        option1Selected: variant === 1 ? prin.option1Selected : false,
        option2Selected: variant === 2 ? prin.option2Selected : false
      }))
    ],
    quarries: [
      {
        ...QUARRIES.WHITE_LION,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: true
      },
      {
        ...QUARRIES.SCREAMING_ANTELOPE,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: variant === 2
      },
      {
        ...QUARRIES.PHOENIX,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: false
      }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 12,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Bone',
        amount: 10,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      }
    ],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    survivalLimit: variant === 1 ? 1 : 3,
    survivorType: SurvivorType.ARC,
    timeline: PeopleOfTheStars.timeline.map((year, index) => ({
      completed: index < lanternYear,
      entries: year.entries
    })),
    usesScouts: variant === 2,
    wanderers: [
      WANDERERS.AENAS,
      WANDERERS.CANDY_COLA,
      WANDERERS.DEATH_DRIFTER,
      WANDERERS.GOTH,
      WANDERERS.LUCK
    ],

    ccRewards: PeopleOfTheStars.ccRewards.map((reward) => ({
      ...reward,
      unlocked: variant === 2 || reward.unlocked
    })),
    ccValue: 5 + variant * 10,
    knowledges: [
      { name: 'Anatomy', philosophy: Philosophy.COLLECTIVISM },
      ...(variant === 2
        ? [{ name: 'Symposium', philosophy: Philosophy.LANTERNISM }]
        : [])
    ],
    philosophies: [
      Philosophy.COLLECTIVISM,
      ...(variant === 2 ? [Philosophy.LANTERNISM] : [])
    ]
  }

  addMonsterTimelineEntries(
    settlement.timeline,
    quarryMap[CampaignType.PEOPLE_OF_THE_STARS].timeline,
    CampaignType.PEOPLE_OF_THE_STARS
  )
  addMonsterTimelineEntries(
    settlement.timeline,
    nemesisMap[CampaignType.PEOPLE_OF_THE_STARS].timeline,
    CampaignType.PEOPLE_OF_THE_STARS
  )

  return settlement
}

/**
 * Create People of the Dream Keeper Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 * @returns Settlement
 */
function createPeopleOfTheDreamKeeperSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  const settlement: Settlement = {
    id,
    name: `PotDK ${variant}`,
    arrivalBonuses: variant === 2 ? ['+1 Survival'] : [],
    campaignType: CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
    deathCount: variant * 2,
    departingBonuses: variant === 2 ? ['+3 Insanity'] : [],
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant === 2
        ? ['Cat Eye Circlet', 'Lantern Armor', 'Screaming Bracers']
        : [])
    ],
    innovations: [
      ...PeopleOfTheDreamKeeper.innovations,
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      ...PeopleOfTheDreamKeeper.locations.map((loc) => ({
        ...loc,
        unlocked: variant === 2 || loc.unlocked
      })),
      ...QUARRIES.CRIMSON_CROCODILE.locations,
      ...QUARRIES.KING.locations,
      ...QUARRIES.PHOENIX.locations,
      ...QUARRIES.SMOG_SINGERS.locations
    ],
    lostSettlements: 0,
    milestones: [
      ...PeopleOfTheDreamKeeper.milestones.map((ms) => ({
        ...ms,
        complete: variant === 2 || ms.complete
      }))
    ],
    nemeses: [
      {
        ...NEMESES.ATNAS,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.BUTCHER,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.GAMBLER,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.GODHAND,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false,
        level4Defeated: false
      },
      {
        ...NEMESES.HAND,
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        unlocked: variant === 2,
        level1Defeated: variant === 2,
        level2Defeated: false,
        level3Defeated: false
      }
    ],
    notes: 'PotDK Arc campaign',
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    population: 15 + variant * 5,
    principles: [
      ...PeopleOfTheDreamKeeper.principles.map((prin) => ({
        ...prin,
        option1Selected: variant === 1 ? prin.option1Selected : false,
        option2Selected: variant === 2 ? prin.option2Selected : false
      }))
    ],
    quarries: [
      {
        ...QUARRIES.CRIMSON_CROCODILE,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: true
      },
      {
        ...QUARRIES.KING,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: variant === 2
      },
      {
        ...QUARRIES.PHOENIX,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: false
      },
      {
        ...QUARRIES.SMOG_SINGERS,
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        unlocked: false
      }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 10 + variant * 5,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Bone',
        amount: 8 + variant * 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'White Lion Claw',
        amount: 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'Iron',
        amount: 5,
        category: ResourceCategory.BASIC,
        types: [ResourceType.SCRAP]
      }
    ],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    survivalLimit: variant === 1 ? 1 : 3,
    survivorType: SurvivorType.ARC,
    timeline: PeopleOfTheDreamKeeper.timeline.map((year, index) => ({
      completed: index < lanternYear,
      entries: year.entries
    })),
    usesScouts: variant === 2,
    wanderers: [
      WANDERERS.AENAS,
      WANDERERS.CANDY_COLA,
      WANDERERS.DEATH_DRIFTER,
      WANDERERS.GOTH,
      WANDERERS.LUCK
    ],

    ccRewards: PeopleOfTheStars.ccRewards.map((reward) => ({
      ...reward,
      unlocked: variant === 2 || reward.unlocked
    })),
    ccValue: 5 + variant * 10,
    knowledges: [
      { name: 'Anatomy', philosophy: Philosophy.COLLECTIVISM },
      ...(variant === 2
        ? [{ name: 'Symposium', philosophy: Philosophy.LANTERNISM }]
        : [])
    ],
    philosophies: [
      Philosophy.COLLECTIVISM,
      ...(variant === 2 ? [Philosophy.LANTERNISM] : [])
    ]
  }

  addMonsterTimelineEntries(
    settlement.timeline,
    quarryMap[CampaignType.PEOPLE_OF_THE_DREAM_KEEPER].timeline,
    CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
  )
  addMonsterTimelineEntries(
    settlement.timeline,
    nemesisMap[CampaignType.PEOPLE_OF_THE_DREAM_KEEPER].timeline,
    CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
  )

  return settlement
}

/**
 * Create Custom Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 * @returns Settlement
 */
function createCustomSettlement(id: number, variant: number): Settlement {
  const isArc = variant === 3
  const lanternYear = variant === 1 ? 5 : 12

  const settlement: Settlement = {
    id,
    name: `Custom Settlement ${variant}`,
    arrivalBonuses: variant === 2 ? ['+1 Survival'] : [],
    campaignType: CampaignType.CUSTOM,
    deathCount: variant * 2,
    departingBonuses: variant === 2 ? ['+3 Insanity'] : [],
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant === 2
        ? ['Cat Eye Circlet', 'Lantern Armor', 'Screaming Bracers']
        : [])
    ],
    innovations: [
      'Language',
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      { name: 'Custom Location 1', unlocked: true },
      { name: 'Custom Location 2', unlocked: variant >= 2 },
      { name: 'Custom Location 3', unlocked: false }
    ],
    lostSettlements: 0,
    milestones: [
      ...CustomCampaign.milestones.map((ms) => ({
        ...ms,
        complete: variant === 2 || ms.complete
      }))
    ],
    nemeses: [
      {
        ...NEMESES.ATNAS,
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        unlocked: variant === 3,
        level1Defeated: variant === 3,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.BUTCHER,
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        unlocked: variant === 3,
        level1Defeated: variant === 3,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.GAMBLER,
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        unlocked: variant === 3,
        level1Defeated: variant === 3,
        level2Defeated: false,
        level3Defeated: false
      },
      {
        ...NEMESES.GODHAND,
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        unlocked: variant === 3,
        level1Defeated: variant === 3,
        level2Defeated: false,
        level3Defeated: false,
        level4Defeated: false
      },
      {
        ...NEMESES.HAND,
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        unlocked: variant === 3,
        level1Defeated: variant === 3,
        level2Defeated: false,
        level3Defeated: false
      }
    ],
    notes: `Custom campaign ${variant} - ${isArc ? 'Arc Survivors' : 'Core Survivors'}`,
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    population: 15 + variant * 5,
    principles: [
      ...CustomCampaign.principles.map((prin) => ({
        ...prin,
        option1Selected: variant === 1 ? prin.option1Selected : false,
        option2Selected: variant === 2 ? prin.option2Selected : false
      }))
    ],
    quarries: [
      {
        ...QUARRIES.WHITE_LION,
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        unlocked: true
      },
      {
        ...QUARRIES.SCREAMING_ANTELOPE,
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        unlocked: variant >= 2
      },
      {
        ...QUARRIES.PHOENIX,
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        unlocked: variant === 3
      }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 10 + variant * 5,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Bone',
        amount: 8 + variant * 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'White Lion Claw',
        amount: 3,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'Iron',
        amount: 5,
        category: ResourceCategory.BASIC,
        types: [ResourceType.SCRAP]
      }
    ],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    survivalLimit: variant,
    survivorType: isArc ? SurvivorType.ARC : SurvivorType.CORE,
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < lanternYear,
        entries:
          i === 1
            ? ['Custom Event Year 1']
            : i === 5
              ? ['Custom Event Year 5']
              : []
      })),
    usesScouts: variant === 2,
    wanderers: [
      WANDERERS.AENAS,
      WANDERERS.CANDY_COLA,
      WANDERERS.DEATH_DRIFTER,
      WANDERERS.GOTH,
      WANDERERS.LUCK
    ],

    ...(isArc && {
      ccRewards: PeopleOfTheStars.ccRewards.map((reward) => ({
        ...reward,
        unlocked: variant === 3 || reward.unlocked
      })),
      ccValue: 5 + variant * 10,
      knowledges: [
        { name: 'Anatomy', philosophy: Philosophy.COLLECTIVISM },
        ...(variant === 3
          ? [{ name: 'Symposium', philosophy: Philosophy.LANTERNISM }]
          : [])
      ],
      philosophies: [
        Philosophy.COLLECTIVISM,
        ...(variant === 3 ? [Philosophy.LANTERNISM] : [])
      ]
    })
  }

  addMonsterTimelineEntries(
    settlement.timeline,
    quarryMap[CampaignType.CUSTOM].timeline,
    CampaignType.CUSTOM
  )
  addMonsterTimelineEntries(
    settlement.timeline,
    nemesisMap[CampaignType.CUSTOM].timeline,
    CampaignType.CUSTOM
  )

  return settlement
}

/**
 * Create Survivors for Settlement
 *
 * @param settlementId Settlement ID
 * @param startId Starting Survivor ID
 * @param count Number of Survivors to Create
 * @returns Array of Survivors
 */
function createSurvivorsForSettlement(
  settlementId: number,
  startId: number,
  count: number
): Survivor[] {
  const survivors: Survivor[] = []
  const names = [
    'Theron',
    'Lyra',
    'Kael',
    'Myra',
    'Drake',
    'Sable',
    'Finn',
    'Nova',
    'Rex',
    'Zara',
    'Ash',
    'Luna',
    'Orion',
    'Jade',
    'Raven',
    'Storm',
    'Phoenix',
    'Echo',
    'Atlas',
    'Sage'
  ]

  for (let i = 0; i < count; i++) {
    const survivorId = startId + i
    const isExperienced = i % 3 === 0
    const hasInjuries = i % 4 === 0
    const isRetired = i === count - 1 && count > 8
    const isDead = i === count - 2 && count > 10

    const baseSurvivor: Survivor = {
      id: survivorId,
      settlementId,
      name: names[i % names.length],
      gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
      abilitiesAndImpairments: isExperienced ? ['Ability'] : ['Impairment'],
      accuracy: isExperienced ? 2 : 0,
      canDash: isExperienced,
      canDodge: true,
      canFistPump: false,
      canEncourage: isExperienced,
      canSpendSurvival: true,
      canSurge: false,
      canUseFightingArtsOrKnowledges: true,
      color: isExperienced ? ColorChoice.BLUE : ColorChoice.SLATE,
      courage: isExperienced ? 3 : 0,
      cursedGear: isExperienced ? ['Cursed Sword'] : [],
      dead: isDead,
      disorders: isExperienced ? ['Anxiety', 'Binge Eating Disorder'] : [],
      evasion: isExperienced ? 1 : 0,
      fightingArts: isExperienced
        ? ['Mighty Strike', 'Leader']
        : i % 2 === 0
          ? ['Mighty Strike']
          : [],
      hasAnalyze: false,
      hasExplore: isExperienced,
      hasMatchmaker: false,
      hasPrepared: isExperienced,
      hasStalwart: false,
      hasTinker: false,
      huntXP: isExperienced ? 8 : i,
      huntXPRankUp: isExperienced ? [2, 6] : [],
      insanity: isExperienced ? 3 : 0,
      luck: isExperienced ? 1 : 0,
      movement: 5,
      nextDeparture: isExperienced ? ['Next Departure Bonus'] : [],
      notes: isExperienced
        ? 'Veteran survivor with extensive experience'
        : isDead
          ? 'Fell in battle against overwhelming darkness'
          : isRetired
            ? 'Retired to support the settlement'
            : undefined,
      oncePerLifetime: isExperienced ? ['Once Per Lifetime Bonus'] : [],
      rerollUsed: false,
      retired: isRetired,
      secretFightingArts: isExperienced ? ['Counter-Weighted Axe'] : [],
      skipNextHunt: i % 7 === 0 && !isDead && !isRetired,
      speed: isExperienced ? 1 : 0,
      strength: isExperienced ? 2 : 0,
      survival: 1 + (isExperienced ? 2 : 0),
      understanding: isExperienced ? 2 : 0,
      wanderer: false,
      weaponProficiency: isExperienced ? 5 : Math.min(i, 3),
      weaponProficiencyType: isExperienced
        ? i % 5 === 0
          ? WeaponType.SWORD
          : i % 5 === 1
            ? WeaponType.AXE
            : i % 5 === 2
              ? WeaponType.SPEAR
              : i % 5 === 3
                ? WeaponType.BOW
                : WeaponType.KATANA
        : undefined,

      /*
       * Hunt/Showdown Attributes
       */

      armArmor: 0,
      armLightDamage: false,
      armHeavyDamage: false,
      bodyArmor: 0,
      bodyLightDamage: false,
      bodyHeavyDamage: false,
      brainLightDamage: false,
      headArmor: 0,
      headHeavyDamage: false,
      legArmor: 0,
      legLightDamage: false,
      legHeavyDamage: false,
      waistArmor: 0,
      waistLightDamage: false,
      waistHeavyDamage: false,

      /*
       * Severe Injuries
       */

      armBroken: hasInjuries ? 1 : 0,
      armContracture: hasInjuries ? 3 : 0,
      armDismembered: hasInjuries ? 1 : 0,
      armRupturedMuscle: false,
      bodyBrokenRib: hasInjuries ? 2 : 0,
      bodyDestroyedBack: false,
      bodyGapingChestWound: hasInjuries ? 3 : 0,
      headBlind: hasInjuries ? 1 : 0,
      headDeaf: false,
      headIntracranialHemorrhage: false,
      headShatteredJaw: false,
      legBroken: hasInjuries ? 1 : 0,
      legDismembered: 0,
      legHamstrung: false,
      waistBrokenHip: false,
      waistDestroyedGenitals: false,
      waistIntestinalProlapse: false,
      waistWarpedPelvis: hasInjuries ? 3 : 0,

      /*
       * Arc Survivors
       */

      canEndure: isExperienced,
      knowledge1: isExperienced ? 'Anatomy' : undefined,
      knowledge1ObservationConditions: isExperienced
        ? 'Observe during showdown'
        : undefined,
      knowledge1ObservationRank: isExperienced ? 3 : 0,
      knowledge1RankUp: isExperienced ? 2 : undefined,
      knowledge1Rules: isExperienced ? 'Understanding of anatomy' : undefined,
      knowledge2: isExperienced ? 'Symposium' : undefined,
      knowledge2ObservationConditions: isExperienced
        ? 'Study texts'
        : undefined,
      knowledge2ObservationRank: isExperienced ? 2 : 0,
      knowledge2RankUp: isExperienced ? 1 : undefined,
      knowledge2Rules: isExperienced ? 'Philosophical insights' : undefined,
      lumi: isExperienced ? 5 : i,
      neurosis: isExperienced ? 'Fear of Darkness' : undefined,
      philosophy: isExperienced ? Philosophy.COLLECTIVISM : null,
      philosophyRank: isExperienced ? 2 : 0,
      systemicPressure: isExperienced ? 2 : 0,
      tenetKnowledge: isExperienced ? 'Tenet Knowledge Example' : undefined,
      tenetKnowledgeObservationConditions: isExperienced
        ? 'During hunts'
        : undefined,
      tenetKnowledgeObservationRank: isExperienced ? 1 : 0,
      tenetKnowledgeRankUp: isExperienced ? 1 : undefined,
      tenetKnowledgeRules: isExperienced ? 'Insights into tenets' : undefined,
      torment: isExperienced ? 1 : 0,

      /*
       * People of the Stars Survivors
       */

      hasAbsoluteReaper: i % 2 === 0,
      hasAbsoluteRust: i % 3 === 0,
      hasAbsoluteStorm: i % 4 === 0,
      hasAbsoluteWitch: i % 5 === 0,
      hasGamblerReaper: i % 2 === 0,
      hasGamblerRust: i % 3 === 0,
      hasGamblerStorm: i % 4 === 0,
      hasGamblerWitch: i % 5 === 0,
      hasGoblinReaper: i % 2 === 0,
      hasGoblinRust: i % 3 === 0,
      hasGoblinStorm: i % 4 === 0,
      hasGoblinWitch: i % 5 === 0,
      hasSculptorReaper: i % 2 === 0,
      hasSculptorRust: i % 3 === 0,
      hasSculptorStorm: i % 4 === 0,
      hasSculptorWitch: i % 5 === 0
    }

    survivors.push(baseSurvivor)
  }

  return survivors
}

/**
 * Create Hunt
 *
 * @param campaignType Campaign Type
 * @param id Hunt ID
 * @param settlementId Settlement ID
 * @param startSurvivorId Starting Survivor ID
 * @param usesScouts Whether Scouts are used
 * @returns Hunt
 */
function createHunt(
  campaignType: CampaignType,
  id: number,
  settlementId: number,
  startSurvivorId: number,
  usesScouts: boolean
): Hunt {
  const survivors = [
    startSurvivorId,
    startSurvivorId + 1,
    startSurvivorId + 2,
    startSurvivorId + 3
  ]

  if (usesScouts) survivors.push(startSurvivorId + 4)

  const monsterData = quarryMap[campaignType as keyof typeof quarryMap]
  const level1Data = monsterData.level1 as QuarryMonsterLevel[]

  return {
    huntBoard: basicHuntBoard,
    id,
    level: MonsterLevel.LEVEL_1,
    monsters: level1Data.map((level1) => ({
      ...level1,
      aiDeckRemaining:
        level1.aiDeck.basic + level1.aiDeck.advanced + level1.aiDeck.legendary,
      knockedDown: false,
      level: MonsterLevel.LEVEL_1,
      name: monsterData.name,
      notes: 'Starting hunt state',
      type: MonsterType.QUARRY,
      wounds: 0
    })),
    monsterPosition: 6,
    scout: usesScouts ? startSurvivorId + 4 : undefined,
    settlementId,
    survivorDetails: survivors.map((survivorId, index) => ({
      accuracyTokens: 0,
      evasionTokens: 0,
      id: survivorId,
      insanityTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      notes: `Survivor ${survivorId} (#${index}) ready for hunt`,
      speedTokens: 0,
      strengthTokens: 0,
      survivalTokens: 0
    })),
    survivorPosition: 0,
    survivors
  }
}

/**
 * Create Showdown
 *
 * @param campaignType Campaign Type
 * @param id Showdown ID
 * @param monsterType Monster Type
 * @param settlementId Settlement ID
 * @param startSurvivorId Starting Survivor ID
 * @param usesScouts Whether Scouts are used
 * @returns Showdown
 */
function createShowdown(
  campaignType: CampaignType,
  id: number,
  monsterType: MonsterType,
  settlementId: number,
  startSurvivorId: number,
  usesScouts: boolean
): Showdown {
  const survivors = [
    startSurvivorId,
    startSurvivorId + 1,
    startSurvivorId + 2,
    startSurvivorId + 3
  ]

  if (usesScouts) survivors.push(startSurvivorId + 4)

  const monsterData =
    monsterType === MonsterType.QUARRY
      ? quarryMap[campaignType as keyof typeof quarryMap]
      : nemesisMap[campaignType as keyof typeof nemesisMap]
  const level1Data = monsterData.level1 as
    | QuarryMonsterLevel[]
    | NemesisMonsterLevel[]

  return {
    ambush: AmbushType.NONE,
    id,
    level: MonsterLevel.LEVEL_1,
    monsters: level1Data.map((level1) => ({
      ...level1,
      aiDeckRemaining:
        level1.aiDeck.basic + level1.aiDeck.advanced + level1.aiDeck.legendary,
      knockedDown: false,
      level: MonsterLevel.LEVEL_1,
      name: monsterData.name,
      notes: 'Starting showdown state',
      type: monsterType,
      wounds: 0
    })),
    scout: usesScouts ? startSurvivorId + 4 : undefined,
    settlementId,
    specialShowdown: false,
    survivorDetails: survivors.map((survivorId, index) => ({
      accuracyTokens: 0,
      bleedingTokens: 0,
      blockTokens: 0,
      deflectTokens: 0,
      evasionTokens: 0,
      id: survivorId,
      insanityTokens: 0,
      knockedDown: false,
      luckTokens: 0,
      movementTokens: 0,
      notes: `Survivor ${survivorId} (#${index}) ready for showdown`,
      priorityTarget: false,
      speedTokens: 0,
      strengthTokens: 0,
      survivalTokens: 0
    })),
    survivors,
    turn: {
      currentTurn: TurnType.SURVIVORS,
      monsterState: {
        aiCardDrawn: false
      },
      survivorStates: survivors.map((survivorId, index) => ({
        id: survivorId,
        movementUsed: index === 0,
        activationUsed: index === 0
      }))
    }
  }
}

/**
 * Create Custom Nemeses
 *
 * Creates sample custom nemeses for testing.
 *
 * @returns Custom Nemeses
 */
function createCustomNemeses(): Campaign['customNemeses'] {
  return {
    // Custom Nemesis: Shadow Weaver
    'custom-nemesis-1': {
      multiMonster: false,
      name: 'Shadow Weaver',
      node: MonsterNode.NN1,
      type: MonsterType.NEMESIS,
      level1: [
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 5, advanced: 3, legendary: 0 },
          aiDeckRemaining: 8,
          damage: 2,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          life: 10,
          luck: 0,
          luckTokens: 0,
          moods: ['Calculating', 'Silent'],
          movement: 6,
          movementTokens: 0,
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorStatuses: ['Darkness'],
          toughness: 8,
          toughnessTokens: 0,
          traits: ['Shadow Step', 'Incorporeal']
        }
      ],
      level2: [
        {
          accuracy: 2,
          accuracyTokens: 0,
          aiDeck: { basic: 4, advanced: 4, legendary: 2 },
          aiDeckRemaining: 10,
          damage: 3,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          life: 15,
          luck: 0,
          luckTokens: 0,
          moods: ['Calculating', 'Silent', 'Vengeful'],
          movement: 7,
          movementTokens: 0,
          speed: 3,
          speedTokens: 0,
          strength: 1,
          strengthTokens: 0,
          survivorStatuses: ['Darkness', 'Nightmare'],
          toughness: 10,
          toughnessTokens: 0,
          traits: ['Shadow Step', 'Incorporeal', 'Dark Aura']
        }
      ],
      level3: [
        {
          accuracy: 3,
          accuracyTokens: 0,
          aiDeck: { basic: 3, advanced: 5, legendary: 3 },
          aiDeckRemaining: 11,
          damage: 4,
          damageTokens: 0,
          evasion: 2,
          evasionTokens: 0,
          life: 20,
          luck: 1,
          luckTokens: 0,
          moods: ['Calculating', 'Silent', 'Vengeful', 'Frenzied'],
          movement: 8,
          movementTokens: 0,
          speed: 4,
          speedTokens: 0,
          strength: 2,
          strengthTokens: 0,
          survivorStatuses: ['Darkness', 'Nightmare', 'Doomed'],
          toughness: 12,
          toughnessTokens: 0,
          traits: ['Shadow Step', 'Incorporeal', 'Dark Aura', 'Soul Drain']
        }
      ],
      timeline: {
        8: ['Nemesis Encounter - Shadow Weaver Lvl 1'],
        16: ['Nemesis Encounter - Shadow Weaver Lvl 2'],
        24: ['Nemesis Encounter - Shadow Weaver Lvl 3']
      }
    },

    // Custom Nemesis: Void Caller (simpler configuration)
    'custom-nemesis-2': {
      multiMonster: false,
      name: 'Void Caller',
      node: MonsterNode.NN2,
      type: MonsterType.NEMESIS,
      level1: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 6, advanced: 2, legendary: 0 },
          aiDeckRemaining: 8,
          damage: 1,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          life: 12,
          luck: 0,
          luckTokens: 0,
          moods: ['Ethereal'],
          movement: 5,
          movementTokens: 0,
          speed: 1,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorStatuses: [],
          toughness: 6,
          toughnessTokens: 0,
          traits: ['Void Touch']
        }
      ],
      level2: [
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 5, advanced: 4, legendary: 1 },
          aiDeckRemaining: 10,
          damage: 2,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          life: 18,
          luck: 0,
          luckTokens: 0,
          moods: ['Ethereal', 'Consuming'],
          movement: 6,
          movementTokens: 0,
          speed: 2,
          speedTokens: 0,
          strength: 1,
          strengthTokens: 0,
          survivorStatuses: ['Void Touched'],
          toughness: 8,
          toughnessTokens: 0,
          traits: ['Void Touch', 'Reality Warp']
        }
      ],
      timeline: {
        10: ['Nemesis Encounter - Void Caller Lvl 1'],
        20: ['Nemesis Encounter - Void Caller Lvl 2']
      }
    }
  }
}

/**
 * Create Custom Quarries
 *
 * Creates sample custom quarries for testing.
 *
 * @returns Custom Quarries
 */
function createCustomQuarries(): Campaign['customQuarries'] {
  return {
    // Custom Quarry: Iron Wyrm (prologue available)
    'custom-quarry-1': {
      multiMonster: false,
      name: 'Iron Wyrm',
      node: MonsterNode.NQ1,
      type: MonsterType.QUARRY,
      prologue: true,
      level1: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 8, advanced: 0, legendary: 0 },
          aiDeckRemaining: 8,
          damage: 2,
          damageTokens: 0,
          evasion: -1,
          evasionTokens: 0,
          huntPos: 10,
          luck: 0,
          luckTokens: 0,
          moods: ['Aggressive', 'Territorial'],
          movement: 4,
          movementTokens: 0,
          speed: 1,
          speedTokens: 0,
          strength: 2,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 10,
          toughnessTokens: 0,
          traits: ['Armored', 'Slow']
        }
      ],
      level2: [
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 6, advanced: 3, legendary: 0 },
          aiDeckRemaining: 9,
          damage: 3,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          huntPos: 12,
          luck: 0,
          luckTokens: 0,
          moods: ['Aggressive', 'Territorial', 'Enraged'],
          movement: 5,
          movementTokens: 0,
          speed: 2,
          speedTokens: 0,
          strength: 3,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Bleeding'],
          toughness: 12,
          toughnessTokens: 0,
          traits: ['Armored', 'Slow', 'Metal Rend']
        }
      ],
      huntBoard: {
        0: undefined,
        1: HuntEventType.BASIC,
        2: HuntEventType.BASIC,
        3: HuntEventType.MONSTER,
        4: HuntEventType.BASIC,
        5: HuntEventType.BASIC,
        6: undefined,
        7: HuntEventType.BASIC,
        8: HuntEventType.BASIC,
        9: HuntEventType.BASIC,
        10: HuntEventType.MONSTER,
        11: HuntEventType.BASIC,
        12: undefined
      },
      locations: [
        {
          name: 'Forge',
          unlocked: false
        }
      ],
      ccRewards: [
        {
          cc: 0,
          name: 'Metalworking',
          unlocked: false
        }
      ],
      timeline: {
        1: [
          {
            title: 'Iron Wyrm Prologue',
            campaigns: [CampaignType.CUSTOM]
          }
        ],
        6: ['Iron Wyrm Lvl 1'],
        14: ['Iron Wyrm Lvl 2']
      }
    },

    // Custom Quarry: Crystal Stag
    'custom-quarry-2': {
      multiMonster: false,
      name: 'Crystal Stag',
      node: MonsterNode.NQ2,
      type: MonsterType.QUARRY,
      prologue: false,
      level1: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 7, advanced: 0, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          huntPos: 12,
          luck: 0,
          luckTokens: 0,
          moods: ['Skittish', 'Graceful'],
          movement: 7,
          movementTokens: 0,
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 6,
          toughnessTokens: 0,
          traits: ['Crystalline Hide', 'Swift']
        }
      ],
      level2: [
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 5, advanced: 3, legendary: 0 },
          aiDeckRemaining: 8,
          damage: 2,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 14,
          luck: 0,
          luckTokens: 0,
          moods: ['Skittish', 'Graceful', 'Radiant'],
          movement: 8,
          movementTokens: 0,
          speed: 3,
          speedTokens: 0,
          strength: 1,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Dazzled'],
          toughness: 8,
          toughnessTokens: 0,
          traits: ['Crystalline Hide', 'Swift', 'Light Burst']
        }
      ],
      level3: [
        {
          accuracy: 2,
          accuracyTokens: 0,
          aiDeck: { basic: 4, advanced: 4, legendary: 2 },
          aiDeckRemaining: 10,
          damage: 3,
          damageTokens: 0,
          evasion: 2,
          evasionTokens: 0,
          huntPos: 16,
          luck: 1,
          luckTokens: 0,
          moods: ['Skittish', 'Graceful', 'Radiant', 'Majestic'],
          movement: 9,
          movementTokens: 0,
          speed: 4,
          speedTokens: 0,
          strength: 2,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Dazzled', 'Blinded'],
          toughness: 10,
          toughnessTokens: 0,
          traits: ['Crystalline Hide', 'Swift', 'Light Burst', 'Prismatic']
        }
      ],
      huntBoard: {
        0: undefined,
        1: HuntEventType.BASIC,
        2: HuntEventType.BASIC,
        3: HuntEventType.MONSTER,
        4: HuntEventType.BASIC,
        5: HuntEventType.BASIC,
        6: undefined,
        7: HuntEventType.BASIC,
        8: HuntEventType.BASIC,
        9: HuntEventType.BASIC,
        10: HuntEventType.MONSTER,
        11: HuntEventType.BASIC,
        12: undefined
      },
      locations: [
        {
          name: 'Crystal Workshop',
          unlocked: false
        },
        {
          name: 'Prism Shrine',
          unlocked: false
        }
      ],
      ccRewards: [
        {
          cc: 0,
          name: 'Crystalline Insight',
          unlocked: false
        },
        {
          cc: 1,
          name: 'Refraction Mastery',
          unlocked: false
        },
        {
          cc: 2,
          name: 'Prismatic Understanding',
          unlocked: false
        }
      ],
      timeline: {}
    },

    // Custom Quarry: Twilight Serpent (full four levels)
    'custom-quarry-3': {
      multiMonster: false,
      name: 'Twilight Serpent',
      node: MonsterNode.NQ3,
      type: MonsterType.QUARRY,
      prologue: false,
      level1: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 7, advanced: 0, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 11,
          luck: 0,
          luckTokens: 0,
          moods: ['Cunning'],
          movement: 6,
          movementTokens: 0,
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 7,
          toughnessTokens: 0,
          traits: ['Venomous', 'Camouflage']
        }
      ],
      level2: [
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 6, advanced: 2, legendary: 0 },
          aiDeckRemaining: 8,
          damage: 2,
          damageTokens: 0,
          evasion: 2,
          evasionTokens: 0,
          huntPos: 13,
          luck: 0,
          luckTokens: 0,
          moods: ['Cunning', 'Patient'],
          movement: 7,
          movementTokens: 0,
          speed: 3,
          speedTokens: 0,
          strength: 1,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Poisoned'],
          toughness: 9,
          toughnessTokens: 0,
          traits: ['Venomous', 'Camouflage', 'Constrictor']
        }
      ],
      level3: [
        {
          accuracy: 2,
          accuracyTokens: 0,
          aiDeck: { basic: 5, advanced: 3, legendary: 1 },
          aiDeckRemaining: 9,
          damage: 3,
          damageTokens: 0,
          evasion: 3,
          evasionTokens: 0,
          huntPos: 15,
          luck: 1,
          luckTokens: 0,
          moods: ['Cunning', 'Patient', 'Deadly'],
          movement: 8,
          movementTokens: 0,
          speed: 4,
          speedTokens: 0,
          strength: 2,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Poisoned', 'Bleeding'],
          toughness: 11,
          toughnessTokens: 0,
          traits: ['Venomous', 'Camouflage', 'Constrictor', 'Shadow Strike']
        }
      ],
      level4: [
        {
          accuracy: 3,
          accuracyTokens: 0,
          aiDeck: { basic: 4, advanced: 4, legendary: 2 },
          aiDeckRemaining: 10,
          damage: 4,
          damageTokens: 0,
          evasion: 4,
          evasionTokens: 0,
          huntPos: 17,
          luck: 2,
          luckTokens: 0,
          moods: ['Cunning', 'Patient', 'Deadly', 'Ancient'],
          movement: 9,
          movementTokens: 0,
          speed: 5,
          speedTokens: 0,
          strength: 3,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: ['Poisoned', 'Bleeding', 'Doomed'],
          toughness: 13,
          toughnessTokens: 0,
          traits: [
            'Venomous',
            'Camouflage',
            'Constrictor',
            'Shadow Strike',
            'Apex Predator'
          ]
        }
      ],
      huntBoard: {
        0: undefined,
        1: HuntEventType.BASIC,
        2: HuntEventType.BASIC,
        3: HuntEventType.MONSTER,
        4: HuntEventType.BASIC,
        5: HuntEventType.BASIC,
        6: undefined,
        7: HuntEventType.BASIC,
        8: HuntEventType.BASIC,
        9: HuntEventType.BASIC,
        10: HuntEventType.MONSTER,
        11: HuntEventType.BASIC,
        12: undefined
      },
      locations: [
        {
          name: 'Serpent Den',
          unlocked: false
        },
        {
          name: 'Twilight Grove',
          unlocked: false
        }
      ],
      ccRewards: [
        {
          cc: 0,
          name: 'Venom Study',
          unlocked: false
        },
        {
          cc: 1,
          name: 'Serpent Wisdom',
          unlocked: false
        },
        {
          cc: 2,
          name: 'Twilight Secrets',
          unlocked: false
        }
      ],
      timeline: {}
    },

    // Custom Quarry: Dark Horses (multi-monster quarry)
    'custom-quarry-4': {
      multiMonster: true,
      name: 'Dark Horses',
      node: MonsterNode.NQ4,
      type: MonsterType.QUARRY,
      prologue: false,
      level1: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 7, advanced: 0, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 11,
          luck: 0,
          luckTokens: 0,
          moods: ['Cunning'],
          movement: 6,
          movementTokens: 0,
          name: 'Dark Horse Alpha',
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 7,
          toughnessTokens: 0,
          traits: ['Stampede']
        }
      ],
      level2: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 7, advanced: 0, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 11,
          luck: 0,
          luckTokens: 0,
          moods: ['Cunning'],
          movement: 6,
          movementTokens: 0,
          name: 'Dark Horse Alpha',
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 7,
          toughnessTokens: 0,
          traits: ['Stampede']
        },
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 6, advanced: 1, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          huntPos: 10,
          luck: 0,
          luckTokens: 0,
          moods: ['Skittish'],
          movement: 5,
          movementTokens: 0,
          name: 'Dark Horse Beta',
          speed: 1,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 6,
          toughnessTokens: 0,
          traits: ['Flee']
        }
      ],
      level3: [
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 7, advanced: 0, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 11,
          luck: 0,
          luckTokens: 0,
          moods: ['Cunning'],
          movement: 6,
          movementTokens: 0,
          name: 'Dark Horse Alpha',
          speed: 2,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 7,
          toughnessTokens: 0,
          traits: ['Stampede']
        },
        {
          accuracy: 0,
          accuracyTokens: 0,
          aiDeck: { basic: 6, advanced: 1, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 1,
          damageTokens: 0,
          evasion: 0,
          evasionTokens: 0,
          huntPos: 10,
          luck: 0,
          luckTokens: 0,
          moods: ['Skittish'],
          movement: 5,
          movementTokens: 0,
          name: 'Dark Horse Beta',
          speed: 1,
          speedTokens: 0,
          strength: 0,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 6,
          toughnessTokens: 0,
          traits: ['Flee']
        },
        {
          accuracy: 1,
          accuracyTokens: 0,
          aiDeck: { basic: 5, advanced: 2, legendary: 0 },
          aiDeckRemaining: 7,
          damage: 2,
          damageTokens: 0,
          evasion: 1,
          evasionTokens: 0,
          huntPos: 12,
          luck: 0,
          luckTokens: 0,
          moods: ['Wild'],
          movement: 7,
          movementTokens: 0,
          name: 'Dark Horse Gamma',
          speed: 3,
          speedTokens: 0,
          strength: 1,
          strengthTokens: 0,
          survivorHuntPos: 0,
          survivorStatuses: [],
          toughness: 8,
          toughnessTokens: 0,
          traits: ['Rampage']
        }
      ],
      huntBoard: {
        0: undefined,
        1: HuntEventType.BASIC,
        2: HuntEventType.BASIC,
        3: HuntEventType.MONSTER,
        4: HuntEventType.BASIC,
        5: HuntEventType.BASIC,
        6: undefined,
        7: HuntEventType.BASIC,
        8: HuntEventType.BASIC,
        9: HuntEventType.BASIC,
        10: HuntEventType.MONSTER,
        11: HuntEventType.BASIC,
        12: undefined
      },
      locations: [
        {
          name: 'Serpent Den',
          unlocked: false
        },
        {
          name: 'Twilight Grove',
          unlocked: false
        }
      ],
      ccRewards: [
        {
          cc: 0,
          name: 'Venom Study',
          unlocked: false
        },
        {
          cc: 1,
          name: 'Serpent Wisdom',
          unlocked: false
        },
        {
          cc: 2,
          name: 'Twilight Secrets',
          unlocked: false
        }
      ],
      timeline: {}
    }
  }
}
