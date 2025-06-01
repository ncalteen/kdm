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
import {
  cn,
  getCampaign,
  getSettlement,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
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
  const watchedHuntXPRankUp = form.watch('huntXPRankUp')
  const huntXPRankUp = useMemo(
    () => watchedHuntXPRankUp || [],
    [watchedHuntXPRankUp]
  )
  const settlementId = form.watch('settlementId')

  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  // Create a ref for the timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // When the component mounts, get the settlement from localStorage
  useEffect(() => {
    setSettlement(getSettlement(settlementId))

    // Cleanup function for timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [settlementId])

  /**
   * Save Hunt XP and rank up milestones to localStorage for the current
   * survivor, with Zod validation and toast feedback.
   *
   * @param updatedHuntXP Updated Hunt XP value
   * @param updatedHuntXPRankUp Updated Hunt XP rank up milestones
   * @param successMsg Success Message
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedHuntXP?: number,
      updatedHuntXPRankUp?: number[],
      successMsg?: string,
      immediate: boolean = false
    ) => {
      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (survivorIndex !== -1) {
            try {
              SurvivorSchema.shape.huntXP.parse(updatedHuntXP)
              SurvivorSchema.shape.huntXPRankUp.parse(updatedHuntXPRankUp)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            // Save to localStorage using the optimized utility
            saveCampaignToLocalStorage({
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id
                  ? {
                      ...s,
                      ...(updatedHuntXP !== undefined && {
                        huntXP: updatedHuntXP
                      }),
                      ...(updatedHuntXPRankUp !== undefined && {
                        huntXPRankUp: updatedHuntXPRankUp
                      })
                    }
                  : s
              )
            })

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Hunt XP Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        saveFunction()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(saveFunction, 300)
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

      // Check if this is a rank up milestone
      const isRankUp = checked && huntXPRankUp.includes(index)
      const successMessage = isRankUp
        ? 'The survivor rises through struggle and triumph. Rank up achieved!'
        : 'The lantern grows brighter. Hunt XP updated.'

      saveToLocalStorageDebounced(newXP, undefined, successMessage)
    },
    [form, huntXPRankUp, saveToLocalStorageDebounced]
  )

  /**
   * Handles right-clicking on Hunt XP checkboxes to toggle rank up milestones
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const handleRightClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const currentRankUps = [...huntXPRankUp]
      const rankUpIndex = currentRankUps.indexOf(index)

      if (rankUpIndex >= 0) {
        // Remove from rank up milestones
        currentRankUps.splice(rankUpIndex, 1)
        form.setValue('huntXPRankUp', currentRankUps, { shouldDirty: true })
        saveToLocalStorageDebounced(
          undefined,
          currentRankUps,
          'Rank up milestone removed.'
        )
      } else {
        // Add to rank up milestones
        currentRankUps.push(index)
        currentRankUps.sort((a, b) => a - b) // Keep sorted
        form.setValue('huntXPRankUp', currentRankUps, { shouldDirty: true })
        saveToLocalStorageDebounced(
          undefined,
          currentRankUps,
          'Rank up milestone added.'
        )
      }
    },
    [form, huntXPRankUp, saveToLocalStorageDebounced]
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
                                onContextMenu={(event) =>
                                  handleRightClick(boxIndex, event)
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
