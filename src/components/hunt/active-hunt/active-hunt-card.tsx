'use client'

import { HuntBoard } from '@/components/hunt/hunt-board/hunt-board'
import { HuntSurvivorsCard } from '@/components/hunt/hunt-survivors/hunt-survivors-card'
import { ActiveHunt } from '@/schemas/active-hunt'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Active Hunt Card Props
 */
interface ActiveHuntCardProps {
  /** Active Hunt Form */
  form: UseFormReturn<ActiveHunt>
  /** Active Hunt */
  activeHunt: ActiveHunt
  /** Function to Save Active Hunt */
  saveActiveHunt: (updateData: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Active Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function ActiveHuntCard({
  form,
  activeHunt,
  saveActiveHunt
}: ActiveHuntCardProps): ReactElement {
  /**
   * Handle position updates on the hunt board
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, quarryPosition: number) => {
      const survivorChanged =
        survivorPosition !== (activeHunt.survivorPosition ?? 0)

      saveActiveHunt(
        { survivorPosition, quarryPosition },
        survivorChanged ? 'Survivors moved.' : 'Quarry moved.'
      )
    },
    [activeHunt.survivorPosition, saveActiveHunt]
  )

  return (
    <div className="space-y-6">
      {/* Hunt Board */}
      <HuntBoard
        activeHunt={activeHunt}
        onPositionUpdate={handlePositionUpdate}
      />

      {/* Hunt Party Survivors */}
      <HuntSurvivorsCard
        form={form}
        activeHunt={activeHunt}
        saveActiveHunt={saveActiveHunt}
      />
    </div>
  )
}
