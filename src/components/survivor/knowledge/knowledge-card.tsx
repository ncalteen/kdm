'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveSurvivorToLocalStorage } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { LightBulbIcon } from '@primer/octicons-react'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Knowledge Card Component
 */
export function KnowledgeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  // Watch the observation rank values to ensure UI updates correctly
  const knowledge1ObservationRank = form.watch('knowledge1ObservationRank') || 0
  const knowledge2ObservationRank = form.watch('knowledge2ObservationRank') || 0

  /**
   * Save knowledge data to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param fieldName Field Name
   * @param value Field Value
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (fieldName: keyof Survivor, value: string | number, successMsg?: string) =>
      saveSurvivorToLocalStorage(form, fieldName, value, successMsg),
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
      e: React.KeyboardEvent<HTMLInputElement>,
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
   * Handles textarea changes - saves on Enter key press.
   *
   * @param e Keyboard Event
   * @param fieldName Field Name
   * @param value Current Input Value
   * @param successMsg Success Message
   */
  const handleTextareaKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLTextAreaElement>,
      fieldName: keyof Survivor,
      value: string,
      successMsg: string
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
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
   * Helper function to handle textarea auto-resize
   */
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }

  return (
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <LightBulbIcon className="h-4 w-4" />
          Knowledges
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 py-0">
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
                return (
                  <Checkbox
                    key={index}
                    checked={knowledge1ObservationRank >= rank}
                    onCheckedChange={(checked) => {
                      if (checked)
                        handleRankChange('knowledge1ObservationRank', rank)
                      else if (knowledge1ObservationRank === rank)
                        handleRankChange('knowledge1ObservationRank', rank - 1)
                    }}
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
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge1Rules')}
              defaultValue={form.getValues('knowledge1Rules') || ''}
              onKeyDown={(e) =>
                handleTextareaKeyDown(
                  e,
                  'knowledge1Rules',
                  e.currentTarget.value,
                  'The rules of wisdom are inscribed in lantern light.'
                )
              }
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
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge1ObservationConditions')}
              defaultValue={
                form.getValues('knowledge1ObservationConditions') || ''
              }
              onKeyDown={(e) =>
                handleTextareaKeyDown(
                  e,
                  'knowledge1ObservationConditions',
                  e.currentTarget.value,
                  'Observation conditions etched in the darkness.'
                )
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
                return (
                  <Checkbox
                    key={index}
                    checked={knowledge2ObservationRank >= rank}
                    onCheckedChange={(checked) => {
                      if (checked)
                        handleRankChange('knowledge2ObservationRank', rank)
                      else if (knowledge2ObservationRank === rank)
                        handleRankChange('knowledge2ObservationRank', rank - 1)
                    }}
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
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge2Rules')}
              defaultValue={form.getValues('knowledge2Rules') || ''}
              onKeyDown={(e) =>
                handleTextareaKeyDown(
                  e,
                  'knowledge2Rules',
                  e.currentTarget.value,
                  'The rules of wisdom are inscribed in lantern light.'
                )
              }
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
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge2ObservationConditions')}
              defaultValue={
                form.getValues('knowledge2ObservationConditions') || ''
              }
              onKeyDown={(e) =>
                handleTextareaKeyDown(
                  e,
                  'knowledge2ObservationConditions',
                  e.currentTarget.value,
                  'Observation conditions etched in the darkness.'
                )
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
