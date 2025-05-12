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
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Settlement Name Card Component
 */
export function SettlementNameCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      // Get current form values
      const formValues = form.getValues()

      // Get existing campaign data from localStorage
      const campaign = JSON.parse(
        localStorage.getItem('campaign') ||
          JSON.stringify({
            settlements: [],
            survivors: []
          })
      )

      // Find the settlement index and update it
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      // Only update the name in the settlement object
      campaign.settlements[settlementIndex].name = formValues.name

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success('Settlement name updated!')
    }
  }

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
                      onKeyDown={handleKeyDown}
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
