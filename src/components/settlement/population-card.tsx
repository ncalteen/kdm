'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCampaign, getSurvivors } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Population Card Component
 *
 * TODO: Auto-update population
 * TODO: Auto-update death count
 * TODO: Auto-update lost settlements
 */
export function PopulationCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const settlementId = form.watch('id')

  // Handler for Enter key in survival limit field
  const handleSurvivalLimitKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      try {
        // Get current form values
        const formValues = form.getValues()

        // Get existing campaign data from localStorage
        const campaign = getCampaign()

        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].survivalLimit =
          formValues.survivalLimit

        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success('Survival limit updated!')
      } catch (error) {
        console.error('Error saving timeline to localStorage:', error)
      }
    }
  }

  useEffect(() => {
    const survivors = getSurvivors(settlementId)

    if (survivors)
      form.setValue(
        'population',
        survivors.filter((survivor) => !survivor.dead).length
      )
    else form.setValue('population', 0)

    if (survivors)
      form.setValue(
        'deathCount',
        survivors.filter((survivor) => survivor.dead).length
      )
    else form.setValue('deathCount', 0)
  }, [settlementId, form])

  return (
    <Card className="mt-2">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row items-center justify-between">
          {/* Survival Limit */}
          <FormField
            control={form.control}
            name="survivalLimit"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '1'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                      onKeyDown={handleSurvivalLimitKeyDown}
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Survival Limit
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-10 w-px bg-border"></div>

          {/* Population */}
          <FormField
            control={form.control}
            name="population"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Population
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-10 w-px bg-border"></div>

          {/* Death Count */}
          <FormField
            control={form.control}
            name="deathCount"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Death Count
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-10 w-px bg-border"></div>

          {/* Lost Settlement Count */}
          <FormField
            control={form.control}
            name="lostSettlements"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? ''}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Lost Settlements
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
