'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Gender } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Survivor Name and Gender Card Component
 *
 * This component allows the user to set the name and gender of a survivor. The
 * form includes a text input for the name and checkboxes for male/female gender
 * selection. When a survivor is named, they gain +1 survival.
 *
 * @param form Form
 * @returns Name and Gender Card Component
 */
export function NameGenderCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  /**
   * Save name to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param name Survivor Name
   * @param successMsg Success Message
   */
  const saveNameToLocalStorage = useCallback(
    (name: string, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          const updatedSurvivor = {
            ...campaign.survivors[survivorIndex],
            name
          }

          try {
            SurvivorSchema.parse(updatedSurvivor)
          } catch (error) {
            if (error instanceof ZodError && error.errors[0]?.message)
              return toast.error(error.errors[0].message)
            else
              return toast.error(
                'The darkness swallows your words. Please try again.'
              )
          }

          campaign.survivors[survivorIndex].name = name
          localStorage.setItem('campaign', JSON.stringify(campaign))

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error('Name Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Save gender to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param gender Survivor Gender
   * @param successMsg Success Message
   */
  const saveGenderToLocalStorage = useCallback(
    (gender: Gender, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          const updatedSurvivor = {
            ...campaign.survivors[survivorIndex],
            gender
          }

          try {
            SurvivorSchema.parse(updatedSurvivor)
          } catch (error) {
            if (error instanceof ZodError && error.errors[0]?.message)
              return toast.error(error.errors[0].message)
            else
              return toast.error(
                'The darkness swallows your words. Please try again.'
              )
          }

          campaign.survivors[survivorIndex].gender = gender
          localStorage.setItem('campaign', JSON.stringify(campaign))

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error('Gender Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Handles name input changes - saves on Enter key press.
   *
   * @param e Keyboard Event
   * @param value Current Input Value
   */
  const handleNameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveNameToLocalStorage(
        value,
        value.trim()
          ? "The survivor's name echoes through the lantern light."
          : undefined
      )
    }
  }

  /**
   * Handles gender selection changes - saves immediately.
   *
   * @param gender Selected Gender
   */
  const handleGenderChange = (gender: Gender) => {
    form.setValue('gender', gender)
    saveGenderToLocalStorage(
      gender,
      "The survivor's essence is recorded in the lantern's glow."
    )
  }
  return (
    <Card className="p-0 pb-1 border-0">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center">
            {/* Survivor Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center gap-2">
                    <FormLabel className="font-bold text-left">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Survivor name..."
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          form.setValue(field.name, e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleNameKeyDown(e, field.value ?? '')
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="ml-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-1">
                      <label htmlFor="male-checkbox" className="text-sm">
                        M
                      </label>
                      <Checkbox
                        id="male-checkbox"
                        checked={field.value === Gender.MALE}
                        onCheckedChange={(checked) => {
                          if (checked) handleGenderChange(Gender.MALE)
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <label htmlFor="female-checkbox" className="text-sm">
                        F
                      </label>
                      <Checkbox
                        id="female-checkbox"
                        checked={field.value === Gender.FEMALE}
                        onCheckedChange={(checked) => {
                          if (checked) handleGenderChange(Gender.FEMALE)
                        }}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="my-1" />

          <FormDescription className="text-xs">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  )
}
