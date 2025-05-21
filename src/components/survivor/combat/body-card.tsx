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
import { cn, getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { Shield, ShirtIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Body Card Component
 *
 * This component displays the survivor's body status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Arms Card Component
 */
export function BodyCard(form: UseFormReturn<Survivor>): ReactElement {
  /**
   * Save a body-related value to localStorage for the current survivor.
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'bodyArmor'
      | 'bodyDestroyedBack'
      | 'bodyBrokenRib'
      | 'bodyGapingChestWound'
      | 'bodyLightDamage'
      | 'bodyHeavyDamage',
    value: number | boolean
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
          [attrName]: value
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            toast.error(error.errors[0].message)
          else
            toast.error('The darkness swallows your words. Please try again.')

          return
        }
        // @ts-expect-error: dynamic assignment is safe for known keys
        campaign.survivors[survivorIndex][attrName] = value
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Body status updated!')
      }
    } catch (error) {
      console.error('Body Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <div className="flex flex-row w-full">
      <FormField
        control={form.control}
        name="bodyArmor"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col items-center gap-2">
              <FormControl>
                <div className="relative flex items-center">
                  <Shield
                    className="h-14 w-14 text-muted-foreground"
                    strokeWidth={1}
                  />
                  <Input
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-center p-0 bg-transparent border-none no-spinners"
                    defaultValue={field.value ?? '0'}
                    min={0}
                    onChange={(e) => {
                      let val = parseInt(e.target.value)
                      if (isNaN(val) || val < 0) val = 0
                      form.setValue(field.name, val)
                      saveToLocalStorage('bodyArmor', val)
                    }}
                  />
                </div>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mx-3 w-px bg-border" />
      <div className="flex flex-row items-start w-full">
        <div className="font-bold text-l flex flex-row gap-1 min-w-[70px]">
          <ShirtIcon /> Body
        </div>
        <div className="flex flex-col items-start gap-0.5 ml-2">
          {/* Severe Injuries */}
          <FormField
            control={form.control}
            name="bodyDestroyedBack"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorage('bodyDestroyedBack', boolValue)
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Destroyed Back</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bodyBrokenRib"
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
                          saveToLocalStorage('bodyBrokenRib', safeValue)
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormLabel className="text-xs">Broken Rib</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bodyGapingChestWound"
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
                          saveToLocalStorage('bodyGapingChestWound', safeValue)
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormLabel className="text-xs">Gaping Chest Wound</FormLabel>
              </FormItem>
            )}
          />
        </div>
        {/* Light and Heavy Damage */}
        <div className="flex flex-row gap-2 ml-auto">
          {/* Light Damage */}
          <FormField
            control={form.control}
            name="bodyLightDamage"
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
                      saveToLocalStorage('bodyLightDamage', boolValue)
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
            name="bodyHeavyDamage"
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
                      saveToLocalStorage('bodyHeavyDamage', boolValue)
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
