'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn, getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { LightBulbIcon } from '@primer/octicons-react'
import { KeyboardEvent, ReactElement, useCallback, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Knowledge Card Component
 */
export function KnowledgeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  // Watch the observation rank values to ensure UI updates correctly
  const knowledge1ObservationRank = form.watch('knowledge1ObservationRank') || 0
  const knowledge2ObservationRank = form.watch('knowledge2ObservationRank') || 0

  // Watch the rank up milestone values
  const watchedKnowledge1RankUp = form.watch('knowledge1RankUp')
  const watchedKnowledge2RankUp = form.watch('knowledge2RankUp')
  const knowledge1RankUp = useMemo(
    () => watchedKnowledge1RankUp,
    [watchedKnowledge1RankUp]
  )
  const knowledge2RankUp = useMemo(
    () => watchedKnowledge2RankUp,
    [watchedKnowledge2RankUp]
  )

  // Get the canUseFightingArtsOrKnowledges value
  const watchedCanUseFightingArtsOrKnowledges = form.watch(
    'canUseFightingArtsOrKnowledges'
  )
  const canUseFightingArtsOrKnowledges = useMemo(
    () => watchedCanUseFightingArtsOrKnowledges,
    [watchedCanUseFightingArtsOrKnowledges]
  )

  /**
   * Save to Local Storage
   *
   * @param fieldName Field Name
   * @param value Field Value
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (
      fieldName: keyof Survivor,
      value: string | number | boolean,
      successMsg?: string
    ) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          try {
            SurvivorSchema.shape[fieldName].parse(value)
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
                    [fieldName]: value
                  }
                : s
            )
          })

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error(`[${fieldName}] Save Error:`, error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Handles text input changes - saves on Enter key press.
   *
   * @param e Keyboard Event
   * @param fieldName Field Name
   * @param value Current Input Value
   * @param successMsg Success Message
   */
  const handleTextKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      fieldName: keyof Survivor,
      value: string,
      successMsg: string
    ) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        saveToLocalStorage(
          fieldName,
          value,
          value.trim() ? successMsg : undefined
        )
      }
    },
    [saveToLocalStorage]
  )

  /**
   * Handles observation rank changes - saves immediately.
   *
   * @param fieldName Field Name
   * @param rank Selected Rank
   */
  const handleRankChange = useCallback(
    (fieldName: keyof Survivor, rank: number) => {
      form.setValue(fieldName, rank, { shouldDirty: true })
      saveToLocalStorage(
        fieldName,
        rank,
        'The lantern illuminates newfound wisdom.'
      )
    },
    [form, saveToLocalStorage]
  )

  /**
   * Handle toggling the canUseFightingArtsOrKnowledges checkbox
   */
  const handleCanUseToggle = useCallback(
    (checked: boolean) => {
      const updatedValue = !checked
      form.setValue('canUseFightingArtsOrKnowledges', updatedValue)
      saveToLocalStorage(
        'canUseFightingArtsOrKnowledges',
        updatedValue,
        updatedValue
          ? 'The survivor recalls their knowledge.'
          : 'The survivor has forgotten their learnings.'
      )
    },
    [form, saveToLocalStorage]
  )

  /**
   * Handles right-clicking on knowledge1 observation rank checkboxes to toggle rank up milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const handleKnowledge1RightClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp = knowledge1RankUp === index ? undefined : index

      form.setValue('knowledge1RankUp', newRankUp, { shouldDirty: true })
      saveToLocalStorage(
        'knowledge1RankUp',
        newRankUp ?? 0,
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [form, knowledge1RankUp, saveToLocalStorage]
  )

  /**
   * Handles right-clicking on knowledge2 observation rank checkboxes to toggle rank up milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const handleKnowledge2RightClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp = knowledge2RankUp === index ? undefined : index

      form.setValue('knowledge2RankUp', newRankUp, { shouldDirty: true })
      saveToLocalStorage(
        'knowledge2RankUp',
        newRankUp ?? 0,
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [form, knowledge2RankUp, saveToLocalStorage]
  )

  return (
    <Card className="p-0 border-1 gap-2 h-[615px]">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex flex-row justify-between">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            <LightBulbIcon className="h-4 w-4" />
            Knowledges
          </CardTitle>

          {/* Cannot Use Fighting Arts or Knowledges */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={!canUseFightingArtsOrKnowledges}
              onCheckedChange={handleCanUseToggle}
            />
            <Label
              htmlFor="canUseFightingArtsOrKnowledges"
              className="text-xs cursor-pointer">
              Cannot Use Knowledges
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 flex flex-col">
        {/* Knowledge 1 */}
        <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                {...form.register('knowledge1')}
                defaultValue={form.getValues('knowledge1') || ''}
                onKeyDown={(e) =>
                  handleTextKeyDown(
                    e,
                    'knowledge1',
                    e.currentTarget.value,
                    'Knowledge of the darkness expands.'
                  )
                }
              />
              <FormLabel className="text-xs text-muted-foreground">
                Knowledge Name
              </FormLabel>
            </div>
          </div>
          <div>
            <div className="flex gap-1 pt-2">
              {[...Array(9)].map((_, index) => {
                const rank = index + 1
                const checked = knowledge1ObservationRank >= rank
                const isRankUpMilestone = knowledge1RankUp === index
                return (
                  <Checkbox
                    key={index}
                    checked={checked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Check if this is a rank up milestone
                        const isRankUp = knowledge1RankUp === index
                        const successMessage = isRankUp
                          ? 'Wisdom ascends through knowledge and understanding. Rank up achieved!'
                          : 'The lantern illuminates newfound wisdom.'

                        handleRankChange('knowledge1ObservationRank', rank)
                        if (isRankUp) {
                          // Override the default success message
                          toast.success(successMessage)
                        }
                      } else if (knowledge1ObservationRank === rank) {
                        handleRankChange('knowledge1ObservationRank', rank - 1)
                      }
                    }}
                    onContextMenu={(event) =>
                      handleKnowledge1RightClick(index, event)
                    }
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !checked && isRankUpMilestone && 'border-2 border-primary'
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Knowledge 1 Rules */}
        <div className="mt-1">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter knowledge rules..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
              {...form.register('knowledge1Rules')}
              defaultValue={form.getValues('knowledge1Rules') || ''}
              onBlur={(e) => {
                saveToLocalStorage(
                  'knowledge1Rules',
                  e.target.value,
                  e.target.value.trim()
                    ? 'The rules of wisdom are inscribed in lantern light.'
                    : undefined
                )
              }}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Rules
            </FormLabel>
          </div>
        </div>

        {/* Knowledge 1 Observation Conditions */}
        <div className="mt-1">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter observation conditions..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
              {...form.register('knowledge1ObservationConditions')}
              defaultValue={
                form.getValues('knowledge1ObservationConditions') || ''
              }
              onBlur={(e) => {
                saveToLocalStorage(
                  'knowledge1ObservationConditions',
                  e.target.value,
                  e.target.value.trim()
                    ? 'Observation conditions etched in the darkness.'
                    : undefined
                )
              }}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Observation Conditions
            </FormLabel>
          </div>
        </div>

        <hr className="mt-2 mb-2 border-2" />

        {/* Knowledge 2 */}
        <div className="flex items-start gap-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                {...form.register('knowledge2')}
                defaultValue={form.getValues('knowledge2') || ''}
                onKeyDown={(e) =>
                  handleTextKeyDown(
                    e,
                    'knowledge2',
                    e.currentTarget.value,
                    'Knowledge of the darkness expands.'
                  )
                }
              />
              <FormLabel className="text-xs text-muted-foreground">
                Knowledge Name
              </FormLabel>
            </div>
          </div>
          <div>
            <div className="flex gap-1 pt-2">
              {[...Array(9)].map((_, index) => {
                const rank = index + 1
                const checked = knowledge2ObservationRank >= rank
                const isRankUpMilestone = knowledge2RankUp === index
                return (
                  <Checkbox
                    key={index}
                    checked={checked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Check if this is a rank up milestone
                        const isRankUp = knowledge2RankUp === index
                        const successMessage = isRankUp
                          ? 'Wisdom ascends through knowledge and understanding. Rank up achieved!'
                          : 'The lantern illuminates newfound wisdom.'

                        handleRankChange('knowledge2ObservationRank', rank)
                        if (isRankUp) {
                          // Override the default success message
                          toast.success(successMessage)
                        }
                      } else if (knowledge2ObservationRank === rank) {
                        handleRankChange('knowledge2ObservationRank', rank - 1)
                      }
                    }}
                    onContextMenu={(event) =>
                      handleKnowledge2RightClick(index, event)
                    }
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !checked && isRankUpMilestone && 'border-2 border-primary'
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Knowledge 2 Rules */}
        <div className="mt-1">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter knowledge rules..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
              {...form.register('knowledge2Rules')}
              defaultValue={form.getValues('knowledge2Rules') || ''}
              onBlur={(e) => {
                saveToLocalStorage(
                  'knowledge2Rules',
                  e.target.value,
                  e.target.value.trim()
                    ? 'The rules of wisdom are inscribed in lantern light.'
                    : undefined
                )
              }}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Rules
            </FormLabel>
          </div>
        </div>

        {/* Knowledge 2 Observation Conditions */}
        <div className="mt-1">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter observation conditions..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
              {...form.register('knowledge2ObservationConditions')}
              defaultValue={
                form.getValues('knowledge2ObservationConditions') || ''
              }
              onBlur={(e) => {
                saveToLocalStorage(
                  'knowledge2ObservationConditions',
                  e.target.value,
                  e.target.value.trim()
                    ? 'Observation conditions etched in the darkness.'
                    : undefined
                )
              }}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Observation Conditions
            </FormLabel>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
