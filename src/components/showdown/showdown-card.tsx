'use client'

import { DepartingBonusesCard } from '@/components/settlement/departing-bonuses/departing-bonuses-card'
import { ActiveShowdownCard } from '@/components/showdown/active-showdown/active-showdown-card'
import { CreateShowdownCard } from '@/components/showdown/create-showdown/create-showdown-card'
import { TabType } from '@/lib/enums'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Showdown Card Properties
 */
interface ShowdownCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Settlement Phase */
  setSelectedSettlementPhase: (settlementPhase: SettlementPhase | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Showdown Monster Index */
  setSelectedShowdownMonsterIndex: (index: number) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Showdown Card Component
 *
 * Displays showdown initiation interface when no active showdown or showdown
 * exists. Allows selection of quarry, survivors, and scout (if settlement uses
 * scouts).
 */
export function ShowdownCard({
  campaign,
  saveSelectedSettlement,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedShowdown,
  selectedShowdownMonsterIndex,
  selectedSettlement,
  selectedSurvivor,
  setSelectedSettlementPhase,
  setSelectedShowdown,
  setSelectedShowdownMonsterIndex,
  setSelectedSurvivor,
  setSelectedTab,
  updateCampaign
}: ShowdownCardProps): ReactElement {
  return selectedShowdown ? (
    <ActiveShowdownCard
      campaign={campaign}
      saveSelectedShowdown={saveSelectedShowdown}
      saveSelectedSurvivor={saveSelectedSurvivor}
      selectedShowdown={selectedShowdown}
      selectedShowdownMonsterIndex={selectedShowdownMonsterIndex}
      selectedSettlement={selectedSettlement}
      selectedSurvivor={selectedSurvivor}
      setSelectedShowdown={setSelectedShowdown}
      setSelectedSettlementPhase={setSelectedSettlementPhase}
      setSelectedShowdownMonsterIndex={setSelectedShowdownMonsterIndex}
      setSelectedSurvivor={setSelectedSurvivor}
      setSelectedTab={setSelectedTab}
      updateCampaign={updateCampaign}
    />
  ) : (
    <div className="mt-10 flex flex-wrap items-start justify-center gap-4">
      <div className="order-2 md:order-1">
        <CreateShowdownCard
          campaign={campaign}
          saveSelectedShowdown={saveSelectedShowdown}
          selectedHunt={selectedHunt}
          selectedSettlement={selectedSettlement}
          selectedShowdownMonsterIndex={selectedShowdownMonsterIndex}
          setSelectedShowdown={setSelectedShowdown}
          setSelectedShowdownMonsterIndex={setSelectedShowdownMonsterIndex}
          setSelectedSurvivor={setSelectedSurvivor}
        />
      </div>
      <div className="w-[400px] order-1 md:order-2">
        <DepartingBonusesCard
          saveSelectedSettlement={saveSelectedSettlement}
          selectedSettlement={selectedSettlement}
        />
      </div>
    </div>
  )
}
