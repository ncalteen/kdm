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
import { SurvivorType } from '@/lib/enums'
import { cn, getSettlement } from '@/lib/utils'
import { SurvivorSchema } from '@/schemas/survivor'
import { FootprintsIcon, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Legs Card Component
 *
 * This component displays the survivor's legs status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Legs Card Component
 */
export function LegsCard(form: UseFormReturn<z.infer<typeof SurvivorSchema>>) {
  // Get the survivor type from the settlement data.
  const [survivorType, setSurvivorType] = useState<SurvivorType | undefined>(
    undefined
  )

  // Set the survivor type when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)
  }, [form])

  return (
    <div className="flex flex-row w-full">
      <FormField
        control={form.control}
        name="legArmor"
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
                    {...field}
                    value={field.value ?? '0'}
                    onChange={(e) => {
                      form.setValue(field.name, parseInt(e.target.value))
                    }}
                  />
                </div>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mx-4 w-px bg-border" />

      <div className="flex flex-row justify-between w-full">
        <div className="font-bold text-l flex flex-row gap-2">
          <FootprintsIcon /> Legs
        </div>

        {/* Severe Injuries */}
        <div className="flex flex-col items-left gap-1">
          {/* Dismembered */}
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="legDismemberedLeft"
              render={({ field }) => (
                <FormItem className="space-y-0 flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      className="h-4 w-4 rounded-sm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legDismemberedRight"
              render={({ field }) => (
                <FormItem className="space-y-0 flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      className="h-4 w-4 rounded-sm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-xs">Dismembered Leg</span>
          </div>

          {/* Hamstrung */}
          <FormField
            control={form.control}
            name="legHamstrung"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-xs">Hamstrung</FormLabel>
              </FormItem>
            )}
          />

          {/* Broken */}
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="legBrokenLeft"
              render={({ field }) => (
                <FormItem className="space-y-0 flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      className="h-4 w-4 rounded-sm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legBrokenRight"
              render={({ field }) => (
                <FormItem className="space-y-0 flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      className="h-4 w-4 rounded-sm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-xs">Broken Leg</span>
          </div>
        </div>

        {/* Light and Heavy Damage */}
        <div className="flex flex-row gap-2">
          {/* Light Damage */}
          <FormField
            control={form.control}
            name="legLightDamage"
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
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-xs mt-1">L</FormLabel>
              </FormItem>
            )}
          />

          {/* Heavy Damage */}
          <FormField
            control={form.control}
            name="legHeavyDamage"
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
                    onCheckedChange={field.onChange}
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
