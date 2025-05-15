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
import { SurvivorSchema } from '@/schemas/survivor'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Philosophy Card Component
 */
export function PhilosophyCard({
  ...form
}: UseFormReturn<z.infer<typeof SurvivorSchema>>) {
  const watchedPhilosophy = form.watch('philosophy')

  /**
   * Handles the change of philosophy selection.
   *
   * @param value Value
   */
  const handlePhilosophyChange = (value: string) => {
    // Update the form directly
    form.setValue('philosophy', value ? (value as Philosophy) : undefined, {
      shouldDirty: true
    })

    // If philosophy is cleared or changed, reset rank to 0
    if (!value) form.setValue('philosophyRank', 0, { shouldDirty: true })
  }

  return (
    <Card className="mt-2 min-w-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Philosophy</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-grow">
              <SelectPhilosophy
                options={Object.values(Philosophy)}
                value={watchedPhilosophy || ''}
                onChange={handlePhilosophyChange}
              />
            </div>
            <FormField
              control={form.control}
              name="philosophyRank"
              render={({ field }) => (
                <FormItem className="mb-0">
                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        className="w-12 text-center no-spinners"
                        {...field}
                        value={field.value ?? '0'}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          // Ensure the value is between 0 and 9
                          const clampedValue = Math.min(Math.max(value, 0), 9)
                          form.setValue(field.name, clampedValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Rank</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="text-xs">
            <strong>Ponder:</strong> If you are a{' '}
            <strong>returning survivor</strong> and reach a new HuntXP
            milestone, you must rank up your philosophy. Limit, once per
            settlement phase.
          </p>

          <hr className="mt-2 mb-2" />

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
                      className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormLabel className="text-s">Neurosis</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Tenet Knowledge and Ranks */}
          <div className="flex items-start gap-2 mt-2">
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
                          className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Tenet Knowledge</FormLabel>
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
                    <div className="flex gap-1 items-center">
                      {[...Array(9)].map((_, index) => (
                        <Checkbox
                          key={index}
                          checked={(field.value || 0) > index}
                          onCheckedChange={(checked) => {
                            if (checked)
                              form.setValue(
                                'tenetKnowledgeObservationRank',
                                index + 1
                              )
                            else if ((field.value || 0) === index + 1)
                              form.setValue(
                                'tenetKnowledgeObservationRank',
                                index
                              )
                          }}
                        />
                      ))}
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
              <FormItem className="mt-2">
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Textarea
                      placeholder="Enter tenet knowledge rules..."
                      className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 min-h-[20px] h-auto overflow-hidden"
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = `${target.scrollHeight}px`
                      }}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Rules</FormLabel>
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
              <FormItem className="mt-2">
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Textarea
                      placeholder="Enter observation conditions..."
                      className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 min-h-[20px] h-auto overflow-hidden"
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = `${target.scrollHeight}px`
                      }}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">
                    Observation Conditions
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
