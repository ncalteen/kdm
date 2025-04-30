'use client'

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
        <div className="flex flex-row flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1 w-max">
                <div className="flex items-center gap-2">
                  <FormLabel className="w-max text-left">
                    Settlement Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Settlement Name"
                      className="w-full"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        form.setValue(field.name, e.target.value)
                      }}
                    />
                  </FormControl>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  When the settlement is named for the first time,{' '}
                  <strong>returning survivors</strong> gain +1 survival.
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
