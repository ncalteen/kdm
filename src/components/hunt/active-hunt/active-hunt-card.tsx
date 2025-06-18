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
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Survivors */
  updateSurvivors: (survivors: Survivor[]) => void
}

/**
 * Active Hunt Card Component
 *
 * @param props Active Hunt Card Properties
 * @returns Active Hunt Card Component
 */
export function ActiveHuntCard({
  // form,
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  // setSelectedHunt,
  survivors,
  updateSurvivors
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
    <div className="space-y-6">
      {/* Hunt Board */}
      <HuntBoard
        onPositionUpdate={handlePositionUpdate}
        selectedHunt={selectedHunt}
      />

      {/* Hunt Party Survivors */}
      <HuntSurvivorsCard
        selectedHunt={selectedHunt}
        selectedSettlement={selectedSettlement}
        survivors={survivors}
        updateSurvivors={updateSurvivors}
      />
    </div>
  )
}
