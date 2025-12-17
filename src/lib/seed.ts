'use client'

import {
  AmbushType,
  CampaignType,
  ColorChoice,
  Gender,
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
import type { Settlement } from '@/schemas/settlement'
import type { Showdown } from '@/schemas/showdown'
import type { Survivor } from '@/schemas/survivor'

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
      10 + i * 3 // Vary survivor count
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt to first settlement
    if (i === 0)
      hunts.push(
        createHunt(
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          MonsterType.QUARRY
        )
      )

    // Add showdown to second settlement
    if (i === 1)
      showdowns.push(
        createShowdown(
          showdownIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          MonsterType.NEMESIS
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
      8 + i * 2
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)
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
      12 + i * 2,
      SurvivorType.ARC
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add hunt with Arc survivors
    if (i === 0)
      hunts.push(
        createHunt(
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          MonsterType.QUARRY
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
      9 + i * 3,
      SurvivorType.ARC
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)
  }

  // Custom Campaigns
  for (let i = 0; i < 3; i++) {
    const settlement = createCustomSettlement(settlementIdCounter++, i + 1)
    settlements.push(settlement)

    const settlementSurvivors = createSurvivorsForSettlement(
      settlement.id,
      survivorIdCounter,
      6 + i * 4,
      i === 2 ? SurvivorType.ARC : SurvivorType.CORE
    )
    survivorIdCounter += settlementSurvivors.length
    survivors.push(...settlementSurvivors)

    // Add diverse states to custom campaigns
    if (i === 1)
      hunts.push(
        createHunt(
          huntIdCounter++,
          settlement.id,
          survivorIdCounter - 4,
          MonsterType.NEMESIS
        )
      )

    if (i === 2)
      showdowns.push(
        createShowdown(
          showdownIdCounter++,
          settlement.id,
          survivorIdCounter - 3,
          MonsterType.QUARRY
        )
      )
  }

  // Create campaign object
  const campaign: Campaign = {
    customMonsters: null,
    hunts,
    selectedHuntId: hunts.length > 0 ? hunts[0].id : null,
    selectedShowdownId: showdowns.length > 0 ? showdowns[0].id : null,
    selectedSettlementId: settlements[0].id,
    selectedSurvivorId: survivors[0].id,
    selectedTab: TabType.SETTLEMENT,
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
    survivors
  }

  // Save to localStorage
  saveCampaignToLocalStorage(campaign)
}

/**
 * Create People of the Lantern Settlement
 */
function createPeopleOfTheLanternSettlement(
  id: number,
  variant: number
): Settlement {
  const lanternYear = variant === 1 ? 5 : 12

  return {
    id,
    name: `Lantern Watch ${variant}`,
    campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
    survivorType: SurvivorType.CORE,
    deathCount: variant * 2,
    population: 15 + variant * 5,
    survivalLimit: variant === 1 ? 1 : 3,
    lanternResearchLevel: variant,
    usesScouts: variant === 2,
    innovations: [
      'Language',
      ...(variant === 2 ? ['Paint', 'Ammonia', 'Drums', 'Inner Lantern'] : [])
    ],
    locations: [
      { name: 'Lantern Hoard', unlocked: true },
      { name: 'Barber Surgeon', unlocked: variant === 2 },
      { name: 'Blacksmith', unlocked: variant === 2 },
      { name: 'Bone Smith', unlocked: variant === 2 },
      { name: 'Leather Worker', unlocked: variant === 2 },
      { name: 'Mask Maker', unlocked: false },
      { name: 'Organ Grinder', unlocked: variant === 2 },
      { name: 'Skinnery', unlocked: false },
      { name: 'Weapon Crafter', unlocked: variant === 2 }
    ],
    principles: [
      {
        name: 'Conviction',
        option1Name: 'Collective Toil',
        option1Selected: variant === 1,
        option2Name: 'Accept Darkness',
        option2Selected: variant === 2
      },
      {
        name: 'New Life',
        option1Name: 'Protect the Young',
        option1Selected: false,
        option2Name: 'Survival of the Fittest',
        option2Selected: variant === 2
      }
    ],
    quarries: [
      {
        id: 14,
        node: MonsterNode.NQ1,
        unlocked: true,
        ccLevel1: variant === 2,
        ccLevel2: variant === 2 ? [true, false] : undefined,
        ccLevel3: variant === 2 ? [false, false, false] : undefined
      },
      { id: 10, node: MonsterNode.NQ2, unlocked: variant === 2 },
      { id: 9, node: MonsterNode.NQ3, unlocked: false }
    ],
    nemeses: [
      {
        id: 3,
        unlocked: true,
        level1: variant === 2,
        level2: false,
        level3: false,
        ccLevel1: variant === 2
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
    milestones: [
      {
        name: 'First child is born',
        complete: variant === 2,
        event: 'Principle: New Life'
      },
      {
        name: 'First time death count is updated',
        complete: true,
        event: 'Principle: Death'
      },
      {
        name: 'Settlement has 5 innovations',
        complete: variant === 2,
        event: 'Hooded Knight'
      },
      {
        name: 'Population reaches 15',
        complete: variant === 2,
        event: 'Principle: Society'
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
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant === 2
        ? ['Cat Eye Circlet', 'Lantern Armor', 'Screaming Bracers']
        : [])
    ],
    patterns: variant === 2 ? ['Catgut Bow'] : [],
    seedPatterns: variant === 2 ? ['Screaming Bracers'] : [],
    arrivalBonuses: [],
    departingBonuses: variant === 2 ? ['+1 Survival'] : [],
    monsterVolumes: variant === 2 ? ['White Lion Vol. 1'] : [],
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < lanternYear,
        entries:
          i === 0
            ? []
            : i === 1
              ? ['First Day', 'Returning Survivors']
              : i === 5
                ? ['Hands of Heat']
                : i === 12
                  ? ['Principle: Conviction']
                  : []
      })),
    lostSettlements: 0,
    notes:
      variant === 1
        ? 'Early game settlement'
        : 'Mid-game settlement with multiple innovations'
  }
}

/**
 * Create People of the Sun Settlement
 */
function createPeopleOfTheSunSettlement(
  id: number,
  variant: number
): Settlement {
  return {
    id,
    name: `Sun's Haven ${variant}`,
    campaignType: CampaignType.PEOPLE_OF_THE_SUN,
    survivorType: SurvivorType.CORE,
    deathCount: variant * 3,
    population: 12 + variant * 4,
    survivalLimit: 2,
    lanternResearchLevel: variant,
    usesScouts: false,
    innovations: [
      'Language',
      'Symposium',
      ...(variant === 2 ? ['Pottery', 'Hovel'] : [])
    ],
    locations: [
      { name: 'Sacred Pool', unlocked: true },
      { name: 'Blacksmith', unlocked: variant === 2 },
      { name: 'Bone Smith', unlocked: variant === 2 },
      { name: 'Weapon Crafter', unlocked: variant === 2 }
    ],
    principles: [
      {
        name: 'Conviction',
        option1Name: 'Collective Toil',
        option1Selected: variant === 1,
        option2Name: 'Accept Darkness',
        option2Selected: variant === 2
      }
    ],
    quarries: [
      { id: 14, node: MonsterNode.NQ1, unlocked: true },
      { id: 10, node: MonsterNode.NQ2, unlocked: variant === 2 },
      { id: 9, node: MonsterNode.NQ3, unlocked: false }
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
    milestones: [
      {
        name: 'First child is born',
        complete: variant === 2,
        event: 'Principle: New Life'
      },
      {
        name: 'First time death count is updated',
        complete: true,
        event: 'Principle: Death'
      }
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
    gear: ['Cloth', 'Founding Stone'],
    patterns: [],
    seedPatterns: [],
    arrivalBonuses: [],
    departingBonuses: [],
    monsterVolumes: variant === 2 ? ['White Lion Vol. 1'] : [],
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < 1 + variant * 3,
        entries: i === 1 ? ['Returning Survivors'] : []
      })),
    lostSettlements: 0,
    notes:
      variant === 1
        ? 'Focused on symposium path'
        : 'Exploring different innovations'
  }
}

/**
 * Create People of the Stars Settlement
 */
function createPeopleOfTheStarsSettlement(
  id: number,
  variant: number
): Settlement {
  return {
    id,
    name: `Stellar Citadel ${variant}`,
    campaignType: CampaignType.PEOPLE_OF_THE_STARS,
    survivorType: SurvivorType.ARC,
    deathCount: variant * 2,
    population: 18 + variant * 3,
    survivalLimit: 1,
    usesScouts: false,
    ccValue: 5 + variant * 10,
    ccRewards: [
      { name: 'Test Reward 1', cc: 5, unlocked: variant === 2 },
      { name: 'Test Reward 2', cc: 10, unlocked: false },
      { name: 'Test Reward 3', cc: 15, unlocked: false }
    ],
    philosophies: [
      Philosophy.COLLECTIVISM,
      ...(variant === 2 ? [Philosophy.LANTERNISM] : [])
    ],
    knowledges: [
      { name: 'Anatomy', philosophy: Philosophy.COLLECTIVISM },
      ...(variant === 2
        ? [{ name: 'Symposium', philosophy: Philosophy.LANTERNISM }]
        : [])
    ],
    innovations: ['Language', ...(variant === 2 ? ['Paint'] : [])],
    locations: [{ name: 'Bone Smith', unlocked: variant === 2 }],
    principles: [],
    quarries: [
      {
        id: 14,
        node: MonsterNode.NQ1,
        unlocked: true,
        ccPrologue: true,
        ccLevel1: variant === 2
      },
      { id: 10, node: MonsterNode.NQ2, unlocked: variant === 2 }
    ],
    nemeses: [
      {
        id: 3,
        unlocked: true,
        level1: variant === 2,
        level2: false,
        level3: false,
        ccLevel1: true
      }
    ],
    milestones: [
      {
        name: 'First time death count is updated',
        complete: true,
        event: 'Principle: Death'
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
    gear: ['Founding Stone'],
    patterns: [],
    seedPatterns: [],
    arrivalBonuses: [],
    departingBonuses: [],
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < 1 + variant * 4,
        entries: i === 1 ? ['Returning Survivors'] : []
      })),
    lostSettlements: 0,
    notes: 'Arc survivor campaign with collective cognition mechanics'
  }
}

/**
 * Create People of the Dream Keeper Settlement
 */
function createPeopleOfTheDreamKeeperSettlement(
  id: number,
  variant: number
): Settlement {
  return {
    id,
    name: `Dream Sanctuary ${variant}`,
    campaignType: CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
    survivorType: SurvivorType.ARC,
    deathCount: variant,
    population: 14 + variant * 2,
    survivalLimit: 1,
    usesScouts: false,
    ccValue: 3 + variant * 8,
    ccRewards: [
      { name: 'Dream Insight', cc: 5, unlocked: variant === 2 },
      { name: 'Dream Mastery', cc: 12, unlocked: false }
    ],
    philosophies: [
      Philosophy.DREAMISM,
      ...(variant === 2 ? [Philosophy.FACEISM] : [])
    ],
    knowledges: [
      { name: 'Dream Walking', philosophy: Philosophy.DREAMISM },
      ...(variant === 2
        ? [{ name: 'Faceless One', philosophy: Philosophy.FACEISM }]
        : [])
    ],
    innovations: ['Language'],
    locations: [
      { name: 'Dream Altar', unlocked: true },
      { name: 'Bone Smith', unlocked: variant === 2 }
    ],
    principles: [],
    quarries: [
      {
        id: 14,
        node: MonsterNode.NQ1,
        unlocked: true,
        ccPrologue: true,
        ccLevel1: variant === 2
      }
    ],
    nemeses: [
      {
        id: 3,
        unlocked: true,
        level1: false,
        level2: false,
        level3: false,
        ccLevel1: variant === 2
      }
    ],
    milestones: [
      {
        name: 'First time death count is updated',
        complete: true,
        event: 'Principle: Death'
      }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 8,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Screaming Brain',
        amount: 2,
        category: ResourceCategory.STRANGE,
        types: [ResourceType.ORGAN]
      }
    ],
    gear: ['Cloth'],
    patterns: [],
    seedPatterns: [],
    arrivalBonuses: [],
    departingBonuses: [],
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < 1 + variant * 2,
        entries: i === 1 ? ['Returning Survivors'] : []
      })),
    lostSettlements: 0,
    notes: 'Dream-focused Arc campaign'
  }
}

/**
 * Create Custom Settlement
 */
function createCustomSettlement(id: number, variant: number): Settlement {
  const isArc = variant === 3
  return {
    id,
    name: `Custom Settlement ${variant}`,
    campaignType: CampaignType.CUSTOM,
    survivorType: isArc ? SurvivorType.ARC : SurvivorType.CORE,
    deathCount: variant * 4,
    population: 10 + variant * 5,
    survivalLimit: variant,
    usesScouts: variant === 1,
    ...(isArc && {
      ccValue: 15,
      ccRewards: [
        { name: 'Custom Reward 1', cc: 10, unlocked: true },
        { name: 'Custom Reward 2', cc: 20, unlocked: false }
      ],
      philosophies: [Philosophy.COLLECTIVISM, Philosophy.OPTIMISM],
      knowledges: [
        { name: 'Custom Knowledge 1', philosophy: Philosophy.COLLECTIVISM },
        { name: 'Custom Knowledge 2', philosophy: Philosophy.OPTIMISM }
      ]
    }),
    innovations: [
      'Language',
      ...(variant >= 2 ? ['Paint', 'Drums', 'Symposium'] : [])
    ],
    locations: [
      { name: 'Custom Location 1', unlocked: true },
      { name: 'Custom Location 2', unlocked: variant >= 2 },
      { name: 'Custom Location 3', unlocked: false }
    ],
    principles: [
      {
        name: 'Custom Principle',
        option1Name: 'Option A',
        option1Selected: variant === 1,
        option2Name: 'Option B',
        option2Selected: variant >= 2
      }
    ],
    quarries: [
      {
        id: 14,
        node: MonsterNode.NQ1,
        unlocked: true,
        ...(isArc && { ccPrologue: true, ccLevel1: true })
      },
      { id: 10, node: MonsterNode.NQ2, unlocked: variant >= 2 },
      { id: 9, node: MonsterNode.NQ3, unlocked: variant === 3 }
    ],
    nemeses: [
      {
        id: 3,
        unlocked: true,
        level1: variant >= 2,
        level2: variant === 3,
        level3: false,
        ...(isArc && { ccLevel1: true, ccLevel2: variant === 3 })
      },
      {
        id: 9,
        unlocked: variant === 3,
        level1: false,
        level2: false,
        level3: false
      }
    ],
    milestones: [
      {
        name: 'Custom Milestone 1',
        complete: true,
        event: 'Custom Event 1'
      },
      {
        name: 'Custom Milestone 2',
        complete: variant >= 2,
        event: 'Custom Event 2'
      }
    ],
    resources: [
      {
        name: 'Monster Hide',
        amount: 20,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.HIDE]
      },
      {
        name: 'Monster Bone',
        amount: 15,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.BONE]
      },
      {
        name: 'Monster Organ',
        amount: 8,
        category: ResourceCategory.MONSTER,
        types: [ResourceType.ORGAN]
      },
      {
        name: 'Custom Resource',
        amount: 5,
        category: ResourceCategory.STRANGE,
        types: [ResourceType.SCRAP, ResourceType.BONE]
      }
    ],
    gear: [
      'Cloth',
      'Founding Stone',
      ...(variant >= 2 ? ['Custom Gear 1', 'Custom Gear 2'] : [])
    ],
    patterns: variant >= 2 ? ['Custom Pattern 1'] : [],
    seedPatterns: variant === 3 ? ['Custom Seed Pattern'] : [],
    arrivalBonuses: variant >= 2 ? ['+1 Strength on Arrival'] : [],
    departingBonuses: variant === 3 ? ['+1 Survival on Departure'] : [],
    timeline: Array(40)
      .fill(null)
      .map((_, i) => ({
        completed: i < variant * 5,
        entries:
          i === 1
            ? ['Custom Event Year 1']
            : i === 5
              ? ['Custom Event Year 5']
              : []
      })),
    lostSettlements: variant - 1,
    notes: `Custom campaign ${variant} - ${isArc ? 'Arc Survivors' : 'Core Survivors'}`
  }
}

/**
 * Create Survivors for Settlement
 */
function createSurvivorsForSettlement(
  settlementId: number,
  startId: number,
  count: number,
  survivorType: SurvivorType = SurvivorType.CORE
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
      survival: 1 + (isExperienced ? 2 : 0),
      insanity: isExperienced ? 3 : 0,
      courage: isExperienced ? 3 : 0,
      understanding: isExperienced ? 2 : 0,
      huntXP: isExperienced ? 8 : i,
      huntXPRankUp: isExperienced ? [2, 6] : [],
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
      accuracy: isExperienced ? 2 : 0,
      strength: isExperienced ? 2 : 0,
      evasion: isExperienced ? 1 : 0,
      luck: isExperienced ? 1 : 0,
      speed: isExperienced ? 1 : 0,
      movement: 5,
      fightingArts: isExperienced
        ? ['Mighty Strike', 'Leader']
        : i % 2 === 0
          ? ['Mighty Strike']
          : [],
      disorders: isExperienced ? ['Anxiety', 'Binge Eating Disorder'] : [],
      abilitiesAndImpairments: isExperienced ? ['Explore', 'Prepared'] : [],
      dead: isDead,
      retired: isRetired,
      skipNextHunt: i % 7 === 0 && !isDead && !isRetired,
      notes: isExperienced
        ? 'Veteran survivor with extensive experience'
        : isDead
          ? 'Fell in battle against overwhelming darkness'
          : isRetired
            ? 'Retired to support the settlement'
            : undefined,
      // Severe injuries for some survivors
      armDismembered: hasInjuries ? 1 : 0,
      legBroken: hasInjuries ? 1 : 0,
      headBlind: hasInjuries ? 1 : 0,
      bodyBrokenRib: hasInjuries ? 2 : 0,
      // Hunt/Showdown attributes
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
      // Default boolean values
      canDash: false,
      canDodge: true,
      canFistPump: false,
      canEncourage: isExperienced,
      canSpendSurvival: true,
      canSurge: false,
      canUseFightingArtsOrKnowledges: true,
      hasAnalyze: false,
      hasExplore: isExperienced,
      hasMatchmaker: false,
      hasPrepared: isExperienced,
      hasStalwart: false,
      hasTinker: false,
      rerollUsed: false,
      // Additional severe injury defaults
      armBroken: 0,
      armContracture: 0,
      armRupturedMuscle: false,
      bodyDestroyedBack: false,
      bodyGapingChestWound: 0,
      headDeaf: false,
      headIntracranialHemorrhage: false,
      headShatteredJaw: false,
      legDismembered: 0,
      legHamstrung: false,
      waistBrokenHip: false,
      waistDestroyedGenitals: false,
      waistIntestinalProlapse: false,
      waistWarpedPelvis: 0,
      // Arc-specific defaults
      canEndure: false,
      lumi: 0,
      systemicPressure: 0,
      torment: 0,
      neurosis: undefined,
      philosophy: null,
      philosophyRank: 0,
      knowledge1: undefined,
      knowledge1ObservationRank: 0,
      knowledge1ObservationConditions: undefined,
      knowledge1RankUp: undefined,
      knowledge1Rules: undefined,
      knowledge2: undefined,
      knowledge2ObservationRank: 0,
      knowledge2ObservationConditions: undefined,
      knowledge2RankUp: undefined,
      knowledge2Rules: undefined,
      tenetKnowledge: undefined,
      tenetKnowledgeObservationConditions: undefined,
      tenetKnowledgeObservationRank: 0,
      tenetKnowledgeRankUp: undefined,
      tenetKnowledgeRules: undefined,
      // People of the Stars abilities
      hasAbsoluteReaper: false,
      hasAbsoluteRust: false,
      hasAbsoluteStorm: false,
      hasAbsoluteWitch: false,
      hasGamblerReaper: false,
      hasGamblerRust: false,
      hasGamblerStorm: false,
      hasGamblerWitch: false,
      hasGoblinReaper: false,
      hasGoblinRust: false,
      hasGoblinStorm: false,
      hasGoblinWitch: false,
      hasSculptorReaper: false,
      hasSculptorRust: false,
      hasSculptorStorm: false,
      hasSculptorWitch: false,
      // Arrays
      cursedGear: [],
      secretFightingArts: isExperienced ? ['Counter-Weighted Axe'] : [],
      nextDeparture: [],
      oncePerLifetime: isExperienced ? ['Once Per Lifetime Bonus'] : []
    }

    // Override Arc-specific properties if this is an Arc survivor
    if (survivorType === SurvivorType.ARC) {
      baseSurvivor.canEndure = isExperienced
      baseSurvivor.lumi = isExperienced ? 5 : i
      baseSurvivor.systemicPressure = isExperienced ? 2 : 0
      baseSurvivor.torment = isExperienced ? 1 : 0
      baseSurvivor.neurosis = isExperienced ? 'Fear of Darkness' : undefined
      baseSurvivor.philosophy = isExperienced ? Philosophy.COLLECTIVISM : null
      baseSurvivor.philosophyRank = isExperienced ? 2 : 0
      baseSurvivor.knowledge1 = 'Anatomy'
      baseSurvivor.knowledge1ObservationRank = isExperienced ? 3 : 1
      baseSurvivor.knowledge1ObservationConditions = 'Observe during showdown'
      baseSurvivor.knowledge1RankUp = isExperienced ? 2 : undefined
      baseSurvivor.knowledge1Rules = 'Understanding of anatomy'
      baseSurvivor.knowledge2 = isExperienced ? 'Symposium' : undefined
      baseSurvivor.knowledge2ObservationRank = isExperienced ? 2 : 0
      baseSurvivor.tenetKnowledge = isExperienced
        ? 'Tenet Knowledge Example'
        : undefined
      baseSurvivor.tenetKnowledgeObservationRank = isExperienced ? 1 : 0
    }

    survivors.push(baseSurvivor)
  }

  return survivors
}

/**
 * Create Hunt
 */
function createHunt(
  id: number,
  settlementId: number,
  startSurvivorId: number,
  monsterType: MonsterType
): Hunt {
  const survivors = [
    startSurvivorId,
    startSurvivorId + 1,
    startSurvivorId + 2,
    startSurvivorId + 3
  ]

  const colors = [
    ColorChoice.RED,
    ColorChoice.BLUE,
    ColorChoice.GREEN,
    ColorChoice.YELLOW
  ]

  return {
    id,
    settlementId,
    survivors,
    monsterPosition: 6,
    survivorPosition: 0,
    monster: {
      name: monsterType === MonsterType.QUARRY ? 'White Lion' : 'Butcher',
      type: monsterType,
      level: MonsterLevel.LEVEL_1,
      toughness: monsterType === MonsterType.QUARRY ? 8 : 10,
      movement: monsterType === MonsterType.QUARRY ? 6 : 2,
      damage: 0,
      wounds: 0,
      speed: 0,
      accuracy: 0,
      strength: 0,
      evasion: 0,
      luck: 0,
      aiDeck: {
        basic: 8,
        advanced: 0,
        legendary: 0
      },
      aiDeckRemaining: 8,
      knockedDown: false,
      moods: [],
      traits:
        monsterType === MonsterType.QUARRY ? ['Indomitable'] : ['Stampede'],
      notes: '',
      accuracyTokens: 0,
      damageTokens: 0,
      evasionTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      speedTokens: 0,
      strengthTokens: 0
    },
    survivorDetails: survivors.map((survivorId, index) => ({
      id: survivorId,
      color: colors[index],
      notes: '',
      accuracyTokens: 0,
      evasionTokens: 0,
      insanityTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      speedTokens: 0,
      strengthTokens: 0,
      survivalTokens: 0
    }))
  }
}

/**
 * Create Showdown
 */
function createShowdown(
  id: number,
  settlementId: number,
  startSurvivorId: number,
  monsterType: MonsterType
): Showdown {
  const survivors = [startSurvivorId, startSurvivorId + 1, startSurvivorId + 2]

  const colors = [ColorChoice.PURPLE, ColorChoice.ORANGE, ColorChoice.TEAL]

  return {
    id,
    settlementId,
    survivors,
    ambush: AmbushType.NONE,
    monster: {
      name:
        monsterType === MonsterType.QUARRY ? 'Screaming Antelope' : 'Butcher',
      type: monsterType,
      level: MonsterLevel.LEVEL_2,
      toughness: monsterType === MonsterType.QUARRY ? 10 : 12,
      movement: monsterType === MonsterType.QUARRY ? 7 : 2,
      damage: 2,
      wounds: 0,
      speed: 0,
      accuracy: 0,
      strength: 0,
      evasion: 0,
      luck: 0,
      aiDeck: {
        basic: 6,
        advanced: 4,
        legendary: 0
      },
      aiDeckRemaining: 10,
      knockedDown: false,
      moods: ['Agitated'],
      traits:
        monsterType === MonsterType.QUARRY
          ? ['Fast', 'Skittish']
          : ['Unrelenting', 'Menacing'],
      notes: 'Mid-showdown state',
      accuracyTokens: 0,
      damageTokens: 1,
      evasionTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      speedTokens: 0,
      strengthTokens: 0
    },
    survivorDetails: survivors.map((survivorId, index) => ({
      id: survivorId,
      color: colors[index],
      notes: index === 0 ? 'Taking point' : '',
      bleedingTokens: index === 1 ? 1 : 0,
      blockTokens: 0,
      deflectTokens: 0,
      knockedDown: index === 2,
      priorityTarget: index === 0,
      accuracyTokens: 0,
      evasionTokens: 0,
      insanityTokens: 0,
      luckTokens: 0,
      movementTokens: 0,
      speedTokens: 0,
      strengthTokens: 0,
      survivalTokens: index === 0 ? 1 : 0
    })),
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
