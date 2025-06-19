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
import { Survivor } from '@/schemas/survivor'
import { SkullIcon, UserXIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Status Card Props
 */
interface StatusCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Survivor Name, Gender, and Status Card Component
 *
 * This component allows the user to set the name, gender, and status of a survivor.
 * The form includes a text input for the name, checkboxes for male/female gender
 * selection, and checkboxes for dead/retired status. When a survivor is named,
 * they gain +1 survival.
 *
 * @param props Status Card Properties
 * @returns Status Card Component
 */
export function StatusCard({
  form,
  saveSelectedSurvivor
}: StatusCardProps): ReactElement {
  /**
   * Save Status to Local Storage
   *
   * @param updatedDead Updated dead status
   * @param updatedRetired Updated retired status
   * @param successMsg Success Message
   */
  const saveStatusToLocalStorage = useCallback(
    (updatedDead?: boolean, updatedRetired?: boolean, successMsg?: string) => {
      const updateData: Partial<Survivor> = {}

      if (updatedDead !== undefined) updateData.dead = updatedDead
      if (updatedRetired !== undefined) updateData.retired = updatedRetired

      saveSelectedSurvivor(updateData, successMsg)
    },
    [saveSelectedSurvivor]
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
      saveSelectedSurvivor(
        { name: value },
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
  const handleGenderChange = (gender: Gender) =>
    saveSelectedSurvivor(
      { gender },
      "The survivor's essence is recorded in the lantern's glow."
    )

  /**
   * Handles toggling the dead status
   *
   * @param checked Whether the checkbox is checked
   */
  const handleDeadToggle = useCallback(
    (checked: boolean) => {
      saveStatusToLocalStorage(
        checked,
        undefined,
        checked
          ? 'The darkness claims another soul. The survivor has fallen.'
          : 'Against all odds, life returns. The survivor lives again.'
      )
    },
    [saveStatusToLocalStorage]
  )

  /**
   * Handles toggling the retired status
   *
   * @param checked Whether the checkbox is checked
   */
  const handleRetiredToggle = useCallback(
    (checked: boolean) => {
      saveStatusToLocalStorage(
        undefined,
        checked,
        checked
          ? 'The survivor retires from the hunt, seeking peace in the settlement.'
          : 'The call of adventure stirs once more. The survivor returns from retirement.'
      )
    },
    [saveStatusToLocalStorage]
  )

  return (
    <Card className="p-2 border-0 lg:h-[85px]">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center h-[36px]">
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
                      <label htmlFor="male-checkbox" className="text-xs">
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
                      <label htmlFor="female-checkbox" className="text-xs">
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
        </div>

        <hr className="my-2" />

        {/* Status Section */}
        <div className="flex justify-between items-center">
          <FormDescription className="text-xs">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </FormDescription>

          <div className="flex items-center gap-2">
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
                  <FormLabel className="text-xs text-muted-foreground cursor-pointer">
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
                  <FormLabel className="text-xs text-muted-foreground cursor-pointer">
                    Retired
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
