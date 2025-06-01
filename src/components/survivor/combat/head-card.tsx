'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn, getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { HardHatIcon, Shield } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Head Card Component
 *
 * This component displays the survivor's head status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Head Card Component
 */
export function HeadCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
  // Reference to the debounce timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  /**
   * Save a head-related value to localStorage for the current survivor.
   *
   * @param attrName Attribute name
   * @param value New value
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      attrName:
        | 'headArmor'
        | 'headDeaf'
        | 'headBlind'
        | 'headShatteredJaw'
        | 'headIntracranialHemorrhage'
        | 'headHeavyDamage',
      value: number | boolean,
      immediate = false
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
              SurvivorSchema.shape[attrName].parse(value)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            // Use the optimized utility function to save to localStorage
            saveCampaignToLocalStorage({
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id
                  ? {
                      ...s,
                      [attrName]: value
                    }
                  : s
              )
            })

            toast.success('The mind endures what the flesh cannot.')
          }
        } catch (error) {
          console.error('Head Save Error:', error)
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
    <div className="flex flex-row">
      <FormField
        control={form.control}
        name="headArmor"
        render={({ field }) => (
          <FormItem>
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
                  defaultValue={field.value ?? '0'}
                  min={0}
                  onChange={(e) => {
                    let val = parseInt(e.target.value)
                    if (isNaN(val) || val < 0) val = 0
                    form.setValue(field.name, val)
                    saveToLocalStorageDebounced('headArmor', val, true)
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mx-2 w-px bg-border" />

      {/* Body part label and severe injuries in a single row */}
      <div className="flex flex-row items-start w-full">
        <div className="font-bold flex flex-row gap-1 w-[70px]">
          <HardHatIcon /> Head
        </div>
        <div className="flex flex-col items-start gap-1 ml-2">
          {/* Severe Injuries */}
          <FormField
            control={form.control}
            name="headDeaf"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorageDebounced('headDeaf', boolValue, true)
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Deaf</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="headBlind"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-1 items-center">
                    {[...Array(2)].map((_, index) => (
                      <Checkbox
                        key={index}
                        checked={(field.value || 0) > index}
                        onCheckedChange={(checked) => {
                          let newValue = field.value || 0
                          if (checked) newValue = index + 1
                          else if ((field.value || 0) === index + 1)
                            newValue = index
                          form.setValue('headBlind', newValue)
                          saveToLocalStorageDebounced(
                            'headBlind',
                            newValue,
                            true
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <span className="text-xs">Blind</span>
          </div>
          <FormField
            control={form.control}
            name="headShatteredJaw"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorageDebounced(
                        'headShatteredJaw',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Shattered Jaw</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headIntracranialHemorrhage"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorageDebounced(
                        'headIntracranialHemorrhage',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">
                  Intracranial Hemorrhage
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        {/* Heavy Head Damage */}
        <div className="flex flex-col items-center ml-auto">
          <FormField
            control={form.control}
            name="headHeavyDamage"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-col items-center">
                <FormControl>
                  <Checkbox
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !field.value && 'border-2 border-primary',
                      !field.value && 'border-4 border-primary'
                    )}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorageDebounced(
                        'headHeavyDamage',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs mt-1">H</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
