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
import { RibbonIcon, Shield } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Waist Card Component
 *
 * This component displays the survivor's waist status. It includes armor
 * points, severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Waist Card Component
 */
export function WaistCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
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
   * Save a waist-related value to localStorage for the current survivor.
   *
   * @param attrName Attribute name
   * @param value New value
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      attrName:
        | 'waistArmor'
        | 'waistBrokenHip'
        | 'waistIntestinalProlapse'
        | 'waistDestroyedGenitals'
        | 'waistWarpedPelvis'
        | 'waistLightDamage'
        | 'waistHeavyDamage',
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

            toast.success('The core withstands the relentless onslaught.')
          }
        } catch (error) {
          console.error('Waist Save Error:', error)
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
        name="waistArmor"
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
                    saveToLocalStorageDebounced('waistArmor', val, true)
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mx-2 w-px bg-border" />

      <div className="flex flex-row items-start w-full">
        <div className="font-bold flex flex-row gap-1 w-[70px]">
          <RibbonIcon /> Waist
        </div>
        <div className="flex flex-col items-start gap-1 ml-2">
          {/* Severe Injuries */}
          <FormField
            control={form.control}
            name="waistBrokenHip"
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
                        'waistBrokenHip',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Broken Hip</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waistIntestinalProlapse"
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
                        'waistIntestinalProlapse',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Intestinal Prolapse</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waistDestroyedGenitals"
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
                        'waistDestroyedGenitals',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Destroyed Genitals</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waistWarpedPelvis"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <div className="flex flex-row gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Checkbox
                        key={value}
                        className="h-4 w-4 rounded-sm"
                        checked={field.value >= value}
                        onCheckedChange={(checked) => {
                          const newValue = checked ? value : value - 1
                          const safeValue = Math.max(0, Math.min(5, newValue))
                          field.onChange(safeValue)
                          saveToLocalStorageDebounced(
                            'waistWarpedPelvis',
                            safeValue,
                            true
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormLabel className="text-xs">Warped Pelvis</FormLabel>
              </FormItem>
            )}
          />
        </div>
        {/* Light and Heavy Damage */}
        <div className="flex flex-row gap-2 ml-auto">
          {/* Light Damage */}
          <FormField
            control={form.control}
            name="waistLightDamage"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-col items-center">
                <FormControl>
                  <Checkbox
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !field.value && 'border-2 border-primary',
                      !field.value && 'border-2 border-primary'
                    )}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorageDebounced(
                        'waistLightDamage',
                        boolValue,
                        true
                      )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs mt-1">L</FormLabel>
              </FormItem>
            )}
          />
          {/* Heavy Damage */}
          <FormField
            control={form.control}
            name="waistHeavyDamage"
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
                        'waistHeavyDamage',
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
