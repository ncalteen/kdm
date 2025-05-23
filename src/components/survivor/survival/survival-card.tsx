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
import { SurvivorType } from '@/lib/enums'
import { cn, getCampaign, getSettlement } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { Lock } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Survivor Survival Card Component
 *
 * This component displays the survivor's survival points and available survival
 * actions. It includes a survival points counter, a "cannot spend survival"
 * checkbox, and  checkboxes for each available survival action. For Arc
 * survivors, it also shows  the Systemic Pressure attribute and Fist Pump
 * instead of Endure.
 *
 * @param form Form
 * @returns Survival Card Component
 */
export function SurvivalCard(form: UseFormReturn<Survivor>): ReactElement {
  // Get the survivor type and survival limit from the settlement data.
  const [survivorType, setSurvivorType] = useState<SurvivorType | undefined>(
    undefined
  )
  const [survivalLimit, setSurvivalLimit] = useState<number>(1)

  // Set the survivor type and survival limit when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)
    setSurvivalLimit(settlement?.survivalLimit || 1)
  }, [form])

  /**
   * Save survival data to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param field Field name to update
   * @param value New value
   * @param successMsg Optional success message
   */
  const saveToLocalStorage = (
    field: keyof Survivor,
    value: number | boolean,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          [field]: value
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
          [field]: value
        }
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Survival Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <Card className="m-0 mt-2 border-2">
      <CardContent className="p-2">
        <div className="flex">
          {/* Left - Survival and cannot spend survival inputs */}
          <div className="flex-1">
            <div className="flex flex-col">
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
                            'w-16 h-16 text-center md:text-3xl no-spinners'
                          )}
                          {...field}
                          value={field.value ?? '1'}
                          onChange={(e) => {
                            let value = parseInt(e.target.value) || 0

                            // Enforce minimum value of 0
                            if (value < 0) {
                              value = 0
                              toast.error('Survival cannot be negative..')
                            }

                            // Enforce maximum value of survivalLimit
                            if (value > survivalLimit) {
                              value = survivalLimit
                              toast.error(
                                `Survival cannot exceed the settlement's limit of ${survivalLimit}.`
                              )
                            }

                            form.setValue(field.name, value)
                            saveToLocalStorage('survival', value)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="min-w-20 font-bold text-left text-l">
                        Survival
                      </FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="canSpendSurvival"
                      render={({ field: canSpendField }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0 mt-1">
                          <FormControl>
                            <Checkbox
                              checked={!canSpendField.value}
                              onCheckedChange={(checked) => {
                                const canSpend = !checked
                                form.setValue(canSpendField.name, canSpend)
                                saveToLocalStorage(
                                  'canSpendSurvival',
                                  canSpend,
                                  canSpend
                                    ? 'The survivor can once again spend their precious survival.'
                                    : 'The survivor freezes - survival cannot be spent.'
                                )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-medium leading-none flex items-center">
                            <Lock className="inline h-3 w-3 mr-1" /> Cannot
                            spend survival
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Middle - Survival Actions */}
          <div className="flex">
            <div className="flex flex-col gap-1 mb-0">
              {/* Dodge */}
              <FormField
                control={form.control}
                name="canDodge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const canDodge = !!checked
                          form.setValue(field.name, canDodge)
                          saveToLocalStorage(
                            'canDodge',
                            canDodge,
                            canDodge
                              ? 'The survivor learns to dodge with grace.'
                              : 'The survivor loses the ability to dodge.'
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium leading-none">
                      Dodge
                    </FormLabel>
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
                        onCheckedChange={(checked) => {
                          const canEncourage = !!checked
                          form.setValue(field.name, canEncourage)
                          saveToLocalStorage(
                            'canEncourage',
                            canEncourage,
                            canEncourage
                              ? 'The survivor finds their voice to inspire others.'
                              : 'The survivor falls silent, unable to encourage.'
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium leading-none">
                      Encourage
                    </FormLabel>
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
                        onCheckedChange={(checked) => {
                          const canSurge = !!checked
                          form.setValue(field.name, canSurge)
                          saveToLocalStorage(
                            'canSurge',
                            canSurge,
                            canSurge
                              ? 'The survivor feels a surge of power within.'
                              : 'The survivor loses their ability to surge.'
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium leading-none">
                      Surge
                    </FormLabel>
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
                        onCheckedChange={(checked) => {
                          const canDash = !!checked
                          form.setValue(field.name, canDash)
                          saveToLocalStorage(
                            'canDash',
                            canDash,
                            canDash
                              ? 'The survivor gains swift feet to dash ahead.'
                              : 'The survivor loses their speed, unable to dash.'
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium leading-none">
                      Dash
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional rendering for Arc-specific attributes */}
              {survivorType === SurvivorType.ARC ? (
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
                            onCheckedChange={(checked) => {
                              const canFistPump = !!checked
                              form.setValue(field.name, canFistPump)
                              saveToLocalStorage(
                                'canFistPump',
                                canFistPump,
                                canFistPump
                                  ? 'The survivor raises their fist in triumph.'
                                  : 'The survivor loses their fighting spirit.'
                              )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-medium leading-none">
                          Fist Pump
                        </FormLabel>
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
                            onCheckedChange={(checked) => {
                              const canEndure = !!checked
                              form.setValue(field.name, canEndure)
                              saveToLocalStorage(
                                'canEndure',
                                canEndure,
                                canEndure
                                  ? 'The survivor finds strength to endure the darkness.'
                                  : 'The survivor loses their resilience to endure.'
                              )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-medium leading-none">
                          Endure
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {/* Right - (Arc) Systemic pressure */}
            {survivorType === SurvivorType.ARC && (
              <>
                <div className="mx-2.5 w-px bg-border" />

                <div className="ml-0">
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
                            className="w-12 text-center no-spinners"
                            {...field}
                            value={field.value ?? '0'}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0
                              form.setValue(field.name, value)
                              saveToLocalStorage('systemicPressure', value)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="mt-1 text-xs font-medium">
                          Systemic
                          <br />
                          Pressure
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
