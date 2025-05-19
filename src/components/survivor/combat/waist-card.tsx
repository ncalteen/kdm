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
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { RibbonIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Waist Card Component
 *
 * This component displays the survivor's waist status. It includes armor
 * points, severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Waist Card Component
 */
export function WaistCard(form: UseFormReturn<Survivor>): ReactElement {
  return (
    <div className="flex flex-row w-full">
      <FormField
        control={form.control}
        name="waistArmor"
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

      <div className="mx-3 w-px bg-border" />

      <div className="flex flex-row items-start w-full">
        <div className="font-bold text-l flex flex-row gap-1 min-w-[70px]">
          <RibbonIcon /> Waist
        </div>
        <div className="flex flex-col items-start gap-0.5 ml-2">
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
                    onCheckedChange={field.onChange}
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
                    onCheckedChange={field.onChange}
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
                    onCheckedChange={field.onChange}
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
                          field.onChange(Math.max(0, Math.min(5, newValue)))
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
