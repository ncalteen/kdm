'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SurvivorType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { LockIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Survival Card Properties
 */
interface SurvivalCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Survivor Survival Card Component
 *
 * This component displays the survivor's survival points and available survival
 * actions. It includes a survival points counter, a "cannot spend survival"
 * checkbox, and  checkboxes for each available survival action. For Arc
 * survivors, it also shows  the Systemic Pressure attribute and Fist Pump
 * instead of Endure.
 *
 * @param props Survival Card Properties
 * @returns Survival Card Component
 */
export function SurvivalCard({
  form,
  saveSelectedSurvivor,
  selectedSettlement
}: SurvivalCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param field Field name to update
   * @param value New value
   * @param successMsg Optional success message
   */
  const saveToLocalStorage = (
    field: keyof Survivor,
    value: number | boolean,
    successMsg?: string
  ) => saveSelectedSurvivor({ [field]: value }, successMsg)

  /**
   * Update Survival Points
   */
  const updateSurvival = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error('Survival cannot be negative.')

    // Enforce maximum value of survivalLimit
    if (value > (selectedSettlement?.survivalLimit || 0))
      return toast.error(
        `Survival cannot exceed the settlement's limit of ${selectedSettlement?.survivalLimit}.`
      )

    saveToLocalStorage('survival', value, 'Survival updated successfully.')
  }

  /**
   * Update Can Spend Survival Flag
   */
  const updateCanSpendSurvival = (checked: boolean) =>
    saveToLocalStorage(
      'canSpendSurvival',
      !checked,
      !checked
        ? 'The survivor can once again spend survival.'
        : 'The survivor freezes - survival cannot be spent.'
    )

  /**
   * Update Can Dodge Flag
   */
  const updateCanDodge = (checked: boolean) =>
    saveToLocalStorage(
      'canDodge',
      !!checked,
      !!checked
        ? 'The survivor learns to dodge with grace.'
        : 'The survivor loses the ability to dodge.'
    )

  /**
   * Update Can Encourage Flag
   */
  const updateCanEncourage = (checked: boolean) =>
    saveToLocalStorage(
      'canEncourage',
      checked,
      checked
        ? 'The survivor finds their voice to inspire others.'
        : 'The survivor falls silent, unable to encourage.'
    )

  /**
   * Update Can Surge Flag
   */
  const updateCanSurge = (checked: boolean) =>
    saveToLocalStorage(
      'canSurge',
      checked,
      checked
        ? 'The survivor feels a surge of power within.'
        : 'The survivor loses their ability to surge.'
    )

  /**
   * Update Can Dash Flag
   */
  const updateCanDash = (checked: boolean) =>
    saveToLocalStorage(
      'canDash',
      checked,
      checked
        ? 'The survivor gains swift feet to dash ahead.'
        : 'The survivor loses their speed, unable to dash.'
    )

  /**
   * Update Can Fist Pump Flag (Arc-specific)
   */
  const updateCanFistPump = (checked: boolean) =>
    saveToLocalStorage(
      'canFistPump',
      checked,
      checked
        ? 'The survivor raises their fist in triumph.'
        : 'The survivor loses their fighting spirit.'
    )

  /**
   * Update Systemic Pressure (Arc-specific)
   */
  const updateSystemicPressure = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error('Systemic pressure cannot be negative.')

    saveToLocalStorage(
      'systemicPressure',
      value,
      'Systemic pressure updated successfully.'
    )
  }

  /**
   * Update Can Endure Flag
   */
  const updateCanEndure = (checked: boolean) =>
    saveToLocalStorage(
      'canEndure',
      checked,
      checked
        ? 'The survivor finds strength to endure the darkness.'
        : 'The survivor loses their resilience to endure.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex">
          {/* Left - Survival and cannot spend survival inputs */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Survival Points */}
            <FormField
              control={form.control}
              name="survival"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    {/* Survival Input */}
                    <FormControl>
                      <Input
                        placeholder="1"
                        type="number"
                        className={cn(
                          'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl'
                        )}
                        {...field}
                        value={field.value ?? '1'}
                        onChange={(e) => updateSurvival(e.target.value)}
                      />
                    </FormControl>
                    <FormLabel className="font-bold text-left">
                      Survival
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canSpendSurvival"
              render={({ field: canSpendField }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={!canSpendField.value}
                      onCheckedChange={(checked) =>
                        updateCanSpendSurvival(!!checked)
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs font-medium leading-none flex items-center">
                    <LockIcon className="inline h-3 w-3 mr-1" /> Cannot spend
                    survival
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Middle - Survival Actions */}
          <div className="flex">
            <div className="flex flex-col gap-1">
              {/* Dodge */}
              <FormField
                control={form.control}
                name="canDodge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => updateCanDodge(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Dodge</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Encourage */}
              <FormField
                control={form.control}
                name="canEncourage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          updateCanEncourage(!!checked)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Encourage</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Surge */}
              <FormField
                control={form.control}
                name="canSurge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => updateCanSurge(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Surge</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dash */}
              <FormField
                control={form.control}
                name="canDash"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => updateCanDash(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Dash</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional rendering for Arc-specific attributes */}
              {selectedSettlement?.survivorType === SurvivorType.ARC ? (
                <>
                  {/* Fist Pump */}
                  <FormField
                    control={form.control}
                    name="canFistPump"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              updateCanFistPump(!!checked)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-xs">Fist Pump</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  {/* Endure */}
                  <FormField
                    control={form.control}
                    name="canEndure"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              updateCanEndure(!!checked)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-xs">Endure</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {/* Right - (Arc) Systemic pressure */}
            {selectedSettlement?.survivorType === SurvivorType.ARC && (
              <>
                <Separator orientation="vertical" className="mx-2.5" />

                {/* Systemic Pressure */}
                <FormField
                  control={form.control}
                  name="systemicPressure"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) =>
                            updateSystemicPressure(e.target.value)
                          }
                        />
                      </FormControl>
                      <FormLabel className="text-xs">
                        Systemic
                        <br />
                        Pressure
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
