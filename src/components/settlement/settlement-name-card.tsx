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
import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Settlement Name Card Component
 */
export function SettlementNameCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  return (
    <Card>
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row justify-between items-center">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-left">Settlement</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Settlement Name"
                      className="w-[300px]"
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
