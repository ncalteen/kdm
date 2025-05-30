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
import { SkullIcon, UserXIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Survivor Name, Gender, and Status Card Component
 *
 * This component allows the user to set the name, gender, and status of a survivor.
 * The form includes a text input for the name, checkboxes for male/female gender
 * selection, and checkboxes for dead/retired status. When a survivor is named,
 * they gain +1 survival.
 *
 * @param form Form
 * @returns Name, Gender, and Status Card Component
 */
export function NameGenderCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const dead = form.watch('dead') || false
  const retired = form.watch('retired') || false

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
   * Save survivor status to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param updatedDead Updated dead status
   * @param updatedRetired Updated retired status
   * @param successMsg Success Message
   */
  const saveStatusToLocalStorage = useCallback(
    (updatedDead?: boolean, updatedRetired?: boolean, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          const updatedSurvivor = {
            ...campaign.survivors[survivorIndex],
            ...(updatedDead !== undefined && { dead: updatedDead }),
            ...(updatedRetired !== undefined && { retired: updatedRetired })
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

          campaign.survivors[survivorIndex] = {
            ...campaign.survivors[survivorIndex],
            ...(updatedDead !== undefined && { dead: updatedDead }),
            ...(updatedRetired !== undefined && { retired: updatedRetired })
          }

          localStorage.setItem('campaign', JSON.stringify(campaign))

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error('Survivor Status Save Error:', error)
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
    e: KeyboardEvent<HTMLInputElement>,
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

  /**
   * Handles toggling the dead status
   *
   * @param checked Whether the checkbox is checked
   */
  const handleDeadToggle = useCallback(
    (checked: boolean) => {
      form.setValue('dead', checked, { shouldDirty: true })

      const successMessage = checked
        ? 'The darkness claims another soul. The survivor has fallen.'
        : 'Against all odds, life returns. The survivor lives again.'

      saveStatusToLocalStorage(checked, undefined, successMessage)
    },
    [form, saveStatusToLocalStorage]
  )

  /**
   * Handles toggling the retired status
   *
   * @param checked Whether the checkbox is checked
   */
  const handleRetiredToggle = useCallback(
    (checked: boolean) => {
      form.setValue('retired', checked, { shouldDirty: true })

      const successMessage = checked
        ? 'The survivor steps back from the hunt, seeking peace in the settlement.'
        : 'The call of adventure stirs once more. The survivor returns to active duty.'

      saveStatusToLocalStorage(undefined, checked, successMessage)
    },
    [form, saveStatusToLocalStorage]
  )
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

            {/* Status Section */}
            <div className="ml-4 flex items-center gap-2">
              {/* Dead Status */}
              <FormField
                control={form.control}
                name="dead"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleDeadToggle}
                        className="h-4 w-4 rounded-sm"
                      />
                    </FormControl>
                    <SkullIcon className="h-3 w-3 text-muted-foreground" />
                    <FormLabel className="text-xs font-medium cursor-pointer">
                      Dead
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Retired Status */}
              <FormField
                control={form.control}
                name="retired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleRetiredToggle}
                        className="h-4 w-4 rounded-sm"
                      />
                    </FormControl>
                    <UserXIcon className="h-3 w-3 text-muted-foreground" />
                    <FormLabel className="text-xs font-medium cursor-pointer">
                      Retired
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <hr className="my-1" />

          {/* Status Description */}
          {(dead || retired) && (
            <div className="mb-1">
              <div className="text-xs text-muted-foreground">
                {dead && retired && (
                  <p>
                    The survivor has fallen and will never return to the hunt.
                  </p>
                )}
                {dead && !retired && (
                  <p>The darkness has claimed this soul. They cannot hunt.</p>
                )}
                {!dead && retired && (
                  <p>
                    This survivor has stepped back from active duty but may
                    return if needed.
                  </p>
                )}
              </div>
            </div>
          )}

          <FormDescription className="text-xs">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  )
}
