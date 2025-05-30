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
import { cn, getCampaign, getSettlement } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
export function HuntXPCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
  const huntXP = form.watch('huntXP') || 0
  const huntXPRankUp = form.watch('huntXPRankUp') || []
  const settlementId = form.watch('settlementId')

  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  // When the component mounts, get the settlement from localStorage
  useEffect(() => setSettlement(getSettlement(settlementId)), [settlementId])

  /**
   * Save Hunt XP to localStorage for the current survivor, with Zod validation and toast feedback.
   *
   * @param updatedHuntXP Updated Hunt XP value
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (updatedHuntXP: number, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          const updatedSurvivor = {
            ...campaign.survivors[survivorIndex],
            huntXP: updatedHuntXP
          }

          try {
            SurvivorSchema.parse(updatedSurvivor)
          } catch (error) {
            if (error instanceof ZodError && error.errors[0]?.message)
              return toast.error(error.errors[0].message)
            else
              return toast.error(
                'The darkness swallows your words. Please try again.'
              )
          }

          campaign.survivors[survivorIndex] = {
            ...campaign.survivors[survivorIndex],
            huntXP: updatedHuntXP
          }

          localStorage.setItem('campaign', JSON.stringify(campaign))

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error('Hunt XP Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Handles toggling the Hunt XP checkboxes
   *
   * @param index The index of the checkbox (0-based)
   * @param checked Whether the checkbox is checked
   */
  const handleToggle = useCallback(
    (index: number, checked: boolean) => {
      const newXP = checked ? index : index - 1
      form.setValue('huntXP', newXP, { shouldDirty: true })
      saveToLocalStorage(newXP, 'The lantern grows brighter. Hunt XP updated.')
    },
    [form, saveToLocalStorage]
  )

  /**
   * Checks if a checkbox should be disabled
   *
   * @param index The index of the checkbox (0-based)
   * @returns True if the checkbox should be disabled
   */
  const isDisabled = useCallback(
    (index: number) => index > huntXP + 1,
    [huntXP]
  )

  return (
    <Card className="p-0 border-0">
      <CardContent className="p-0 pt-3">
        <div className="flex flex-col">
          <div className="flex items-center">
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
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 16 }, (_, i) => {
                          const boxIndex = i
                          const checked = huntXP >= boxIndex
                          const milestone = huntXPRankUp.includes(boxIndex)
                          const isLast = boxIndex === 15
                          return (
                            <div key={boxIndex} className="flex">
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

        <hr className="mt-3 mb-1" />

        <div className="flex items-center justify-between">
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
            <span className="text-xs">Retired</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
