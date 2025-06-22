'use client'

import { ActiveHuntCard } from '@/components/hunt/active-hunt/active-hunt-card'
import { CreateHuntCard } from '@/components/hunt/create-hunt/create-hunt-card'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Hunt Card Properties
 */
interface HuntCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function HuntCard({
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSelectedHunt,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: HuntCardProps): ReactElement {
  return selectedHunt ? (
    <ActiveHuntCard
      saveSelectedHunt={saveSelectedHunt}
      selectedHunt={selectedHunt}
      selectedSettlement={selectedSettlement}
      selectedSurvivor={selectedSurvivor}
      setSelectedHunt={setSelectedHunt}
      setSurvivors={setSurvivors}
      survivors={survivors}
      updateSelectedSurvivor={updateSelectedSurvivor}
    />
  ) : (
    <CreateHuntCard
      saveSelectedHunt={saveSelectedHunt}
      selectedSettlement={selectedSettlement}
      setSelectedHunt={setSelectedHunt}
      survivors={survivors}
    />
  )
}
