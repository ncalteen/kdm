'use client'

import { HuntBoard } from '@/components/hunt/hunt-board/hunt-board'
import { HuntSurvivorsCard } from '@/components/hunt/hunt-survivors/hunt-survivors-card'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Active Hunt Card Properties
 */
interface ActiveHuntCardProps {
  /** Hunt Form */
  form: UseFormReturn<Hunt>
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
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
 * Active Hunt Card Component
 *
 * @param props Active Hunt Card Properties
 * @returns Active Hunt Card Component
 */
export function ActiveHuntCard({
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ActiveHuntCardProps): ReactElement {
  /**
   * Handle Position Update
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, quarryPosition: number) => {
      const survivorChanged =
        survivorPosition !== (selectedHunt?.survivorPosition ?? 0)

      saveSelectedHunt(
        { survivorPosition, quarryPosition },
        survivorChanged ? 'Survivors moved.' : 'Quarry moved.'
      )
    },
    [selectedHunt?.survivorPosition, saveSelectedHunt]
  )

  return (
    <div className="flex flex-row gap-2">
      {/* Hunt Board */}
      <div className="flex-shrink-0">
        <HuntBoard
          onPositionUpdate={handlePositionUpdate}
          selectedHunt={selectedHunt}
        />
      </div>

      {/* Hunt Party Survivors */}
      <div className="min-w-0">
        <HuntSurvivorsCard
          saveSelectedHunt={saveSelectedHunt}
          selectedHunt={selectedHunt}
          selectedSettlement={selectedSettlement}
          selectedSurvivor={selectedSurvivor}
          setSurvivors={setSurvivors}
          survivors={survivors}
          updateSelectedSurvivor={updateSelectedSurvivor}
        />
      </div>
    </div>
  )
}
