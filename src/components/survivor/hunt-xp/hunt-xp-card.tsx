'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { SurvivorType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hunt XP Card Props
 */
interface HuntXPCardProps {
  /** Survivor form instance */
  form: UseFormReturn<Survivor>
  /** Current settlement */
  settlement: Settlement
  /** Function to save survivor data */
  saveSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
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
  form,
  settlement,
  saveSurvivor
}: HuntXPCardProps): ReactElement {
  const huntXP = form.watch('huntXP')
  const huntXPRankUp = form.watch('huntXPRankUp')
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

      saveSurvivor(updateData, successMsg)
    },
    [saveSurvivor]
  )

  /**
   * Update Hunt XP
   *
   * @param index The index of the checkbox (0-based)
   * @param checked Whether the checkbox is checked
   */
  const updateHuntXP = (index: number, checked: boolean) => {
    const newXP = checked ? index : index - 1

    saveToLocalStorage(
      newXP,
      undefined,
      checked && huntXPRankUp?.includes(index)
        ? 'The survivor rises through struggle and triumph. Rank up achieved!'
        : 'The lantern grows brighter. Hunt XP updated.'
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

    const currentRankUps = [...(huntXPRankUp || [])]
    const rankUpIndex = currentRankUps.indexOf(index)

    if (rankUpIndex >= 0) {
      // Remove from rank up milestones
      currentRankUps.splice(rankUpIndex, 1)
      saveToLocalStorage(
        undefined,
        currentRankUps,
        'Rank up milestone removed.'
      )
    } else {
      // Add to rank up milestones
      currentRankUps.push(index)
      currentRankUps.sort((a, b) => a - b) // Keep sorted
      saveToLocalStorage(undefined, currentRankUps, 'Rank up milestone added.')
    }
  }

  /**
   * Checks if a checkbox should be disabled
   *
   * @param index The index of the checkbox (0-based)
   * @returns True if the checkbox should be disabled
   */
  const isDisabled = (index: number) => index > (huntXP || 0) + 1

  return (
    <Card className="p-2 border-0 lg:h-[85px]">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center h-[36px]">
            {/* Hunt XP */}
            <FormField
              control={form.control}
              name="huntXP"
              render={() => (
                <FormItem className="flex-1">
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-bold text-left">
                      Hunt XP
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1 lg:gap-2">
                        {Array.from({ length: 16 }, (_, i) => {
                          const boxIndex = i
                          const checked = (huntXP || 0) >= boxIndex
                          const milestone = huntXPRankUp?.includes(boxIndex)
                          const isLast = boxIndex === 15

                          return (
                            <div key={boxIndex} className="flex">
                              <Checkbox
                                id={`hunt-xp-${boxIndex}`}
                                checked={checked}
                                disabled={isDisabled(boxIndex)}
                                onCheckedChange={(checked) =>
                                  updateHuntXP(boxIndex, !!checked)
                                }
                                onContextMenu={(event) =>
                                  updateHuntXPRankUp(boxIndex, event)
                                }
                                className={cn(
                                  'h-4 w-4 rounded-sm',
                                  !checked &&
                                    milestone &&
                                    'border-2 border-primary',
                                  !checked &&
                                    isLast &&
                                    'border-4 border-primary'
                                )}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
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
                {settlement.survivorType === SurvivorType.CORE ? (
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
