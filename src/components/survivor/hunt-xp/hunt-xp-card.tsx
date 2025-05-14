'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { SurvivorType } from '@/lib/enums'
import { Settlement } from '@/lib/types'
import { cn, getSettlement } from '@/lib/utils'
import { SurvivorSchema } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

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
export function HuntXPCard(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
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
    <Card>
      <CardContent className="py-4 min-w-[600px]">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="font-bold text-l whitespace-nowrap">Hunt XP</div>
          <div className="flex flex-wrap gap-3 items-center">
            {Array.from({ length: 16 }, (_, i) => {
              const boxIndex = i
              const checked = huntXP >= boxIndex
              const milestone = huntXPRankUp.includes(boxIndex)
              const isLast = boxIndex === 15

              return (
                <div key={boxIndex} className="flex flex-col items-center">
                  <Checkbox
                    id={`hunt-xp-${boxIndex}`}
                    checked={checked}
                    disabled={isDisabled(boxIndex)}
                    onCheckedChange={(checked) =>
                      handleToggle(boxIndex, !!checked)
                    }
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !checked && milestone && 'border-2 border-primary',
                      !checked && isLast && 'border-4 border-primary'
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <hr className="mt-2" />

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
