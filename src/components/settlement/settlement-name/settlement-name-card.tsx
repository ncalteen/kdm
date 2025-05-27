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
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Settlement Name Card Component
 *
 * This component allows the user to set the name of a settlement.
 * When the settlement is named for the first time, returning survivors
 * gain +1 survival.
 *
 * @param form Settlement form instance
 * @returns Settlement Name Card Component
 */
export function SettlementNameCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  /**
   * Save settlement name to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param name Updated Settlement Name
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (name: string, successMsg?: string) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          name: name
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].name = name
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Settlement Name Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles Key Down Events
   *
   * This function is triggered when a key is pressed while the input field is
   * focused. If the Enter key is pressed, it prevents the default behavior and
   * saves the settlement name or triggers form submission.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const inputValue = e.currentTarget.value?.trim()

      if (!inputValue)
        return toast.error('A nameless settlement cannot be recorded.')

      try {
        SettlementSchema.shape.name.parse(inputValue)
      } catch (error) {
        if (error instanceof ZodError)
          return toast.error(error.errors[0].message)
        else
          return toast.error(
            'The darkness swallows your words. Please try again.'
          )
      }

      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        // Update the form value
        form.setValue('name', inputValue)

        // If settlement already exists, save the name
        if (settlementIndex !== -1) {
          saveToLocalStorage(
            inputValue,
            "The settlement's name echoes through the darkness."
          )
        } else {
          // This will trigger the parent form's onSubmit handler
          const formElement = e.currentTarget.closest('form')
          if (formElement) formElement.requestSubmit()
        }
      } catch (error) {
        console.error('Settlement Name Error:', error)
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
                  {/* Title */}
                  <FormLabel className="text-left pr-4">Settlement</FormLabel>

                  {/* Settlement Name Input */}
                  <FormControl>
                    <Input
                      placeholder="Settlement Name"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        form.setValue(field.name, e.target.value)
                      }
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
