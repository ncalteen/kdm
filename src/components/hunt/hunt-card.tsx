'use client'

import { ActiveHuntCard } from '@/components/hunt/active-hunt/active-hunt-card'
import { CreateHuntCard } from '@/components/hunt/create-hunt/create-hunt-card'
import { TabType } from '@/lib/enums'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Hunt Card Properties
 */
interface HuntCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function HuntCard({
  saveSelectedHunt,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  setSelectedHunt,
  setSelectedShowdown,
  setSelectedSurvivor,
  setSelectedTab,
  setSurvivors,
  survivors
}: HuntCardProps): ReactElement {
  return selectedHunt ? (
    <ActiveHuntCard
      saveSelectedHunt={saveSelectedHunt}
      saveSelectedSurvivor={saveSelectedSurvivor}
      selectedHunt={selectedHunt}
      selectedSettlement={selectedSettlement}
      selectedSurvivor={selectedSurvivor}
      setSelectedHunt={setSelectedHunt}
      setSelectedShowdown={setSelectedShowdown}
      setSelectedSurvivor={setSelectedSurvivor}
      setSelectedTab={setSelectedTab}
      setSurvivors={setSurvivors}
      survivors={survivors}
    />
  ) : (
    <CreateHuntCard
      saveSelectedHunt={saveSelectedHunt}
      selectedSettlement={selectedSettlement}
      selectedShowdown={selectedShowdown}
      setSelectedHunt={setSelectedHunt}
      survivors={survivors}
    />
  )
}
