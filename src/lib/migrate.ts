import { basicHuntBoard } from '@/lib/common'
import {
  ColorChoice,
  MonsterLevel,
  MonsterNode,
  MonsterType,
  SurvivorType
} from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { ATNAS } from '@/lib/monsters/atnas'
import { BLACK_KNIGHT } from '@/lib/monsters/black-knight'
import { BULLFROGDOG } from '@/lib/monsters/bullfrogdog'
import { BUTCHER } from '@/lib/monsters/butcher'
import { CRIMSON_CROCODILE } from '@/lib/monsters/crimson-crocodile'
import { DRAGON_KING } from '@/lib/monsters/dragon-king'
import { DUNG_BEETLE_KNIGHT } from '@/lib/monsters/dung-beetle-knight'
import { DYING_GOD } from '@/lib/monsters/dying-god'
import { FLOWER_KNIGHT } from '@/lib/monsters/flower-knight'
import { FROGDOG } from '@/lib/monsters/frogdog'
import { GAMBLER } from '@/lib/monsters/gambler'
import { GODHAND } from '@/lib/monsters/godhand'
import { GOLD_SMOKE_KNIGHT } from '@/lib/monsters/gold-smoke-knight'
import { GORM } from '@/lib/monsters/gorm'
import { GREAT_DEVOURER } from '@/lib/monsters/great-devourer'
import { HAND } from '@/lib/monsters/hand'
import { KILLENIUM_BUTCHER } from '@/lib/monsters/killenium-butcher'
import { KING } from '@/lib/monsters/king'
import { KINGS_MAN } from '@/lib/monsters/kings-man'
import { LION_GOD } from '@/lib/monsters/lion-god'
import { LONELY_TREE } from '@/lib/monsters/lonely-tree'
import { MANHUNTER } from '@/lib/monsters/manhunter'
import { PARIAH } from '@/lib/monsters/pariah'
import { PHOENIX } from '@/lib/monsters/phoenix'
import { RED_WITCHES } from '@/lib/monsters/red-witches'
import { SCREAMING_ANTELOPE } from '@/lib/monsters/screaming-antelope'
import { SCREAMING_NUKALOPE } from '@/lib/monsters/screaming-nukalope'
import { SLENDERMAN } from '@/lib/monsters/slenderman'
import { SMOG_SINGERS } from '@/lib/monsters/smog-singers'
import { SPIDICULES } from '@/lib/monsters/spidicules'
import { SUNSTALKER } from '@/lib/monsters/sunstalker'
import { TYRANT } from '@/lib/monsters/tyrant'
import { WATCHER } from '@/lib/monsters/watcher'
import { WHITE_GIGALION } from '@/lib/monsters/white-gigalion'
import { WHITE_LION } from '@/lib/monsters/white-lion'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { SettlementNemesis } from '@/schemas/settlement-nemesis'
import { SettlementQuarry } from '@/schemas/settlement-quarry'
import { Showdown } from '@/schemas/showdown'
import * as packageInfo from '../../package.json'

/**
 * Migrate Campaign to Latest Schema Version
 *
 * @param campaign Campaign to Migrate
 * @returns Migrated Campaign
 */
export function migrateCampaign(campaign: Campaign): Campaign {
  console.log(
    `Migrating Campaign (${campaign.version ?? '0.12.0'} -> ${packageInfo.version})`
  )

  // Add version migration steps here...
  if (campaign.version === undefined || campaign.version === '0.12.0')
    migrateTo0_13_0(campaign)
  if (campaign.version === '0.13.0') migrateTo0_13_1(campaign)
  if (campaign.version === '0.13.1') migrateTo0_14_0(campaign)
  if (campaign.version === '0.14.0') migrateTo0_14_1(campaign)
  if (campaign.version === '0.14.1') migrateTo0_14_2(campaign)
  if (campaign.version === '0.14.2') migrateTo0_15_0(campaign)
  if (campaign.version === '0.15.0') migrateTo0_16_0(campaign)
  if (campaign.version === '0.16.0') migrateTo0_17_0(campaign)
  if (campaign.version === '0.17.0') migrateTo0_18_0(campaign)

  return campaign
}

/**
 * Migration logic from version 0.12.x to 0.13.x
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_13_0(campaign: Campaign) {
  console.log('Migrating to 0.13.0')

  // Unchnanged
  campaign.selectedHuntId = campaign.selectedHuntId ?? null
  campaign.selectedShowdownId = campaign.selectedShowdownId ?? null
  campaign.selectedSettlementId = campaign.selectedSettlementId ?? null
  campaign.selectedSurvivorId = campaign.selectedSurvivorId ?? null
  campaign.selectedTab = campaign.selectedTab ?? null
  campaign.settings = {
    disableToasts: campaign.settings?.disableToasts ?? false,
    unlockedMonsters: {
      killeniumButcher:
        campaign.settings?.unlockedMonsters?.killeniumButcher ?? false,
      screamingNukalope:
        campaign.settings?.unlockedMonsters?.screamingNukalope ?? false,
      whiteGigalion: campaign.settings?.unlockedMonsters?.whiteGigalion ?? false
    }
  }
  campaign.survivors = campaign.survivors ?? []

  // Custom monsters is a new addition.
  // @ts-expect-error -- Old Schema
  campaign.customMonsters = campaign.customMonsters ?? {}

  // Hunts use a new AI deck structure.
  campaign.hunts = (campaign.hunts ?? []).map((hunt) => {
    // @ts-expect-error -- Old Schema
    const originalAIDeckSize = hunt.monster.aiDeckSize ?? 0

    // @ts-expect-error -- Old Schema
    hunt.monster.aiDeck = {
      basic: originalAIDeckSize,
      advanced: 0,
      legendary: 0
    }
    // @ts-expect-error -- Old Schema
    hunt.monster.aiDeckRemaining = originalAIDeckSize

    return hunt
  })

  campaign.settlements = (campaign.settlements ?? []).map((settlement) => {
    // Settlement nemeses use ID instead of name.
    // @ts-expect-error -- Old Schema
    settlement.nemeses = (settlement.nemeses ?? []).map((nemesis) => {
      let nemesisId = -1

      for (const key of Object.keys(NEMESES)) {
        const nemesisKey = key as unknown as keyof typeof NEMESES

        // @ts-expect-error -- Old Schema
        if (NEMESES[nemesisKey].main.name === nemesis.name) {
          nemesisId = parseInt(key)
          break
        }
      }

      return {
        ccLevel1: nemesis.ccLevel1,
        ccLevel2: nemesis.ccLevel2,
        ccLevel3: nemesis.ccLevel3,
        id: nemesisId,
        level1: nemesis.level1 ?? false,
        level2: nemesis.level2 ?? false,
        level3: nemesis.level3 ?? false,
        level4: nemesis.level4,
        unlocked: nemesis.unlocked ?? false
      }
    })

    // Settlement quarries use ID instead of name.
    // @ts-expect-error -- Old Schema
    settlement.quarries = (settlement.quarries ?? []).map((quarry) => {
      let quarryId = -1
      let quarryNode = MonsterNode.NQ1

      for (const key of Object.keys(QUARRIES)) {
        const quarryKey = key as unknown as keyof typeof QUARRIES

        // @ts-expect-error -- Old Schema
        if (QUARRIES[quarryKey].main.name === quarry.name) {
          quarryId = parseInt(key)
          // @ts-expect-error -- Old Schema
          quarryNode = QUARRIES[quarryKey].main.node
          break
        }
      }

      return {
        ccLevel1: quarry.ccLevel1,
        ccLevel2: quarry.ccLevel2,
        ccLevel3: quarry.ccLevel3,
        ccPrologue: quarry.ccPrologue,
        id: quarryId,
        node: quarryNode,
        unlocked: quarry.unlocked ?? false
      }
    })

    return settlement
  })

  // Showdowns use a new AI deck structure.
  campaign.showdowns = (campaign.showdowns ?? []).map((showdown) => {
    // @ts-expect-error -- Old Schema
    const originalAIDeckSize = showdown.monster.aiDeckSize ?? 0

    // @ts-expect-error -- Old Schema
    showdown.monster.aiDeck = {
      basic: originalAIDeckSize,
      advanced: 0,
      legendary: 0
    }
    // @ts-expect-error -- Old Schema
    showdown.monster.aiDeckRemaining = originalAIDeckSize

    return showdown
  })

  // Migration complete. Update version.
  campaign.version = '0.13.0'
}

/**
 * Migration logic from version 0.13.0 to 0.13.1
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_13_1(campaign: Campaign) {
  console.log('Migrating to 0.13.1')

  // Hunts should include the hunt board layout.
  campaign.hunts = (campaign.hunts ?? []).map((hunt) => {
    // If hunt board already exists, skip
    // @ts-expect-error -- Old Schema
    if (hunt.monster.huntBoard) return hunt

    // Check if there is a quarry or custom monster to determine hunt board.
    // Otherwise, default to basic hunt board.
    const quarry = Object.values(QUARRIES).find(
      (quarry) =>
        // @ts-expect-error -- Old Schema
        quarry.name.toLowerCase() === hunt.monster.name.toLowerCase()
    )

    // @ts-expect-error -- Old Schema
    const custom = Object.values(campaign.customMonsters ?? {}).find(
      (monster) =>
        // @ts-expect-error -- Old Schema
        monster.main.name.toLowerCase() === hunt.monster.name.toLowerCase()
    )

    // @ts-expect-error -- Old Schema
    if (quarry) hunt.monster.huntBoard = quarry.huntBoard
    // @ts-expect-error -- Old Schema
    else if (custom && 'huntBoard' in custom.main)
      // @ts-expect-error -- Old Schema
      hunt.monster.huntBoard = custom.main.huntBoard
    // @ts-expect-error -- Old Schema
    else hunt.monster.huntBoard = basicHuntBoard

    return hunt
  })

  // Migration complete. Update version.
  campaign.version = '0.13.1'
}

/**
 * Migration logic from version 0.13.1 to 0.14.0
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_14_0(campaign: Campaign) {
  console.log('Migrating to 0.14.0')

  const nemesisLookup = {
    1: ATNAS,
    2: BLACK_KNIGHT,
    3: {
      ...BUTCHER,
      vignette: KILLENIUM_BUTCHER
    },
    4: DYING_GOD,
    5: GAMBLER,
    6: GODHAND,
    7: GOLD_SMOKE_KNIGHT,
    8: HAND,
    9: KINGS_MAN,
    10: LION_GOD,
    11: LONELY_TREE,
    12: MANHUNTER,
    13: PARIAH,
    14: RED_WITCHES,
    15: SLENDERMAN,
    16: GREAT_DEVOURER,
    18: TYRANT,
    19: WATCHER
  }

  const quarryLookup = {
    1: CRIMSON_CROCODILE,
    2: DRAGON_KING,
    3: DUNG_BEETLE_KNIGHT,
    4: FLOWER_KNIGHT,
    5: {
      ...FROGDOG,
      alternate: BULLFROGDOG
    },
    6: GORM,
    7: KING,
    8: LION_GOD,
    9: PHOENIX,
    10: {
      ...SCREAMING_ANTELOPE,
      vignette: SCREAMING_NUKALOPE
    },
    11: SMOG_SINGERS,
    12: SPIDICULES,
    13: SUNSTALKER,
    14: {
      ...WHITE_LION,
      vignette: WHITE_GIGALION
    }
  }

  if (!campaign.customNemeses) campaign.customNemeses = {}
  if (!campaign.customQuarries) campaign.customQuarries = {}

  // Iterate over customMonsters and organize by type
  // @ts-expect-error -- Old Schema
  for (const key of Object.keys(campaign.customMonsters ?? {})) {
    // @ts-expect-error -- Old Schema
    const monster = campaign.customMonsters[key].main

    if (monster.type === 'Quarry') {
      campaign.customQuarries[key] = {
        ccRewards: [],
        huntBoard: monster.huntBoard,
        locations: monster.locations,
        multiMonster: false,
        name: monster.name,
        node: monster.node,
        prologue: monster.prologue,
        type: MonsterType.QUARRY,
        timeline: monster.timeline
      }

      if ('ccRewards' in monster)
        campaign.customQuarries[key].ccRewards = monster.ccRewards
      if ('level1' in monster)
        campaign.customQuarries[key].level1 = monster.level1
      if ('level2' in monster)
        campaign.customQuarries[key].level2 = monster.level2
      if ('level3' in monster)
        campaign.customQuarries[key].level3 = monster.level3
      if ('level4' in monster)
        campaign.customQuarries[key].level4 = monster.level4
    } else if (monster.type === 'Nemesis') {
      campaign.customNemeses[key] = {
        multiMonster: false,
        name: monster.name,
        node: monster.node,
        timeline: monster.timeline,
        type: MonsterType.NEMESIS
      }

      if ('level1' in monster)
        campaign.customNemeses[key].level1 = monster.level1
      if ('level2' in monster)
        campaign.customNemeses[key].level2 = monster.level2
      if ('level3' in monster)
        campaign.customNemeses[key].level3 = monster.level3
      if ('level4' in monster)
        campaign.customNemeses[key].level4 = monster.level4
    }
  }

  // Iterate over hunts and restructure
  const updatedHunts: Hunt[] = []
  for (const hunt of campaign.hunts ?? []) {
    const updatedHunt = {
      // @ts-expect-error -- Old Schema
      huntBoard: hunt.monster.huntBoard,
      id: hunt.id,
      // @ts-expect-error -- Old Schema
      level: `level${hunt.monster.level}` as MonsterLevel,
      monsters: [
        {
          // @ts-expect-error -- Old Schema
          accuracy: hunt.monster.accuracy,
          // @ts-expect-error -- Old Schema
          accuracyTokens: hunt.monster.accuracyTokens,
          // @ts-expect-error -- Old Schema
          aiDeck: hunt.monster.aiDeck,
          // @ts-expect-error -- Old Schema
          aiDeckRemaining: hunt.monster.aiDeckRemaining,
          // @ts-expect-error -- Old Schema
          damage: hunt.monster.damage,
          // @ts-expect-error -- Old Schema
          damageTokens: hunt.monster.damageTokens,
          // @ts-expect-error -- Old Schema
          evasion: hunt.monster.evasion,
          // @ts-expect-error -- Old Schema
          evasionTokens: hunt.monster.evasionTokens,
          // @ts-expect-error -- Old Schema
          knockedDown: hunt.monster.knockedDown,
          // @ts-expect-error -- Old Schema
          luck: hunt.monster.luck,
          // @ts-expect-error -- Old Schema
          luckTokens: hunt.monster.luckTokens,
          // @ts-expect-error -- Old Schema
          moods: hunt.monster.moods ?? [],
          // @ts-expect-error -- Old Schema
          movement: hunt.monster.movement,
          // @ts-expect-error -- Old Schema
          movementTokens: hunt.monster.movementTokens,
          // @ts-expect-error -- Old Schema
          name: hunt.monster.name,
          // @ts-expect-error -- Old Schema
          notes: hunt.monster.notes ?? '',
          // @ts-expect-error -- Old Schema
          speed: hunt.monster.speed,
          // @ts-expect-error -- Old Schema
          speedTokens: hunt.monster.speedTokens,
          // @ts-expect-error -- Old Schema
          strength: hunt.monster.strength,
          // @ts-expect-error -- Old Schema
          strengthTokens: hunt.monster.strengthTokens,
          // @ts-expect-error -- Old Schema
          toughness: hunt.monster.toughness,
          // @ts-expect-error -- Old Schema
          traits: hunt.monster.traits ?? [],
          // @ts-expect-error -- Old Schema
          type: hunt.monster.type as MonsterType,
          // @ts-expect-error -- Old Schema
          wounds: hunt.monster.wounds
        }
      ],
      monsterPosition: hunt.monsterPosition,
      settlementId: hunt.settlementId,
      survivorDetails: hunt.survivorDetails.map((details) => ({
        accuracyTokens: details.accuracyTokens,
        // @ts-expect-error -- Old Schema
        color: details.color,
        evasionTokens: details.evasionTokens,
        id: details.id,
        insanityTokens: details.insanityTokens,
        luckTokens: details.luckTokens,
        movementTokens: details.movementTokens,
        notes: details.notes,
        speedTokens: details.speedTokens,
        strengthTokens: details.strengthTokens,
        survivalTokens: details.survivalTokens
      })),
      survivorPosition: hunt.survivorPosition,
      survivors: hunt.survivors
    } as Hunt

    if ('scout' in hunt) updatedHunt['scout'] = hunt.scout

    updatedHunts.push(updatedHunt)
  }
  campaign.hunts = updatedHunts

  // Iterate over settlements and restructure nemeses and quarries
  const updatedSettlements: Settlement[] = []
  for (const settlement of campaign.settlements ?? []) {
    const updatedSettlement = {
      arrivalBonuses: settlement.arrivalBonuses,
      campaignType: settlement.campaignType,
      deathCount: settlement.deathCount,
      departingBonuses: settlement.departingBonuses,
      gear: settlement.gear,
      id: settlement.id,
      innovations: settlement.innovations,
      locations: settlement.locations,
      lostSettlements: settlement.lostSettlements,
      milestones: settlement.milestones,
      name: settlement.name,
      nemeses: settlement.nemeses.map((nemesis) => {
        const updatedNemesis = {
          multiMonster: false,
          ccLevel1: nemesis.ccLevel1,
          ccLevel2: nemesis.ccLevel2,
          ccLevel3: nemesis.ccLevel3,
          level1Defeated: nemesis.level1,
          level2Defeated: nemesis.level2,
          level3Defeated: nemesis.level3,
          level4Defeated: nemesis.level4,
          // @ts-expect-error -- Old Schema
          name: nemesisLookup[nemesis.id as 1].name,
          // @ts-expect-error -- Old Schema
          node: nemesisLookup[nemesis.id as 1].node,
          type: MonsterType.NEMESIS,
          // @ts-expect-error -- Old Schema
          timeline: nemesisLookup[nemesis.id as 1].timeline,
          unlocked: nemesis.unlocked
        } as SettlementNemesis

        // @ts-expect-error -- Old Schema
        if ('level1' in nemesisLookup[nemesis.id as 1])
          // @ts-expect-error -- Old Schema
          updatedNemesis.level1 = nemesisLookup[nemesis.id as 1].level1
        // @ts-expect-error -- Old Schema
        if ('level2' in nemesisLookup[nemesis.id as 1])
          // @ts-expect-error -- Old Schema
          updatedNemesis.level2 = nemesisLookup[nemesis.id as 1].level2
        // @ts-expect-error -- Old Schema
        if ('level3' in nemesisLookup[nemesis.id as 1])
          // @ts-expect-error -- Old Schema
          updatedNemesis.level3 = nemesisLookup[nemesis.id as 1].level3
        // @ts-expect-error -- Old Schema
        if ('level4' in nemesisLookup[nemesis.id as 1])
          // @ts-expect-error -- Old Schema
          updatedNemesis.level4 = nemesisLookup[nemesis.id as 1].level4
        // @ts-expect-error -- Old Schema
        if ('vignette' in nemesisLookup[nemesis.id as 1])
          // @ts-expect-error -- Old Schema
          updatedNemesis.vignette = nemesisLookup[nemesis.id as 1].vignette

        return updatedNemesis
      }),
      notes: settlement.notes ?? '',
      patterns: settlement.patterns,
      population: settlement.population,
      principles: settlement.principles,
      quarries: settlement.quarries.map((quarry) => {
        const updatedQuarry = {
          ccLevel1: quarry.ccLevel1,
          ccLevel2: quarry.ccLevel2,
          ccLevel3: quarry.ccLevel3,
          ccPrologue: quarry.ccPrologue,
          // @ts-expect-error -- Old Schema
          huntBoard: quarryLookup[quarry.id as 1].huntBoard,
          // @ts-expect-error -- Old Schema
          name: quarryLookup[quarry.id as 1].name,
          // @ts-expect-error -- Old Schema
          node: quarryLookup[quarry.id as 1].node,
          unlocked: quarry.unlocked
        } as SettlementQuarry

        // @ts-expect-error -- Old Schema
        if ('alternate' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.alternate = quarryLookup[quarry.id as 1].alternate
        // @ts-expect-error -- Old Schema
        if ('level1' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.level1 = quarryLookup[quarry.id as 1].level1
        // @ts-expect-error -- Old Schema
        if ('level2' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.level2 = quarryLookup[quarry.id as 1].level2
        // @ts-expect-error -- Old Schema
        if ('level3' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.level3 = quarryLookup[quarry.id as 1].level3
        // @ts-expect-error -- Old Schema
        if ('level4' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.level4 = quarryLookup[quarry.id as 1].level4
        // @ts-expect-error -- Old Schema
        if ('vignette' in quarryLookup[quarry.id as 1])
          // @ts-expect-error -- Old Schema
          updatedQuarry.vignette = quarryLookup[quarry.id as 1].vignette

        return updatedQuarry
      }),
      resources: settlement.resources,
      seedPatterns: settlement.seedPatterns,
      survivalLimit: settlement.survivalLimit,
      survivorType: settlement.survivorType as SurvivorType,
      timeline: settlement.timeline
    } as Settlement

    if ('usesScouts' in settlement)
      updatedSettlement['usesScouts'] = settlement.usesScouts
    if ('ccRewards' in settlement)
      updatedSettlement['ccRewards'] = settlement.ccRewards
    if ('ccValue' in settlement)
      updatedSettlement['ccValue'] = settlement.ccValue
    if ('knowledges' in settlement)
      updatedSettlement['knowledges'] = settlement.knowledges
    if ('philosophies' in settlement)
      updatedSettlement['philosophies'] = settlement.philosophies

    if ('lanternResearchLevel' in settlement)
      updatedSettlement['lanternResearchLevel'] =
        settlement.lanternResearchLevel
    if ('monsterVolumes' in settlement)
      updatedSettlement['monsterVolumes'] = settlement.monsterVolumes
    if ('suspicions' in settlement)
      updatedSettlement['suspicions'] = settlement.suspicions

    updatedSettlements.push(updatedSettlement)
  }
  campaign.settlements = updatedSettlements

  // Iterate over showdowns and restructure
  const updatedShowdowns: Showdown[] = []
  for (const showdown of campaign.showdowns ?? []) {
    const updatedShowdown = {
      ambush: showdown.ambush,
      id: showdown.id,
      // @ts-expect-error -- Old Schema
      level: `level${showdown.monster.level}` as MonsterLevel,
      monsters: [
        {
          // @ts-expect-error -- Old Schema
          accuracy: showdown.monster.accuracy,
          // @ts-expect-error -- Old Schema
          accuracyTokens: showdown.monster.accuracyTokens,
          // @ts-expect-error -- Old Schema
          aiDeck: showdown.monster.aiDeck,
          // @ts-expect-error -- Old Schema
          aiDeckRemaining: showdown.monster.aiDeckRemaining,
          // @ts-expect-error -- Old Schema
          damage: showdown.monster.damage,
          // @ts-expect-error -- Old Schema
          damageTokens: showdown.monster.damageTokens,
          // @ts-expect-error -- Old Schema
          evasion: showdown.monster.evasion,
          // @ts-expect-error -- Old Schema
          evasionTokens: showdown.monster.evasionTokens,
          // @ts-expect-error -- Old Schema
          knockedDown: showdown.monster.knockedDown,
          // @ts-expect-error -- Old Schema
          luck: showdown.monster.luck,
          // @ts-expect-error -- Old Schema
          luckTokens: showdown.monster.luckTokens,
          // @ts-expect-error -- Old Schema
          moods: showdown.monster.moods ?? [],
          // @ts-expect-error -- Old Schema
          movement: showdown.monster.movement,
          // @ts-expect-error -- Old Schema
          movementTokens: showdown.monster.movementTokens,
          // @ts-expect-error -- Old Schema
          name: showdown.monster.name,
          // @ts-expect-error -- Old Schema
          notes: showdown.monster.notes ?? '',
          // @ts-expect-error -- Old Schema
          speed: showdown.monster.speed,
          // @ts-expect-error -- Old Schema
          speedTokens: showdown.monster.speedTokens,
          // @ts-expect-error -- Old Schema
          strength: showdown.monster.strength,
          // @ts-expect-error -- Old Schema
          strengthTokens: showdown.monster.strengthTokens,
          // @ts-expect-error -- Old Schema
          toughness: showdown.monster.toughness,
          // @ts-expect-error -- Old Schema
          traits: showdown.monster.traits ?? [],
          // @ts-expect-error -- Old Schema
          type: showdown.monster.type as MonsterType,
          // @ts-expect-error -- Old Schema
          wounds: showdown.monster.wounds
        }
      ],
      settlementId: showdown.settlementId,
      survivorDetails: showdown.survivorDetails.map((details) => ({
        accuracyTokens: details.accuracyTokens,
        bleedingTokens: details.bleedingTokens,
        blockTokens: details.blockTokens,
        // @ts-expect-error -- Old Schema
        color: details.color,
        deflectTokens: details.deflectTokens,
        evasionTokens: details.evasionTokens,
        id: details.id,
        insanityTokens: details.insanityTokens,
        knockedDown: details.knockedDown,
        luckTokens: details.luckTokens,
        movementTokens: details.movementTokens,
        notes: details.notes,
        priorityTarget: details.priorityTarget,
        speedTokens: details.speedTokens,
        strengthTokens: details.strengthTokens,
        survivalTokens: details.survivalTokens
      })),
      survivors: showdown.survivors,
      turn: showdown.turn
    } as Showdown

    if ('scout' in showdown) updatedShowdown['scout'] = showdown.scout

    updatedShowdowns.push(updatedShowdown)
  }
  campaign.showdowns = updatedShowdowns

  // Migration complete. Update version.
  campaign.version = '0.14.0'

  // @ts-expect-error -- Old Schema
  delete campaign['customMonsters']
}

/**
 * Migration logic from version 0.14.0 to 0.14.1
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_14_1(campaign: Campaign) {
  console.log('Migrating to 0.14.1')

  // Do nothing, just update version
  campaign.version = '0.14.1'
}

/**
 * Migration logic from version 0.14.1 to 0.14.2
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_14_2(campaign: Campaign) {
  console.log('Migrating to 0.14.2')

  // Do nothing, just update version
  campaign.version = '0.14.2'
}

/**
 * Migration logic from version 0.14.2 to 0.15.0
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_15_0(campaign: Campaign) {
  console.log('Migrating to 0.15.0')

  for (const settlement of campaign.settlements ?? []) {
    for (const survivor of (campaign.survivors ?? []).filter(
      (survivor) => survivor.settlementId === settlement.id
    )) {
      // Check if the survivor is on a hunt or showdown
      const hunt = (campaign.hunts ?? []).find(
        (hunt) =>
          hunt.settlementId === settlement.id &&
          hunt.survivors.includes(survivor.id)
      )
      const showdown = (campaign.showdowns ?? []).find(
        (showdown) =>
          showdown.settlementId === settlement.id &&
          showdown.survivors.includes(survivor.id)
      )

      // If there is no hunt or showdown, set the default color.
      // prettier-ignore
      // @ts-expect-error -- Old Schema
      survivor.color = hunt?.survivorDetails.find((details) => details.id === survivor.id)?.color
        // @ts-expect-error -- Old Schema
        ?? showdown?.survivorDetails.find((details) => details.id === survivor.id)?.color
        ?? ColorChoice.SLATE
    }
  }

  // Migration complete. Update version.
  campaign.version = '0.15.0'
}

/**
 * Migration logic from version 0.15.0 to 0.16.0
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_16_0(campaign: Campaign) {
  console.log('Migrating to 0.16.0')

  for (const settlement of campaign.settlements ?? [])
    if (settlement.wanderers === undefined) settlement.wanderers = []

  for (const survivor of campaign.survivors ?? [])
    if (survivor.wanderer === undefined) survivor.wanderer = false

  // Migration complete. Update version.
  campaign.version = '0.16.0'
}

/**
 * Migration logic from version 0.16.0 to 0.17.0
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_17_0(campaign: Campaign) {
  console.log('Migrating to 0.17.0')

  // Migration complete. Update version.
  campaign.version = '0.17.0'
}

/**
 * Migration logic from version 0.17.0 to 0.18.0
 *
 * @param campaign Campaign to Migrate
 */
function migrateTo0_18_0(campaign: Campaign) {
  console.log('Migrating to 0.18.0')

  // Migration complete. Update version.
  campaign.version = '0.18.0'
}
