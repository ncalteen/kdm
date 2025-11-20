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
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
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
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Showdown Card Component
 *
 * Displays showdown initiation interface when no active showdown or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function ShowdownCard({
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSelectedShowdown,
  setSelectedSurvivor,
  setSurvivors,
  survivors
}: ShowdownCardProps): ReactElement {
  return selectedShowdown ? (
    <ActiveShowdownCard
      saveSelectedShowdown={saveSelectedShowdown}
      saveSelectedSurvivor={saveSelectedSurvivor}
      selectedShowdown={selectedShowdown}
      selectedSettlement={selectedSettlement}
      selectedSurvivor={selectedSurvivor}
      setSelectedShowdown={setSelectedShowdown}
      setSelectedSurvivor={setSelectedSurvivor}
      setSurvivors={setSurvivors}
      survivors={survivors}
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
