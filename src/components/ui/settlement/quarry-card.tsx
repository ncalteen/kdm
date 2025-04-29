import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '../form'

// Common quarries in KDM
const COMMON_QUARRIES = [
  'White Lion',
  'Screaming Antelope',
  'Phoenix',
  'Butcher',
  "King's Man",
  'The Hand',
  'Watcher'
]

export function QuarryCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quarries</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {COMMON_QUARRIES.map((quarry) => (
            <FormField
              key={quarry}
              control={form.control}
              name="quarries"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(quarry)}
                      onCheckedChange={(checked) => {
                        const currentQuarries = [...(field.value || [])]
                        if (checked) {
                          if (!currentQuarries.includes(quarry)) {
                            currentQuarries.push(quarry)
                          }
                        } else {
                          const index = currentQuarries.indexOf(quarry)
                          if (index !== -1) {
                            currentQuarries.splice(index, 1)
                          }
                        }
                        form.setValue('quarries', currentQuarries)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    {quarry}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
