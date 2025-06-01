'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Philosophy } from '@/lib/enums'
import { cn, getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { BrainCogIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Philosophy Card Component
 */
export function PhilosophyCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const watchedPhilosophy = form.watch('philosophy')
  const watchedTenetKnowledgeRankUp = form.watch('tenetKnowledgeRankUp')
  const tenetKnowledgeRankUp = useMemo(
    () => watchedTenetKnowledgeRankUp,
    [watchedTenetKnowledgeRankUp]
  )

  // Reference to the debounce timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  /**
   * Save philosophy data to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedData Updated philosophy data
   * @param successMsg Success Message
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedData: Partial<Survivor>,
      successMsg?: string,
      immediate = false
    ) => {
      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (survivorIndex !== -1) {
            const updatedSurvivor = {
              ...campaign.survivors[survivorIndex],
              ...updatedData
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

            // Use the optimized utility function
            saveCampaignToLocalStorage({
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id ? updatedSurvivor : s
              )
            })

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Philosophy Save Error:', error)
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
   * Handles the change of philosophy selection.
   *
   * @param value Value
   */
  const handlePhilosophyChange = (value: string) => {
    const philosophyValue = value ? (value as Philosophy) : undefined

    // Update the form directly
    form.setValue('philosophy', philosophyValue, {
      shouldDirty: true
    })

    // If philosophy is cleared or changed, reset rank to 0
    if (!value || value.trim() === '')
      form.setValue('philosophyRank', 0, { shouldDirty: true })

    // Save to localStorage with immediate execution
    saveToLocalStorageDebounced(
      {
        philosophy: philosophyValue,
        ...(value ? {} : { philosophyRank: 0 })
      },
      value
        ? 'The path of wisdom begins to illuminate the darkness.'
        : 'The philosophical path returns to shadow.',
      true
    )
  }

  /**
   * Handles right-clicking on tenet knowledge observation rank checkboxes to toggle rank up milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const handleRightClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp = tenetKnowledgeRankUp === index ? undefined : index

      form.setValue('tenetKnowledgeRankUp', newRankUp, { shouldDirty: true })

      // Save to localStorage with immediate execution
      saveToLocalStorageDebounced(
        { tenetKnowledgeRankUp: newRankUp },
        newRankUp !== undefined
          ? 'Tenet knowledge rank up milestone marked.'
          : 'Tenet knowledge rank up milestone removed.',
        true
      )
    },
    [form, tenetKnowledgeRankUp, saveToLocalStorageDebounced]
  )

  return (
    <Card className="p-0 pb-1 border-3">
      <CardContent className="p-2 flex flex-col">
        {/* Philosophy and Rank */}
        <div className="flex flex-row justify-between pb-2">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-md flex flex-row items-center gap-1">
              <BrainCogIcon className="h-4 w-4" />
              Philosophy
            </CardTitle>
            <SelectPhilosophy
              options={Object.values(Philosophy)}
              value={watchedPhilosophy}
              onChange={handlePhilosophyChange}
            />
          </div>
          <FormField
            control={form.control}
            name="philosophyRank"
            render={({ field }) => (
              <FormItem className="mb-0">
                <FormControl>
                  <Input
                    placeholder="0"
                    type="number"
                    className={cn(
                      'w-14 h-14 text-center no-spinners text-3xl sm:text-3xl md:text-3xl'
                    )}
                    {...field}
                    value={field.value ?? '0'}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      const clampedValue = Math.min(Math.max(value, 0), 9)
                      form.setValue(field.name, clampedValue)

                      // Save to localStorage
                      saveToLocalStorageDebounced(
                        { philosophyRank: clampedValue },
                        'Philosophy rank has been updated.',
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rules Text */}
        <p className="text-xs text-muted-foreground">
          <strong>Ponder:</strong> If you are a{' '}
          <strong>returning survivor</strong> and reach a new Hunt XP milestone,
          you must rank up your philosophy. Limit, once per settlement phase.
        </p>

        {/* Horizontal Divider */}
        <hr className="mt-2 mb-1" />

        {/* Neurosis */}
        <FormField
          control={form.control}
          name="neurosis"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    placeholder="Enter neurosis..."
                    className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      saveToLocalStorageDebounced(
                        { neurosis: e.target.value },
                        e.target.value
                          ? 'The neurosis manifests in the mind.'
                          : 'The neurosis fades into darkness.',
                        false
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs text-muted-foreground">
                  Neurosis
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Tenet Knowledge and Ranks */}
        <div className="flex items-start gap-2 mt-1">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="tenetKnowledge"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-1">
                    <FormControl>
                      <Input
                        placeholder="Enter tenet knowledge..."
                        className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                        {...field}
                        value={field.value || ''}
                        onBlur={(e) => {
                          field.onBlur()
                          saveToLocalStorageDebounced(
                            { tenetKnowledge: e.target.value },
                            e.target.value
                              ? 'Tenet knowledge is inscribed in memory.'
                              : 'Tenet knowledge dissolves into shadow.',
                            false
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground">
                      Tenet Knowledge
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="tenetKnowledgeObservationRank"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-1 pt-2">
                    {[...Array(9)].map((_, index) => {
                      const checked = (field.value || 0) > index
                      const isRankUpMilestone = tenetKnowledgeRankUp === index
                      return (
                        <Checkbox
                          key={index}
                          checked={checked}
                          onCheckedChange={(checked) => {
                            let newRank
                            if (checked) {
                              newRank = index + 1
                              form.setValue(
                                'tenetKnowledgeObservationRank',
                                newRank
                              )
                            } else if ((field.value || 0) === index + 1) {
                              newRank = index
                              form.setValue(
                                'tenetKnowledgeObservationRank',
                                newRank
                              )
                            } else return

                            // Check if this is a rank up milestone
                            const isRankUp =
                              checked && tenetKnowledgeRankUp === index
                            const successMessage = isRankUp
                              ? 'Wisdom ascends through knowledge and understanding. Rank up achieved!'
                              : `Observation rank ${newRank} burns bright in the lantern's glow.`

                            // Save to localStorage
                            saveToLocalStorageDebounced(
                              { tenetKnowledgeObservationRank: newRank },
                              successMessage,
                              true
                            )
                          }}
                          onContextMenu={(event) =>
                            handleRightClick(index, event)
                          }
                          className={cn(
                            'h-4 w-4 rounded-sm',
                            !checked &&
                              isRankUpMilestone &&
                              'border-2 border-primary'
                          )}
                        />
                      )
                    })}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tenet Knowledge Rules */}
        <FormField
          control={form.control}
          name="tenetKnowledgeRules"
          render={({ field }) => (
            <FormItem className="mt-1">
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Textarea
                    placeholder="Enter tenet knowledge rules..."
                    className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = `${target.scrollHeight}px`
                    }}
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      saveToLocalStorageDebounced(
                        { tenetKnowledgeRules: e.target.value },
                        e.target.value
                          ? 'The rules of knowledge are etched in stone.'
                          : 'The rules fade back into mystery.',
                        false
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs text-muted-foreground">
                  Rules
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Tenet Knowledge Observation Conditions */}
        <FormField
          control={form.control}
          name="tenetKnowledgeObservationConditions"
          render={({ field }) => (
            <FormItem className="mt-1">
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Textarea
                    placeholder="Enter observation conditions..."
                    className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = `${target.scrollHeight}px`
                    }}
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      saveToLocalStorageDebounced(
                        { tenetKnowledgeObservationConditions: e.target.value },
                        e.target.value
                          ? "Observation conditions are recorded in the survivor's memory."
                          : 'The conditions vanish into the void.',
                        false
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs text-muted-foreground">
                  Observation Conditions
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
