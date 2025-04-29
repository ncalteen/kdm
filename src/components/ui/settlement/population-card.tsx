import { SettlementSchema } from '@/schemas/settlement'
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
  return (
    <Card>
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row flex-wrap gap-4">
          <FormField
            control={form.control}
            name="survivalLimit"
            render={({ field }) => (
              <FormItem className="flex-none">
                <div className="flex flex-col items-center gap-2 h-full">
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
                  <FormLabel className="text-left text-xs">
                    Population
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-px bg-border"></div>

          <FormField
            control={form.control}
            name="lostSettlements"
            render={({ field }) => (
              <FormItem className="flex-none">
                <div className="flex flex-col items-center gap-2 h-full">
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
                  <FormLabel className="text-left text-xs">
                    Death Count
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
