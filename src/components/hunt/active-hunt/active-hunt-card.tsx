'use client'

import { HuntBoard } from '@/components/hunt/hunt-board/hunt-board'
import { Settlement } from '@/schemas/settlement'
import { ReactElement, useCallback } from 'react'

/**
 * Active Hunt Card Props
 */
interface ActiveHuntCardProps {
  /** Settlement */
  settlement: Settlement
  /** Function to Save Settlement Data */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Active Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function ActiveHuntCard({
  settlement,
  saveSettlement
}: ActiveHuntCardProps): ReactElement {
  /**
   * Handle position updates on the hunt board
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, quarryPosition: number) => {
      if (!settlement.activeHunt) return

      const survivorChanged =
        survivorPosition !== (settlement.activeHunt.survivorPosition ?? 0)

      const updatedActiveHunt = {
        ...settlement.activeHunt,
        survivorPosition,
        quarryPosition
      }

      saveSettlement(
        { activeHunt: updatedActiveHunt },
        survivorChanged ? 'Survivors moved.' : 'Quarry moved.'
      )
    },
    [settlement.activeHunt, saveSettlement]
  )

  // Typing workaround...the settlement is guaranteed to have an active hunt
  if (!settlement.activeHunt) return <></>

  return (
    <div className="space-y-6">
      {/* Hunt Board */}
      <HuntBoard
        activeHunt={settlement.activeHunt}
        onPositionUpdate={handlePositionUpdate}
      />
    </div>
  )
}
