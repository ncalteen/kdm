import { CustomCampaign } from '@/lib/campaigns/custom'
import { PeopleOfTheDreamKeeper } from '@/lib/campaigns/potdk'
import { PeopleOfTheLantern } from '@/lib/campaigns/potl'
import { PeopleOfTheStars } from '@/lib/campaigns/potstars'
import { PeopleOfTheSun } from '@/lib/campaigns/potsun'
import {
  DefaultSquiresSuspicion,
  SquiresOfTheCitadel
} from '@/lib/campaigns/squires'
import {
  CampaignType,
  MonsterNode,
  MonsterNodeNumeric,
  SurvivorType
} from '@/lib/enums'
import { getNextSettlementId } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { NewSettlementInput } from '@/schemas/new-settlement-input'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { Settlement } from '@/schemas/settlement'
import { SettlementNemesis } from '@/schemas/settlement-nemesis'
import { SettlementQuarry } from '@/schemas/settlement-quarry'

/**
 * Get Monster Node Mapping for a Campaign Type
 *
 * This function takes a campaign type and returns a mapping of monster nodes to
 * monster IDs for that campaign.
 *
 * @param campaignType Campaign Type
 * @returns Monster node mapping
 */
export function getMonsterNodeMapping(campaignType: CampaignType): {
  NQ1: QuarryMonsterData[]
  NQ2: QuarryMonsterData[]
  NQ3: QuarryMonsterData[]
  NQ4: QuarryMonsterData[]
  NN1: NemesisMonsterData[]
  NN2: NemesisMonsterData[]
  NN3: NemesisMonsterData[]
  CO: NemesisMonsterData[]
  FI: NemesisMonsterData[]
} {
  const template = {
    [CampaignType.CUSTOM]: CustomCampaign,
    [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: PeopleOfTheDreamKeeper,
    [CampaignType.PEOPLE_OF_THE_LANTERN]: PeopleOfTheLantern,
    [CampaignType.PEOPLE_OF_THE_STARS]: PeopleOfTheStars,
    [CampaignType.PEOPLE_OF_THE_SUN]: PeopleOfTheSun,
    [CampaignType.SQUIRES_OF_THE_CITADEL]: SquiresOfTheCitadel
  }[campaignType]

  return {
    NQ1: template.quarries.filter((q) => q.node === MonsterNode.NQ1),
    NQ2: template.quarries.filter((q) => q.node === MonsterNode.NQ2),
    NQ3: template.quarries.filter((q) => q.node === MonsterNode.NQ3),
    NQ4: template.quarries.filter((q) => q.node === MonsterNode.NQ4),
    NN1: template.nemeses.filter((n) => n.node === MonsterNode.NN1),
    NN2: template.nemeses.filter((n) => n.node === MonsterNode.NN2),
    NN3: template.nemeses.filter((n) => n.node === MonsterNode.NN3),
    CO: template.nemeses.filter((n) => n.node === MonsterNode.CO),
    FI: template.nemeses.filter((n) => n.node === MonsterNode.FI)
  }
}

/**
 * Settlement Creator Function
 *
 * This function takes in either the preselected campaign or custom campaign
 * data and uses it to create a new settlement. Preselected campaigns are
 * defined in src/lib/campaigns. Custom campaigns require a user provide the
 * specific monster(s) they wish to include.
 *
 * @param campaign Campaign Data
 * @param options New Settlement Input Options
 * @returns Newly Created Settlement
 */
export function createSettlementFromOptions(
  campaign: Campaign,
  options: NewSettlementInput
): Settlement {
  const template = {
    [CampaignType.CUSTOM]: CustomCampaign,
    [CampaignType.PEOPLE_OF_THE_DREAM_KEEPER]: PeopleOfTheDreamKeeper,
    [CampaignType.PEOPLE_OF_THE_LANTERN]: PeopleOfTheLantern,
    [CampaignType.PEOPLE_OF_THE_STARS]: PeopleOfTheStars,
    [CampaignType.PEOPLE_OF_THE_SUN]: PeopleOfTheSun,
    [CampaignType.SQUIRES_OF_THE_CITADEL]: SquiresOfTheCitadel
  }[options.campaignType]

  // Get monster selections - either from options (custom campaign) or from template
  const monsterSelections =
    options.monsters ?? getMonsterNodeMapping(options.campaignType)
  const quarries = [
    ...monsterSelections.NQ1,
    ...monsterSelections.NQ2,
    ...monsterSelections.NQ3,
    ...monsterSelections.NQ4
  ]
  const nemeses = [
    ...monsterSelections.NN1,
    ...monsterSelections.NN2,
    ...monsterSelections.NN3,
    ...monsterSelections.CO,
    ...monsterSelections.FI
  ]

  // Insantiate the base settlement object. Deep copies are made of arrays and
  // objects to prevent reference issues.
  const settlement: Settlement = {
    arrivalBonuses: [],
    campaignType: options.campaignType,
    deathCount: 0,
    departingBonuses: [],
    gear: [],
    id: getNextSettlementId(campaign),
    innovations: [...template.innovations],
    lanternResearchLevel: 0,
    locations: template.locations.map((loc) => ({ ...loc })),
    lostSettlements: 0,
    milestones: template.milestones
      .map((m) => ({ ...m }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    monsterVolumes: [],
    name: options.name,
    nemeses: [],
    notes: '',
    patterns: [],
    population: 0,
    principles: template.principles
      .map((p) => ({ ...p }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    quarries: [],
    resources: [],
    seedPatterns: [],
    survivalLimit: 1,
    survivorType: options.survivorType,
    timeline: template.timeline.map((year) => ({
      ...year,
      entries: [...year.entries]
    })),
    usesScouts: options.usesScouts
  }

  // Arc survivor data.
  if (options.survivorType === SurvivorType.ARC) {
    settlement.ccRewards = template.ccRewards
    settlement.ccValue = 0
    settlement.knowledges = []
    settlement.philosophies = []

    settlement.locations.push({ name: 'Forum', unlocked: false })
  }

  // Squires of the Citadel data.
  if (options.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
    settlement.suspicions = DefaultSquiresSuspicion

  // Nemeses
  for (const nemesis of nemeses) {
    const settlementNemesisData: SettlementNemesis = {
      level1Defeated: false,
      level2Defeated: false,
      level3Defeated: false,
      level4Defeated: false,
      name: nemesis.name,
      node: nemesis.node,
      unlocked: false
    }

    if (nemesis.level1 !== undefined)
      settlementNemesisData.level1 = nemesis.level1
    if (nemesis.level2 !== undefined)
      settlementNemesisData.level2 = nemesis.level2
    if (nemesis.level3 !== undefined)
      settlementNemesisData.level3 = nemesis.level3
    if (nemesis.level4 !== undefined)
      settlementNemesisData.level4 = nemesis.level4
    if (nemesis.vignette !== undefined)
      settlementNemesisData.vignette = nemesis.vignette

    if (options.survivorType === SurvivorType.ARC) {
      settlementNemesisData.ccLevel1 = false
      settlementNemesisData.ccLevel2 = false
      settlementNemesisData.ccLevel3 = false
    }

    settlement.nemeses.push(settlementNemesisData)

    // Add the respective timeline events for this nemesis. Only add them if
    // they are included in all campaigns (they are string), or they include
    // the current campaign type. Custom campaigns are not included here, the
    // user would be building their own timeline during gameplay.
    for (let year = 0; year < settlement.timeline.length; year++) {
      const timelineYear = settlement.timeline[year]

      if (nemesis.timeline[year] === undefined) continue

      for (const entry of nemesis.timeline[year])
        if (typeof entry === 'string') timelineYear.entries.push(entry)
        else if (entry.campaigns.includes(options.campaignType))
          timelineYear.entries.push(entry.title)
    }
  }

  // Quarries
  for (const quarry of quarries) {
    const settlementQuarryData: SettlementQuarry = {
      huntBoard: quarry.huntBoard,
      name: quarry.name,
      node: quarry.node,
      unlocked: false
    }

    if (quarry.alternate !== undefined)
      settlementQuarryData.alternate = quarry.alternate
    if (quarry.level1 !== undefined) settlementQuarryData.level1 = quarry.level1
    if (quarry.level2 !== undefined) settlementQuarryData.level2 = quarry.level2
    if (quarry.level3 !== undefined) settlementQuarryData.level3 = quarry.level3
    if (quarry.level4 !== undefined) settlementQuarryData.level4 = quarry.level4
    if (quarry.vignette !== undefined)
      settlementQuarryData.vignette = quarry.vignette

    if (options.survivorType === SurvivorType.ARC) {
      settlementQuarryData.ccLevel1 = false
      settlementQuarryData.ccLevel2 = [false, false]
      settlementQuarryData.ccLevel3 = [false, false, false]

      if (quarry.prologue) settlementQuarryData.ccPrologue = false
    }

    settlement.quarries.push(settlementQuarryData)

    // Add the respective timeline events for this quarry. Only add them if
    // they are included in all campaigns (they are string), or they include
    // the current campaign type. Custom campaigns are not included here, the
    // user would be building their own timeline during gameplay.
    for (let year = 0; year < settlement.timeline.length; year++) {
      const timelineYear = settlement.timeline[year]

      if (quarry.timeline[year] === undefined) continue

      for (const entry of quarry.timeline[year])
        if (typeof entry === 'string') timelineYear.entries.push(entry)
        else if (entry.campaigns.includes(options.campaignType))
          timelineYear.entries.push(entry.title)
    }

    // Add the respective settlement locations for this quarry.
    settlement.locations.push(...quarry.locations)
    if (quarry.alternate !== undefined)
      settlement.locations.push(...(quarry.alternate.locations ?? []))
    if (quarry.vignette !== undefined)
      settlement.locations.push(...(quarry.vignette.locations ?? []))

    // Add the respective CC rewards for this quarry.
    if (options.survivorType === SurvivorType.ARC) {
      if (settlement.ccRewards === undefined) settlement.ccRewards = []
      settlement.ccRewards.push(...quarry.ccRewards)
    }
  }

  // Sort various settlement arrays for consistency.
  if (settlement.ccRewards)
    settlement.ccRewards = settlement.ccRewards.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  settlement.locations = settlement.locations.sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  settlement.nemeses = settlement.nemeses.sort((a, b) => {
    return MonsterNodeNumeric[a.node] - MonsterNodeNumeric[b.node]
  })
  settlement.quarries = settlement.quarries.sort((a, b) => {
    return MonsterNodeNumeric[a.node] - MonsterNodeNumeric[b.node]
  })

  for (let year = 0; year < settlement.timeline.length; year++)
    settlement.timeline[year].entries = settlement.timeline[year].entries.sort(
      (a, b) => a.localeCompare(b)
    )

  return settlement
}
