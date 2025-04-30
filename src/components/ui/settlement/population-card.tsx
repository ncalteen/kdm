import { getSurvivors } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form'
import { Input } from '../input'

export function PopulationCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const settlementId = form.watch('id')

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
                      value={field.value ?? ''}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
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
