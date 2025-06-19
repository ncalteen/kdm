'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { LightBulbIcon } from '@primer/octicons-react'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Knowledge Card Properties
 */
interface KnowledgeCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Knowledge Card Component
 *
 * @param props Knowledge Card Properties
 * @returns Knowledge Card Component
 */
export function KnowledgeCard({
  form,
  saveSelectedSurvivor
}: KnowledgeCardProps): ReactElement {
  // Watch form state
  const canUseFightingArtsOrKnowledges = form.watch(
    'canUseFightingArtsOrKnowledges'
  )
  const knowledge1ObservationRank = form.watch('knowledge1ObservationRank')
  const knowledge1RankUp = form.watch('knowledge1RankUp')
  const knowledge2ObservationRank = form.watch('knowledge2ObservationRank')
  const knowledge2RankUp = form.watch('knowledge2RankUp')

  /**
   * Handles observation rank changes
   *
   * @param fieldName Field Name
   * @param rank Selected Rank
   */
  const handleRankChange = useCallback(
    (fieldName: keyof Survivor, rank: number) => {
      saveSelectedSurvivor(
        {
          [fieldName]: rank
        },
        'The lantern illuminates newfound wisdom.'
      )
    },
    [saveSelectedSurvivor]
  )

  /**
   * Update Can Use Fighting Arts or Knowledges
   */
  const updateCanUseFightingArtsOrKnowledges = useCallback(
    (checked: boolean) => {
      saveSelectedSurvivor(
        {
          canUseFightingArtsOrKnowledges: !checked
        },
        !checked
          ? 'The survivor recalls their knowledge.'
          : 'The survivor has forgotten their learnings.'
      )
    },
    [saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 1
   */
  const updateKnowledge1 = (value: string) =>
    saveSelectedSurvivor(
      { knowledge1: value },
      value
        ? 'Knowledge inscribed in the lantern light.'
        : 'Knowledge forgotten in the darkness.'
    )

  /**
   * Update Knowledge 1 Observation Rank
   */
  const updateKnowledge1ObservationRank = (checked: boolean, index: number) => {
    const rank = index + 1

    if (checked) handleRankChange('knowledge1ObservationRank', rank)
    else if (knowledge1ObservationRank === rank)
      handleRankChange('knowledge1ObservationRank', rank - 1)
  }

  /**
   * Update Knowledge 1 Rank Up Milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const updateKnowledge1RankUp = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp = knowledge1RankUp === index ? undefined : index

      saveSelectedSurvivor(
        {
          knowledge1RankUp: newRankUp ?? 0
        },
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [knowledge1RankUp, saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 1 Rules
   */
  const updateKnowledge1Rules = (value: string) =>
    saveSelectedSurvivor(
      {
        knowledge1Rules: value
      },
      value.trim()
        ? 'The rules of wisdom are inscribed in lantern light.'
        : undefined
    )

  /**
   * Update Knowledge 1 Observation Conditions
   */
  const updateKnowledge1ObservationConditions = (value: string) =>
    saveSelectedSurvivor(
      {
        knowledge1ObservationConditions: value
      },
      value.trim()
        ? 'Observation conditions etched in the darkness.'
        : undefined
    )

  /**
   * Update Knowledge 2
   */
  const updateKnowledge2 = (value: string) =>
    saveSelectedSurvivor(
      { knowledge2: value },
      value
        ? 'Knowledge inscribed in the lantern light.'
        : 'Knowledge forgotten in the darkness.'
    )

  /**
   * Update Knowledge 2 Observation Rank
   */
  const updateKnowledge2ObservationRank = (checked: boolean, index: number) => {
    const rank = index + 1

    if (checked) handleRankChange('knowledge2ObservationRank', rank)
    else if (knowledge2ObservationRank === rank)
      handleRankChange('knowledge2ObservationRank', rank - 1)
  }

  /**
   * Update Knowledge 2 Rank Up Milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const updateKnowledge2RankUp = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp = knowledge2RankUp === index ? undefined : index

      saveSelectedSurvivor(
        {
          knowledge2RankUp: newRankUp ?? 0
        },
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [knowledge2RankUp, saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 2 Rules
   */
  const updateKnowledge2Rules = (value: string) =>
    saveSelectedSurvivor(
      {
        knowledge2Rules: value
      },
      value.trim()
        ? 'The rules of wisdom are inscribed in lantern light.'
        : undefined
    )

  /**
   * Update Knowledge 1 Observation Conditions
   */
  const updateKnowledge2ObservationConditions = (value: string) =>
    saveSelectedSurvivor(
      {
        knowledge2ObservationConditions: value
      },
      value.trim()
        ? 'Observation conditions etched in the darkness.'
        : undefined
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
              onCheckedChange={updateCanUseFightingArtsOrKnowledges}
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
              <FormField
                control={form.control}
                name="knowledge1"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-1">
                      <FormControl>
                        <Input
                          placeholder="Enter knowledge..."
                          className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                          {...field}
                          value={field.value || ''}
                          onBlur={(e) => {
                            field.onBlur()
                            updateKnowledge1(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs text-muted-foreground">
                        Knowledge Name
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <div className="flex gap-1 pt-2">
              {[...Array(9)].map((_, index) => {
                const checked = (knowledge1ObservationRank || 0) >= index + 1
                const isRankUpMilestone = knowledge1RankUp === index

                return (
                  <Checkbox
                    key={index}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      updateKnowledge1ObservationRank(!!checked, index)
                    }
                    onContextMenu={(event) =>
                      updateKnowledge1RankUp(index, event)
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
              onBlur={(e) => updateKnowledge1Rules(e.target.value)}
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
              onBlur={(e) =>
                updateKnowledge1ObservationConditions(e.target.value)
              }
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
              <FormField
                control={form.control}
                name="knowledge2"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-1">
                      <FormControl>
                        <Input
                          placeholder="Enter knowledge..."
                          className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
                          {...field}
                          value={field.value || ''}
                          onBlur={(e) => {
                            field.onBlur()
                            updateKnowledge2(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs text-muted-foreground">
                        Knowledge Name
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <div className="flex gap-1 pt-2">
              {[...Array(9)].map((_, index) => {
                const rank = index + 1
                const checked = (knowledge2ObservationRank || 0) >= rank
                const isRankUpMilestone = knowledge2RankUp === index

                return (
                  <Checkbox
                    key={index}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      updateKnowledge2ObservationRank(!!checked, index)
                    }
                    onContextMenu={(event) =>
                      updateKnowledge2RankUp(index, event)
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
              onBlur={(e) => updateKnowledge2Rules(e.target.value)}
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
              onBlur={(e) =>
                updateKnowledge2ObservationConditions(e.target.value)
              }
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
