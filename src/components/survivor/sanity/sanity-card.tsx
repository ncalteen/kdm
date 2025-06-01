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
import {
  getCampaign,
  getSettlement,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { BrainIcon, Shield } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Survivor Sanity Card Component
 *
 * This component displays the survivor's insanity level and brain state. It
 * includes an insanity counter and a checkbox for light brain damage. For Arc
 * survivors, it also shows the Torment attribute.
 *
 * @param form Form
 * @returns Sanity Card Component
 */
export function SanityCard(form: UseFormReturn<Survivor>): ReactElement {
  // Get the survivor type from the settlement data.
  const [survivorType, setSurvivorType] = useState<SurvivorType | undefined>(
    undefined
  )

  // Create a ref for the timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set the survivor type when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)

    // Cleanup function for timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [form])

  /**
   * Save sanity data to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param field Field name to update
   * @param value New value
   * @param successMsg Optional success message
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      field: keyof Survivor,
      value: number | boolean,
      successMsg?: string,
      immediate: boolean = false
    ) => {
      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (survivorIndex !== -1) {
            try {
              SurvivorSchema.shape[field].parse(value)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            // Save to localStorage using the optimized utility
            saveCampaignToLocalStorage({
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id ? { ...s, [field]: value } : s
              )
            })

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Sanity Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        saveFunction()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(saveFunction, 300)
      }
    },
    [form]
  )

  return (
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardContent className="p-2 pl-1">
        <div className="flex">
          {/* Insanity */}
          <FormField
            control={form.control}
            name="insanity"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center">
                  <FormControl>
                    <div className="relative flex items-center">
                      <Shield
                        className="h-14 w-14 text-muted-foreground"
                        strokeWidth={1}
                      />
                      <Input
                        placeholder="1"
                        type="number"
                        className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-2xl sm:text-2xl md:text-2xl text-center p-0 bg-transparent border-none no-spinners"
                        {...field}
                        value={field.value ?? '0'}
                        onChange={(e) => {
                          let value = parseInt(e.target.value) || 0

                          // Enforce minimum value of 0
                          if (value < 0) {
                            value = 0
                            toast.error('Insanity cannot be negative..')
                          }

                          form.setValue(field.name, value)
                          saveToLocalStorageDebounced('insanity', value)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormLabel className="text-xs">Insanity</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="mx-2 w-px bg-border" />

          {/* Brain */}
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="font-bold flex gap-1 items-center">
              <BrainIcon />
              Brain
            </div>
            <div className="absolute top-0 right-0 flex items-center">
              <FormField
                control={form.control}
                name="brainLightDamage"
                render={({ field }) => (
                  <FormItem className="space-y-0 flex flex-col items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const brainLightDamage = !!checked
                          field.onChange(brainLightDamage)
                          saveToLocalStorageDebounced(
                            'brainLightDamage',
                            brainLightDamage,
                            brainLightDamage
                              ? 'The survivor suffers brain damage from the horrors witnessed.'
                              : 'The survivor recovers from their brain injury.',
                            true
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs mt-1">L</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="text-xs mt-auto text-muted-foreground">
              If your insanity is 3+, you are <strong>insane</strong>.
            </div>
          </div>

          {/* Torment (Arc) */}
          {survivorType === SurvivorType.ARC && (
            <>
              <div className="mx-2 w-px bg-border" />

              <FormField
                control={form.control}
                name="torment"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => {
                            let value = parseInt(e.target.value) || 0

                            // Enforce minimum value of 0
                            if (value < 0) {
                              value = 0
                              toast.error('Torment cannot be negative.')
                            }

                            form.setValue(field.name, value)
                            saveToLocalStorageDebounced('torment', value)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Torment</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
