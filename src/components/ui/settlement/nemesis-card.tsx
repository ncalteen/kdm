import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '../form'

// Common nemesis monsters in KDM
const COMMON_NEMESIS = [
  'Butcher',
  "King's Man",
  'The Hand',
  'Watcher',
  'Gold Smoke Knight'
]

export function NemesisCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nemesis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="grid grid-cols-1 gap-2">
          {COMMON_NEMESIS.map((nemesis) => (
            <FormField
              key={nemesis}
              control={form.control}
              name="nemesis"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(nemesis)}
                      onCheckedChange={(checked) => {
                        const currentNemesis = [...(field.value || [])]
                        if (checked) {
                          if (!currentNemesis.includes(nemesis)) {
                            currentNemesis.push(nemesis)
                          }
                        } else {
                          const index = currentNemesis.indexOf(nemesis)
                          if (index !== -1) {
                            currentNemesis.splice(index, 1)
                          }
                        }
                        form.setValue('nemesis', currentNemesis)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    {nemesis}
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
