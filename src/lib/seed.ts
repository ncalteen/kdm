'use client'

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
import { saveCampaignToLocalStorage } from '@/lib/utils'
import type { Campaign } from '@/schemas/campaign'
import type { Hunt } from '@/schemas/hunt'
import { QuarryMonsterData } from '@/schemas/monster'
import type { Settlement } from '@/schemas/settlement'
import type { Showdown } from '@/schemas/showdown'
import type { Survivor } from '@/schemas/survivor'
import packageJson from '../../package.json'
import { CustomCampaign } from './campaigns/custom'
import { PeopleOfTheDreamKeeper } from './campaigns/potdk'
import { PeopleOfTheLantern } from './campaigns/potl'
import { PeopleOfTheStars } from './campaigns/potstars'
import { PeopleOfTheSun } from './campaigns/potsun'
import { NEMESES, QUARRIES } from './monsters'
import { NemesisMonsterLevelData, QuarryMonsterLevelData } from './types'

const colors = [
  ColorChoice.RED,
  ColorChoice.BLUE,
  ColorChoice.GREEN,
  ColorChoice.YELLOW,
  ColorChoice.PURPLE
]

const quarryMap = {
  [CampaignType.PEOPLE_OF_THE_LANTERN]: QUARRIES[14].main,
  [CampaignType.PEOPLE_OF_THE_SUN]: QUARRIES[14].main,
  [CampaignType.PEOPLE_OF_THE_STARS]: QUARRIES[14].main,
  [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: QUARRIES[1].main,
  [CampaignType.CUSTOM]: QUARRIES[14].main
}

const nemesisMap = {
  [CampaignType.PEOPLE_OF_THE_LANTERN]: NEMESES[3].main,
  [CampaignType.PEOPLE_OF_THE_SUN]: NEMESES[3].main,
  [CampaignType.PEOPLE_OF_THE_STARS]: NEMESES[3].main,
  [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: NEMESES[1].main,
  [CampaignType.CUSTOM]: NEMESES[1].main
}

/**
 * Generate Seed Data
 *
 * Creates comprehensive test data including multiple campaigns of each type
 * with settlements, survivors, hunts, and showdowns in various states.
 */
export function generateSeedData(): void {
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
    customMonsters: createCustomMonsters(),
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
 */
function createPeopleOfTheLanternSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  return {
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
      ...QUARRIES[14].main.locations,
      ...QUARRIES[10].main.locations,
      ...QUARRIES[9].main.locations
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
        id: 3,
        unlocked: true,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      { id: 9, unlocked: false, level1: false, level2: false, level3: false },
      { id: 8, unlocked: false, level1: false, level2: false, level3: false },
      {
        id: 19,
        unlocked: false,
        level1: false,
        level2: false,
        level3: false,
        level4: false
      },
      { id: 7, unlocked: false, level1: false, level2: false, level3: false }
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
        id: 14,
        unlocked: true
      },
      { id: 10, unlocked: variant === 2 },
      { id: 9, unlocked: false }
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

    lanternResearchLevel: variant,
    monsterVolumes: variant === 2 ? ['White Lion Vol. 1'] : []
  }
}

/**
 * Create People of the Sun Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 */
function createPeopleOfTheSunSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  return {
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
      ...QUARRIES[14].main.locations,
      ...QUARRIES[10].main.locations,
      ...QUARRIES[9].main.locations
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
        id: 3,
        unlocked: true,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      { id: 9, unlocked: false, level1: false, level2: false, level3: false }
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
      { id: 14, unlocked: true },
      { id: 10, unlocked: variant === 2 },
      { id: 9, unlocked: false }
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
    usesScouts: variant === 2
  }
}

/**
 * Create People of the Stars Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 */
function createPeopleOfTheStarsSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  return {
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
      ...QUARRIES[14].main.locations,
      ...QUARRIES[10].main.locations,
      ...QUARRIES[9].main.locations
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
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 3,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 9,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 8,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 18,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false,
        level4: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 4,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
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
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 14,
        unlocked: true
      },
      {
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 10,
        unlocked: variant === 2
      },
      {
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 9,
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
}

/**
 * Create People of the Dream Keeper Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 */
function createPeopleOfTheDreamKeeperSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  return {
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
      ...QUARRIES[1].main.locations,
      ...QUARRIES[7].main.locations,
      ...QUARRIES[9].main.locations,
      ...QUARRIES[11].main.locations
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
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 1,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 3,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 5,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 6,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false,
        level4: false
      },
      {
        ccLevel1: variant === 2,
        ccLevel2: false,
        ccLevel3: false,
        id: 8,
        unlocked: variant === 2,
        level1: variant === 2,
        level2: false,
        level3: false
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
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 1,
        unlocked: true
      },
      {
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 7,
        unlocked: variant === 2
      },
      {
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 9,
        unlocked: false
      },
      {
        ccPrologue: variant === 2,
        ccLevel1: variant === 2,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        id: 11,
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
    timeline: PeopleOfTheStars.timeline.map((year, index) => ({
      completed: index < lanternYear,
      entries: year.entries
    })),
    usesScouts: variant === 2,

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
}

/**
 * Create Custom Settlement
 *
 * @param id Settlement ID
 * @param variant Variant Number
 */
function createCustomSettlement(id: number, variant: number): Settlement {
  const isArc = variant === 3
  const lanternYear = variant === 1 ? 5 : 12

  return {
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
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        id: 1,
        unlocked: variant === 3,
        level1: variant === 3,
        level2: false,
        level3: false
      },
      {
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        id: 3,
        unlocked: variant === 3,
        level1: variant === 3,
        level2: false,
        level3: false
      },
      {
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        id: 5,
        unlocked: variant === 3,
        level1: variant === 3,
        level2: false,
        level3: false
      },
      {
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        id: 6,
        unlocked: variant === 3,
        level1: variant === 3,
        level2: false,
        level3: false,
        level4: false
      },
      {
        ...(isArc && {
          ccLevel1: variant === 3,
          ccLevel2: false,
          ccLevel3: false
        }),
        id: 8,
        unlocked: variant === 3,
        level1: variant === 3,
        level2: false,
        level3: false
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
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        id: 14,
        unlocked: true
      },
      {
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        id: 10,
        unlocked: variant >= 2
      },
      {
        ...(isArc && {
          ccPrologue: variant === 3,
          ccLevel1: variant === 3,
          ccLevel2: [false, false],
          ccLevel3: [false, false, false]
        }),
        id: 9,
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
}

/**
 * Create Survivors for Settlement
 *
 * @param settlementId Settlement ID
 * @param startId Starting Survivor ID
 * @param count Number of Survivors to Create
 * @param survivorType Type of Survivor (Core or Arc)
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

  const monsterData = quarryMap[
    campaignType as keyof typeof quarryMap
  ] as QuarryMonsterData
  const level1Data = monsterData.level1 as QuarryMonsterLevelData

  return {
    id,
    monster: {
      ...level1Data,
      aiDeckRemaining:
        level1Data.aiDeck.basic +
        level1Data.aiDeck.advanced +
        level1Data.aiDeck.legendary,
      knockedDown: false,
      level: MonsterLevel.LEVEL_1,
      name: monsterData.name,
      notes: 'Starting hunt state',
      type: MonsterType.QUARRY,
      wounds: 0
    },
    monsterPosition: 6,
    scout: usesScouts ? startSurvivorId + 4 : undefined,
    settlementId,
    survivorDetails: survivors.map((survivorId, index) => ({
      accuracyTokens: 0,
      color: colors[index],
      evasionTokens: 0,
      id: survivorId,
      insanityTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      notes: `Survivor ${survivorId} ready for hunt`,
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
    | QuarryMonsterLevelData
    | NemesisMonsterLevelData

  return {
    ambush: AmbushType.NONE,
    id,
    monster: {
      ...level1Data,
      aiDeckRemaining:
        level1Data.aiDeck.basic +
        level1Data.aiDeck.advanced +
        level1Data.aiDeck.legendary,
      knockedDown: false,
      level: MonsterLevel.LEVEL_1,
      name: monsterData.name,
      notes: 'Starting showdown state',
      type: monsterType,
      wounds: 0
    },
    scout: usesScouts ? startSurvivorId + 4 : undefined,
    settlementId,
    survivorDetails: survivors.map((survivorId, index) => ({
      accuracyTokens: 0,
      bleedingTokens: 0,
      blockTokens: 0,
      color: colors[index],
      deflectTokens: 0,
      evasionTokens: 0,
      id: survivorId,
      insanityTokens: 0,
      knockedDown: false,
      luckTokens: 0,
      movementTokens: 0,
      notes: `Survivor ${survivorId} ready for showdown`,
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
 * Create Custom Monsters
 *
 * Creates sample custom monsters for testing, including both nemesis and quarry
 * types with varying levels of complexity and configuration.
 */
function createCustomMonsters(): Campaign['customMonsters'] {
  return {
    // Custom Nemesis: Shadow Weaver
    'custom-nemesis-1': {
      main: {
        name: 'Shadow Weaver',
        node: MonsterNode.NN1,
        type: MonsterType.NEMESIS,
        level1: {
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
        },
        level2: {
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
        },
        level3: {
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
        },
        timeline: {
          8: ['Nemesis Encounter - Shadow Weaver Lvl 1'],
          16: ['Nemesis Encounter - Shadow Weaver Lvl 2'],
          24: ['Nemesis Encounter - Shadow Weaver Lvl 3']
        }
      }
    },

    // Custom Nemesis: Void Caller (simpler configuration)
    'custom-nemesis-2': {
      main: {
        name: 'Void Caller',
        node: MonsterNode.NN2,
        type: MonsterType.NEMESIS,
        level1: {
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
        },
        level2: {
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
        },
        timeline: {
          10: ['Nemesis Encounter - Void Caller Lvl 1'],
          20: ['Nemesis Encounter - Void Caller Lvl 2']
        }
      }
    },

    // Custom Quarry: Iron Wyrm (prologue available)
    'custom-quarry-1': {
      main: {
        name: 'Iron Wyrm',
        node: MonsterNode.NQ1,
        type: MonsterType.QUARRY,
        prologue: true,
        level1: {
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
        },
        level2: {
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
        },
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
      }
    },

    // Custom Quarry: Crystal Stag
    'custom-quarry-2': {
      main: {
        name: 'Crystal Stag',
        node: MonsterNode.NQ2,
        type: MonsterType.QUARRY,
        prologue: false,
        level1: {
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
        },
        level2: {
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
        },
        level3: {
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
        },
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
      }
    },

    // Custom Quarry: Twilight Serpent (full four levels)
    'custom-quarry-3': {
      main: {
        name: 'Twilight Serpent',
        node: MonsterNode.NQ3,
        type: MonsterType.QUARRY,
        prologue: false,
        level1: {
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
        },
        level2: {
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
        },
        level3: {
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
        },
        level4: {
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
        },
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
}
