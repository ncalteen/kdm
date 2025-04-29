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

export function SettlementNameCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  return (
    <Card>
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center gap-4">
                    <FormLabel className="text-left text-xl">
                      Settlement Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Settlement Name"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          form.setValue(field.name, e.target.value)
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
