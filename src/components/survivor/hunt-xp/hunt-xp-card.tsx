'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormItem } from '@/components/ui/form'
import { SurvivorType } from '@/lib/enums'
import {
  HUNT_XP_RANK_UP_ACHIEVED_MESSAGE,
  HUNT_XP_RANK_UP_MILESTONE_ADDED_MESSAGE,
  HUNT_XP_RANK_UP_MILESTONE_REMOVED_MESSAGE,
  HUNT_XP_UPDATED_MESSAGE
} from '@/lib/messages'
import { cn } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement, useCallback } from 'react'

/**
 * Hunt XP Card Properties
 */
interface HuntXPCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Hunt XP Card Component
 *
 * Displays the Hunt XP and rank up milestones for the survivor. Based on the
 * survivor type, the card will show different options for the Hunt XP and rank
 * up milestones.
 *
 * @param form Form
 * @returns Hunt XP Card Component
 */
export function HuntXPCard({
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: HuntXPCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param updatedHuntXP Updated Hunt XP value
   * @param updatedHuntXPRankUp Updated Hunt XP rank up milestones
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (
      updatedHuntXP?: number,
      updatedHuntXPRankUp?: number[],
      successMsg?: string
    ) => {
      const updateData: Partial<Survivor> = {}

      if (updatedHuntXP !== undefined) updateData.huntXP = updatedHuntXP
      if (updatedHuntXPRankUp !== undefined)
        updateData.huntXPRankUp = updatedHuntXPRankUp

      saveSelectedSurvivor(updateData, successMsg)
    },
    [saveSelectedSurvivor]
  )

  /**
   * Update Hunt XP
   *
   * @param index The index of the checkbox (0-based)
   * @param checked Whether the checkbox is checked
   */
  const updateHuntXP = (index: number, checked: boolean) => {
    saveToLocalStorage(
      checked ? index + 1 : index,
      undefined,
      checked && selectedSurvivor?.huntXPRankUp?.includes(index)
        ? HUNT_XP_RANK_UP_ACHIEVED_MESSAGE()
        : HUNT_XP_UPDATED_MESSAGE()
    )
  }

  /**
   * Handles right-clicking on Hunt XP checkboxes to toggle rank up milestones
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const updateHuntXPRankUp = (index: number, event: React.MouseEvent) => {
    event.preventDefault()

    const currentRankUps = [...(selectedSurvivor?.huntXPRankUp || [])]
    const rankUpIndex = currentRankUps.indexOf(index)

    if (rankUpIndex >= 0) {
      // Remove from rank up milestones
      currentRankUps.splice(rankUpIndex, 1)
      saveToLocalStorage(
        undefined,
        currentRankUps,
        HUNT_XP_RANK_UP_MILESTONE_REMOVED_MESSAGE()
      )
    } else {
      // Add to rank up milestones
      currentRankUps.push(index)
      currentRankUps.sort((a, b) => a - b) // Keep sorted
      saveToLocalStorage(
        undefined,
        currentRankUps,
        HUNT_XP_RANK_UP_MILESTONE_ADDED_MESSAGE()
      )
    }
  }

  /**
   * Checks if a checkbox should be disabled
   *
   * @param index The index of the checkbox (0-based)
   * @returns True if the checkbox should be disabled
   */
  const isDisabled = (index: number) => index > (selectedSurvivor?.huntXP || 0)

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 lg:h-[70px]">
        <div className="flex flex-col">
          <div className="flex items-center h-[36px]">
            {/* Hunt XP */}
            <FormItem className="flex-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-left text-sm lg:text-md">
                  Hunt XP
                </label>
                <div className="flex items-center gap-1 lg:gap-2">
                  {Array.from({ length: 16 }, (_, i) => {
                    const checked = (selectedSurvivor?.huntXP || 0) > i

                    return (
                      <div key={i} className="flex">
                        <Checkbox
                          id={`hunt-xp-${i}`}
                          checked={checked}
                          disabled={isDisabled(i)}
                          onCheckedChange={(checked) =>
                            updateHuntXP(i, !!checked)
                          }
                          onContextMenu={(event) =>
                            updateHuntXPRankUp(i, event)
                          }
                          className={cn(
                            'h-4 w-4 rounded-sm',
                            !checked &&
                              selectedSurvivor?.huntXPRankUp?.includes(i) &&
                              'border-2 border-primary',
                            !checked && i === 15 && 'border-4 border-primary'
                          )}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </FormItem>
          </div>
        </div>

        <hr className="hidden lg:flex my-2" />

        <div className="hidden lg:flex items-center justify-between">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-1">
              {Array.from({ length: i + 1 }, (_, j) => (
                <Checkbox
                  key={j}
                  disabled
                  className="!bg-white border border-gray-300 h-3 w-3"
                />
              ))}
              <span className="text-xs">
                {selectedSettlement?.survivorType === SurvivorType.CORE ? (
                  <div className="flex items-center gap-1">
                    <BookOpenIcon className="h-4 w-4" /> Age
                  </div>
                ) : i === 0 ? (
                  'Adopt Philosophy'
                ) : (
                  'Rank +'
                )}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <Checkbox disabled className="border-4 border-gray-300 h-3 w-3" />
            <span className="text-xs">Retired</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
