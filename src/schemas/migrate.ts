import { MonsterNode } from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import * as packageInfo from '../../package.json'

/**
 * Migrate Campaign to Latest Schema Version
 *
 * @param campaign Campaign to Migrate
 * @returns Migrated Campaign
 */
export function migrateCampaign(campaign: Campaign): Campaign {
  console.log(
    `Migrating Campaign (${campaign.version || '0.12.0'} -> ${packageInfo.version})`
  )

  // Add version migration steps here...
  if (campaign.version === undefined || campaign.version === '0.12.0')
    migrate0_12_0(campaign)

  return campaign
}

/**
 * Migration logic from version 0.12.0 to 0.13.0
 *
 * @param campaign Campaign to Migrate
 */
function migrate0_12_0(campaign: Campaign) {
  console.log('Migrating to 0.13.0')

  // Unchnanged
  campaign.selectedHuntId = campaign.selectedHuntId || null
  campaign.selectedShowdownId = campaign.selectedShowdownId || null
  campaign.selectedSettlementId = campaign.selectedSettlementId || null
  campaign.selectedSurvivorId = campaign.selectedSurvivorId || null
  campaign.selectedTab = campaign.selectedTab || null
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
  campaign.survivors = campaign.survivors || []

  // Custom monsters is a new addition.
  campaign.customMonsters = campaign.customMonsters || {}

  // Hunts use a new AI deck structure.
  campaign.hunts = (campaign.hunts || []).map((hunt) => {
    // @ts-expect-error -- Old Schema
    const originalAIDeckSize = hunt.monster.aiDeckSize || 0

    hunt.monster.aiDeck = {
      basic: originalAIDeckSize,
      advanced: 0,
      legendary: 0
    }
    hunt.monster.aiDeckRemaining = originalAIDeckSize

    return hunt
  })

  campaign.settlements = (campaign.settlements || []).map((settlement) => {
    // Settlement nemeses use ID instead of name.
    settlement.nemeses = (settlement.nemeses || []).map((nemesis) => {
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
        level1: nemesis.level1 || false,
        level2: nemesis.level2 || false,
        level3: nemesis.level3 || false,
        level4: nemesis.level4,
        unlocked: nemesis.unlocked || false
      }
    })

    // Settlement quarries use ID instead of name.
    settlement.quarries = (settlement.quarries || []).map((quarry) => {
      let quarryId = -1
      let quarryNode = MonsterNode.NQ1

      for (const key of Object.keys(QUARRIES)) {
        const quarryKey = key as unknown as keyof typeof QUARRIES

        // @ts-expect-error -- Old Schema
        if (QUARRIES[quarryKey].main.name === quarry.name) {
          quarryId = parseInt(key)
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
        unlocked: quarry.unlocked || false
      }
    })

    return settlement
  })

  // Showdowns use a new AI deck structure.
  campaign.showdowns = (campaign.showdowns || []).map((showdown) => {
    // @ts-expect-error -- Old Schema
    const originalAIDeckSize = showdown.monster.aiDeckSize || 0

    showdown.monster.aiDeck = {
      basic: originalAIDeckSize,
      advanced: 0,
      legendary: 0
    }
    showdown.monster.aiDeckRemaining = originalAIDeckSize

    return showdown
  })

  // Migration complete. Update version.
  campaign.version = '0.13.0'
}
