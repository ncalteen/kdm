'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { SurvivorType } from '@/lib/enums'
import { cn, getSettlement } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

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
export function HuntXPCard(form: UseFormReturn<Survivor>) {
  const huntXP = form.watch('huntXP') || 0
  const huntXPRankUp = form.watch('huntXPRankUp') || []
  const settlementId = form.watch('settlementId')

  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  // When the component mounts, get the settlement from localStorage
  useEffect(() => setSettlement(getSettlement(settlementId)), [settlementId])

  /**
   * Handles toggling the Hunt XP checkboxes
   *
   * @param index The index of the checkbox (1-based)
   * @param checked Whether the checkbox is checked
   */
  const handleToggle = (index: number, checked: boolean) => {
    if (checked) form.setValue('huntXP', index)
    else form.setValue('huntXP', index - 1)
  }

  /**
   * Checks if a checkbox should be disabled
   *
   * @param index The index of the checkbox (1-based)
   * @returns True if the checkbox should be disabled
   */
  const isDisabled = (index: number) => index > huntXP + 1

  return (
    <Card className="border-0">
      <CardContent className="p-0 pt-3">
        <div className="flex flex-wrap gap-8 items-center">
          <FormField
            control={form.control}
            name="huntXP"
            render={() => (
              <FormItem className="flex-1">
                <div className="flex items-center gap-4">
                  <FormLabel className="font-bold text-left text-l">
                    Hunt XP
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: 16 }, (_, i) => {
                        const boxIndex = i
                        const checked = huntXP >= boxIndex
                        const milestone = huntXPRankUp.includes(boxIndex)
                        const isLast = boxIndex === 15

                        return (
                          <div
                            key={boxIndex}
                            className="flex flex-col items-center">
                            <Checkbox
                              id={`hunt-xp-${boxIndex}`}
                              checked={checked}
                              disabled={isDisabled(boxIndex)}
                              onCheckedChange={(checked) =>
                                handleToggle(boxIndex, !!checked)
                              }
                              className={cn(
                                'h-4 w-4 rounded-sm',
                                !checked &&
                                  milestone &&
                                  'border-2 border-primary',
                                !checked && isLast && 'border-4 border-primary'
                              )}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <hr className="mt-4" />

        <div className="flex items-center justify-between mt-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-1">
              {Array.from({ length: i + 1 }, (_, j) => (
                <Checkbox
                  key={j}
                  disabled
                  className="!bg-white border border-gray-300 h-3 w-3"
                />
              ))}
              <span className="text-xs flex items-center gap-1">
                {settlement?.survivorType === SurvivorType.CORE ? (
                  <>
                    <BookOpenIcon className="h-4 w-4" /> Age
                  </>
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
            <span className="text-xs flex items-center gap-1">Retired</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
