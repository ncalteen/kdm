import { CustomCampaign } from '@/lib/campaigns/custom'
import { PeopleOfTheDreamKeeper } from '@/lib/campaigns/potdk'
import { PeopleOfTheLantern } from '@/lib/campaigns/potl'
import { PeopleOfTheStars } from '@/lib/campaigns/potstars'
import { PeopleOfTheSun } from '@/lib/campaigns/potsun'
import {
  DefaultSquiresSuspicion,
  SquiresOfTheCitadel
} from '@/lib/campaigns/squires'
import { CampaignType, MonsterNodeNumeric, SurvivorType } from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { getNextSettlementId } from '@/lib/utils'
import {
  Nemesis,
  NewSettlementInput,
  Quarry,
  Settlement
} from '@/schemas/settlement'

/**
 * Settlement Creator Function
 *
 * This function takes in either the preselected campaign or custom campaign
 * data and uses it to create a new settlement. Preselected campaigns are
 * defined in src/lib/campaigns. Custom campaigns require a user provide the
 * specific monster(s) they wish to include.
 */
export function createSettlementFromOptions(
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

  // Insantiate the base settlement object.
  const settlement: Settlement = {
    arrivalBonuses: [],
    campaignType: options.campaignType,
    deathCount: 0,
    departingBonuses: [],
    gear: [],
    id: getNextSettlementId(),
    innovations: template.innovations,
    lanternResearchLevel: 0,
    locations: template.locations,
    lostSettlements: 0,
    milestones: template.milestones.sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    monsterVolumes: [],
    name: options.name,
    nemeses: [],
    notes: '',
    patterns: [],
    population: 0,
    principles: template.principles.sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    quarries: [],
    resources: [],
    seedPatterns: [],
    survivalLimit: 1,
    survivorType: options.survivorType,
    usesScouts: options.usesScouts,
    timeline: template.timeline
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
  for (const nemesisId of template.nemeses) {
    const data = NEMESES[nemesisId as keyof typeof NEMESES]

    const nemesis: Nemesis = {
      id: nemesisId,
      level1: false,
      level2: false,
      level3: false,
      unlocked: false
    }

    if (options.survivorType === SurvivorType.ARC) {
      nemesis.ccLevel1 = false
      nemesis.ccLevel2 = false
      nemesis.ccLevel3 = false
    }

    settlement.nemeses.push(nemesis)

    // Add the respective timeline events for this nemesis. Only add them if
    // they are included in all campaigns (they are string), or they include
    // the current campaign type. Custom campaigns are not included here, as the
    // user would be building their own timeline during gameplay.
    for (let year = 0; year < settlement.timeline.length; year++) {
      const timelineYear = settlement.timeline[year]

      for (const entry of data.main.timeline[year] || [])
        if (typeof entry === 'string') timelineYear.entries.push(entry)
        else if (entry.campaigns.includes(options.campaignType))
          timelineYear.entries.push(entry.title)
    }
  }

  // Quarries
  for (const quarryId of template.quarries) {
    const data = QUARRIES[quarryId as keyof typeof QUARRIES]

    const quarry: Quarry = {
      id: quarryId,
      node: data.main.node,
      unlocked: false
    }

    if (options.survivorType === SurvivorType.ARC) {
      quarry.ccLevel1 = false
      quarry.ccLevel2 = [false, false]
      quarry.ccLevel3 = [false, false, false]
      quarry.ccPrologue = false
    }

    settlement.quarries.push(quarry)

    // Add the respective timeline events for this quarry. Only add them if
    // they are included in all campaigns (they are string), or they include
    // the current campaign type. Custom campaigns are not included here, as the
    // user would be building their own timeline during gameplay.
    for (let year = 0; year < settlement.timeline.length; year++) {
      const timelineYear = settlement.timeline[year]

      for (const entry of data.main.timeline[year] || [])
        if (typeof entry === 'string') timelineYear.entries.push(entry)
        else if (entry.campaigns.includes(options.campaignType))
          timelineYear.entries.push(entry.title)
    }

    // Add the respective settlement locations for this quarry.
    settlement.locations.push(...data.main.locations)
    if ('vignette' in data)
      settlement.locations.push(...data.vignette.locations)

    // Add the respective CC rewards for this quarry.
    if (options.survivorType === SurvivorType.ARC)
      settlement.ccRewards!.push(...data.main.ccRewards)
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
    const nemesisA = NEMESES[a.id as keyof typeof NEMESES].main
    const nemesisB = NEMESES[b.id as keyof typeof NEMESES].main

    return (
      MonsterNodeNumeric[nemesisA.node as keyof typeof MonsterNodeNumeric] -
      MonsterNodeNumeric[nemesisB.node as keyof typeof MonsterNodeNumeric]
    )
  })
  settlement.quarries = settlement.quarries.sort((a, b) => {
    const quarryA = QUARRIES[a.id as keyof typeof QUARRIES].main
    const quarryB = QUARRIES[b.id as keyof typeof QUARRIES].main

    return (
      MonsterNodeNumeric[quarryA.node as keyof typeof MonsterNodeNumeric] -
      MonsterNodeNumeric[quarryB.node as keyof typeof MonsterNodeNumeric]
    )
  })

  for (let year = 0; year < settlement.timeline.length; year++)
    settlement.timeline[year].entries = settlement.timeline[year].entries.sort(
      (a, b) => a.localeCompare(b)
    )

  return settlement
}
