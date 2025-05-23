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
import { cn, getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { ReactElement } from 'react'
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

  /**
   * Save philosophy data to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedData Updated philosophy data
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedData: Partial<Survivor>,
    successMsg?: string
  ) => {
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

        Object.assign(campaign.survivors[survivorIndex], updatedData)
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Philosophy Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

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

    // Save to localStorage
    saveToLocalStorage(
      {
        philosophy: philosophyValue,
        ...(value ? {} : { philosophyRank: 0 })
      },
      value
        ? 'The path of wisdom begins to illuminate the darkness.'
        : 'The philosophical path returns to shadow.'
    )
  }

  return (
    <Card className="border-2">
      <CardContent className="p-3 flex flex-col">
        {/* Philosophy and Rank */}
        <div className="flex flex-row justify-between pb-2">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-md">Philosophy</CardTitle>
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
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className={cn(
                        'w-16 h-16 text-center md:text-3xl no-spinners'
                      )}
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        const clampedValue = Math.min(Math.max(value, 0), 9)
                        form.setValue(field.name, clampedValue)

                        // Save to localStorage
                        saveToLocalStorage(
                          { philosophyRank: clampedValue },
                          'Philosophy rank has been updated.'
                        )
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rules Text */}
        <p className="text-xs">
          <strong>Ponder:</strong> If you are a{' '}
          <strong>returning survivor</strong> and reach a new Hunt XP milestone,
          you must rank up your philosophy. Limit, once per settlement phase.
        </p>

        {/* Horizontal Divider */}
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
                    className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-lg"
                    {...field}
                    value={field.value || ''}
                    onBlur={(e) => {
                      field.onBlur()
                      saveToLocalStorage(
                        { neurosis: e.target.value },
                        e.target.value
                          ? 'The neurosis manifests in the mind.'
                          : 'The neurosis fades into darkness.'
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
                        className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-lg"
                        {...field}
                        value={field.value || ''}
                        onBlur={(e) => {
                          field.onBlur()
                          saveToLocalStorage(
                            { tenetKnowledge: e.target.value },
                            e.target.value
                              ? 'Tenet knowledge is inscribed in memory.'
                              : 'Tenet knowledge dissolves into shadow.'
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
                  <div className="flex gap-1 items-center">
                    {[...Array(9)].map((_, index) => (
                      <Checkbox
                        key={index}
                        checked={(field.value || 0) > index}
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

                          // Save to localStorage
                          saveToLocalStorage(
                            { tenetKnowledgeObservationRank: newRank },
                            `Observation rank ${newRank} burns bright in the lantern's glow.`
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
                      saveToLocalStorage(
                        { tenetKnowledgeRules: e.target.value },
                        e.target.value
                          ? 'The rules of knowledge are etched in stone.'
                          : 'The rules fade back into mystery.'
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
            <FormItem className="mt-2">
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
                      saveToLocalStorage(
                        { tenetKnowledgeObservationConditions: e.target.value },
                        e.target.value
                          ? "Observation conditions are recorded in the survivor's memory."
                          : 'The conditions vanish into the void.'
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
