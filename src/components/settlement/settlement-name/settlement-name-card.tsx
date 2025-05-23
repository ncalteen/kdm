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
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Settlement Name Card Component
 *
 * This component allows the user to set the name of a settlement.
 */
export function SettlementNameCard(form: UseFormReturn<Settlement>) {
  /**
   * Handles Key Down Events
   *
   * This function is triggered when a key is pressed while the input field is
   * focused. If the Enter key is pressed, it prevents the default behavior and
   * checks if the settlement already exists. If it does, it updates the name of
   * the existing settlement. If it doesn't, it triggers the form submission.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        // If settlement already exists, update its name
        if (settlementIndex !== -1) {
          campaign.settlements[settlementIndex].name = formValues.name
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success("The settlement's name echoes through the darkness.")
        } else {
          // This will trigger the parent form's onSubmit handler
          const formElement = e.currentTarget.closest('form')
          if (formElement) formElement.requestSubmit()
        }
      } catch (error) {
        console.error('Settlment Name Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
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
                  <FormLabel className="text-left pr-2">Settlement</FormLabel>
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
