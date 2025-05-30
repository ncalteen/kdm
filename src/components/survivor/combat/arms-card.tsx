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
import { HandMetalIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Arms Card Component
 *
 * This component displays the survivor's arms status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Arms Card Component
 */
export function ArmsCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
  /**
   * Save an arms-related value to localStorage for the current survivor.
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'armArmor'
      | 'armBroken'
      | 'armContracture'
      | 'armDismembered'
      | 'armRupturedMuscle'
      | 'armLightDamage'
      | 'armHeavyDamage',
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
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        // @ts-expect-error: dynamic assignment is safe for known keys
        campaign.survivors[survivorIndex][attrName] = value
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Arms endure another battle.')
      }
    } catch (error) {
      console.error('Arms Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <div className="flex flex-row">
      <FormField
        control={form.control}
        name="armArmor"
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
                    saveToLocalStorage('armArmor', val)
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
          <HandMetalIcon /> Arms
        </div>
        <div className="flex flex-col items-start gap-1 ml-2">
          {/* Severe Injuries */}
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="armBroken"
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
                          form.setValue('armBroken', newValue)
                          saveToLocalStorage('armBroken', newValue)
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <span className="text-xs">Broken Arm</span>
          </div>
          <FormField
            control={form.control}
            name="armRupturedMuscle"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const boolValue = checked === true
                      field.onChange(boolValue)
                      saveToLocalStorage('armRupturedMuscle', boolValue)
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs">Ruptured Muscle</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="armDismembered"
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
                          form.setValue('armDismembered', newValue)
                          saveToLocalStorage('armDismembered', newValue)
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <span className="text-xs">Dismembered Arm</span>
          </div>
          <FormField
            control={form.control}
            name="armContracture"
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
                          saveToLocalStorage('armContracture', safeValue)
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormLabel className="text-xs">Contracture</FormLabel>
              </FormItem>
            )}
          />
        </div>
        {/* Light and Heavy Damage */}
        <div className="flex flex-row gap-2 ml-auto">
          {/* Light Damage */}
          <FormField
            control={form.control}
            name="armLightDamage"
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
                      saveToLocalStorage('armLightDamage', boolValue)
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
            name="armHeavyDamage"
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
                      saveToLocalStorage('armHeavyDamage', boolValue)
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
