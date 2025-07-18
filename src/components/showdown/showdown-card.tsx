'use client'

import { ActiveShowdownCard } from '@/components/showdown/active-showdown/active-showdown-card'
import { CreateShowdownCard } from '@/components/showdown/create-showdown/create-showdown-card'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Showdown Card Properties
 */
interface ShowdownCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Showdown Card Component
 *
 * Displays showdown initiation interface when no active showdown or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function ShowdownCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSelectedShowdown,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ShowdownCardProps): ReactElement {
  return selectedShowdown ? (
    <ActiveShowdownCard
      saveSelectedShowdown={saveSelectedShowdown}
      selectedShowdown={selectedShowdown}
      selectedSettlement={selectedSettlement}
      selectedSurvivor={selectedSurvivor}
      setSelectedShowdown={setSelectedShowdown}
      setSurvivors={setSurvivors}
      survivors={survivors}
      updateSelectedSurvivor={updateSelectedSurvivor}
    />
  ) : (
    <CreateShowdownCard
      saveSelectedShowdown={saveSelectedShowdown}
      selectedSettlement={selectedSettlement}
      setSelectedShowdown={setSelectedShowdown}
      survivors={survivors}
    />
  )
}
