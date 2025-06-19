'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { BrainCogIcon } from 'lucide-react'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Philosophy Card Properties
 */
interface PhilosophyCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Survivors */
  updateSurvivors: (survivors: Survivor[]) => void
}

/**
 * Philosophy Card Component
 *
 * @param props Philosophy Card Properties
 * @returns Philosophy Card Component
 */
export function PhilosophyCard({
  form,
  saveSelectedSurvivor,
  selectedSurvivor,
  survivors,
  updateSurvivors
}: PhilosophyCardProps): ReactElement {
  // Watch form state
  const philosophy = form.watch('philosophy')
  const tenetKnowledgeRankUp = form.watch('tenetKnowledgeRankUp')
  const tenetKnowledgeObservationRank = form.watch(
    'tenetKnowledgeObservationRank'
  )

  /**
   * Handles the change of philosophy selection.
   *
   * @param value Value
   */
  const handlePhilosophyChange = useCallback(
    (value: string) => {
      const updateData: Partial<Survivor> = {
        philosophy: value === '' ? null : (value as Philosophy),
        ...(value ? {} : { philosophyRank: 0 })
      }

      saveSelectedSurvivor(
        updateData,
        value
          ? 'The path of wisdom begins to illuminate the darkness.'
          : 'The philosophical path returns to shadow.'
      )

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && selectedSurvivor?.id) {
        const updatedSurvivors = survivors.map((s) =>
          s.id === selectedSurvivor?.id ? { ...s, ...updateData } : s
        )

        // Update both localStorage and context
        localStorage.setItem('survivors', JSON.stringify(updatedSurvivors))
        updateSurvivors(updatedSurvivors)
      }
    },
    [saveSelectedSurvivor, survivors, selectedSurvivor?.id, updateSurvivors]
  )

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

      saveSelectedSurvivor(
        { tenetKnowledgeRankUp: newRankUp },
        newRankUp !== undefined
          ? 'Tenet knowledge rank up milestone marked.'
          : 'Tenet knowledge rank up milestone removed.'
      )
    },
    [tenetKnowledgeRankUp, saveSelectedSurvivor]
  )

  /**
   * Update Philosophy Rank
   */
  const updatePhilosophyRank = useCallback(
    (val: string) => {
      const value = parseInt(val) || 0
      const survivorId = form.getValues('id')

      // Enforce minimum value of 0
      if (value < 0) return toast.error('Philosophy rank cannot be negative.')

      const updateData: Partial<Survivor> = { philosophyRank: value }

      saveSelectedSurvivor(updateData, 'Philosophy rank has been updated.')

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && survivorId) {
        const updatedSurvivors = survivors.map((s) =>
          s.id === survivorId ? { ...s, ...updateData } : s
        )

        // Update both localStorage and context
        localStorage.setItem('survivors', JSON.stringify(updatedSurvivors))
        updateSurvivors(updatedSurvivors)
      }
    },
    [saveSelectedSurvivor, survivors, form, updateSurvivors]
  )

  /**
   * Update Neurosis
   */
  const updateNeurosis = (value: string) =>
    saveSelectedSurvivor(
      { neurosis: value },
      value
        ? 'The neurosis manifests in the mind.'
        : 'The neurosis fades into darkness.'
    )

  /**
   * Update Tenet Knowledge
   */
  const updateTenetKnowledge = (value: string) =>
    saveSelectedSurvivor(
      { tenetKnowledge: value },
      value
        ? 'Tenet knowledge is inscribed in memory.'
        : 'Tenet knowledge dissolves into shadow.'
    )

  /**
   * Update Tenet Knowledge Observation Rank
   */
  const updateTenetKnowledgeObservationRank = (
    checked: boolean,
    index: number
  ) => {
    const newRank = checked
      ? index + 1
      : (tenetKnowledgeObservationRank || 0) === index + 1
        ? index
        : undefined

    if (newRank === undefined) return

    // Check if this is a rank up milestone
    const isRankUp = checked && tenetKnowledgeRankUp === index

    // Save to localStorage
    saveSelectedSurvivor(
      { tenetKnowledgeObservationRank: newRank },
      isRankUp
        ? 'Wisdom ascends through knowledge and understanding. Rank up achieved!'
        : `Observation rank ${newRank} burns bright in the lantern's glow.`
    )
  }

  /**
   * Update Tenet Knowledge Rules
   */
  const updateTenetKnowledgeRules = (value: string) =>
    saveSelectedSurvivor(
      { tenetKnowledgeRules: value },
      value
        ? 'The rules of knowledge are etched in stone.'
        : 'The rules fade back into mystery.'
    )

  /**
   * Update Tenet Knowledge Observation Conditions
   */
  const updateTenetKnowledgeObservationConditions = (value: string) =>
    saveSelectedSurvivor(
      { tenetKnowledgeObservationConditions: value },
      value
        ? "Observation conditions are recorded in the survivor's memory."
        : 'The conditions vanish into the void.'
    )

  return (
    <Card className="p-0 border-1 gap-2 h-[483px] justify-between">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex flex-row justify-between">
          {/* Philosophy */}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-md flex flex-row items-center gap-1">
              <BrainCogIcon className="h-4 w-4" />
              Philosophy
            </CardTitle>
            <SelectPhilosophy
              options={Object.values(Philosophy)}
              value={philosophy ?? ''}
              onChange={handlePhilosophyChange}
            />
          </div>

          {/* Rank */}
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
                      'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl'
                    )}
                    {...field}
                    value={field.value ?? '0'}
                    onChange={(e) => updatePhilosophyRank(e.target.value)}
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
      </CardHeader>

      <hr className="my-1" />

      <CardContent className="p-2 flex flex-col">
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
                      updateNeurosis(e.target.value)
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
                          updateTenetKnowledge(e.target.value)
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
                          onCheckedChange={(checked) =>
                            updateTenetKnowledgeObservationRank(
                              !!checked,
                              index
                            )
                          }
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
                    className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      updateTenetKnowledgeRules(e.target.value)
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
                    className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      updateTenetKnowledgeObservationConditions(e.target.value)
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
