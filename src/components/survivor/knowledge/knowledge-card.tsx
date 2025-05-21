'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Knowledge Card Component
 */
export function KnowledgeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  /**
   * Helper function to handle textarea auto-resize
   */
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }

  return (
    <Card className="mt-1 border-2">
      <CardHeader className="px-3 pt-2 pb-0">
        <CardTitle className="text-md">Knowledges</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        {/* Knowledge 1 */}
        <div className="flex items-start gap-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-lg"
                {...form.register('knowledge1')}
                defaultValue={form.getValues('knowledge1') || ''}
              />
              <FormLabel className="text-xs text-muted-foreground">
                Knowledge Name
              </FormLabel>
            </div>
          </div>
          <div>
            <div className="flex gap-1 items-center">
              {[...Array(9)].map((_, index) => {
                const rank = index + 1
                return (
                  <Checkbox
                    key={index}
                    checked={
                      (form.getValues('knowledge1ObservationRank') || 0) >= rank
                    }
                    onCheckedChange={(checked) => {
                      const currentRank =
                        form.getValues('knowledge1ObservationRank') || 0

                      if (checked)
                        form.setValue('knowledge1ObservationRank', rank)
                      else if (currentRank === rank)
                        form.setValue('knowledge1ObservationRank', rank - 1)
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Knowledge 1 Rules */}
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter knowledge rules..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge1Rules')}
              defaultValue={form.getValues('knowledge1Rules') || ''}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Rules
            </FormLabel>
          </div>
        </div>

        {/* Knowledge 1 Observation Conditions */}
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter observation conditions..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge1ObservationConditions')}
              defaultValue={
                form.getValues('knowledge1ObservationConditions') || ''
              }
            />
            <FormLabel className="text-xs text-muted-foreground">
              Observation Conditions
            </FormLabel>
          </div>
        </div>

        <hr className="mt-2 mb-2" />

        {/* Knowledge 2 */}
        <div className="flex items-start gap-2 mt-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-lg"
                {...form.register('knowledge2')}
                defaultValue={form.getValues('knowledge2') || ''}
              />
              <FormLabel className="text-xs text-muted-foreground">
                Knowledge Name
              </FormLabel>
            </div>
          </div>
          <div>
            <div className="flex gap-1 items-center">
              {[...Array(9)].map((_, index) => {
                const rank = index + 1
                return (
                  <Checkbox
                    key={index}
                    checked={
                      (form.getValues('knowledge2ObservationRank') || 0) >= rank
                    }
                    onCheckedChange={(checked) => {
                      const currentRank =
                        form.getValues('knowledge2ObservationRank') || 0
                      if (checked) {
                        form.setValue('knowledge2ObservationRank', rank)
                      } else if (currentRank === rank) {
                        form.setValue('knowledge2ObservationRank', rank - 1)
                      }
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Knowledge 2 Rules */}
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter knowledge rules..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge2Rules')}
              defaultValue={form.getValues('knowledge2Rules') || ''}
            />
            <FormLabel className="text-xs text-muted-foreground">
              Rules
            </FormLabel>
          </div>
        </div>

        {/* Knowledge 2 Observation Conditions */}
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter observation conditions..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-auto overflow-hidden"
              onInput={handleTextareaInput}
              {...form.register('knowledge2ObservationConditions')}
              defaultValue={
                form.getValues('knowledge2ObservationConditions') || ''
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
