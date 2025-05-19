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
import { Shield, UserRoundIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Head Card Component
 *
 * This component displays the survivor's head status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Head Card Component
 */
export function HeadCard(form: UseFormReturn<Survivor>) {
  return (
    <div className="flex flex-row w-full">
      <FormField
        control={form.control}
        name="headArmor"
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

      {/* Body part label and severe injuries in a single row */}
      <div className="flex flex-row items-start w-full">
        <div className="font-bold text-l flex flex-row gap-1 min-w-[70px]">
          <UserRoundIcon /> Head
        </div>
        <div className="flex flex-col items-start gap-0.5 ml-2">
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
                    onCheckedChange={field.onChange}
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
                          if (checked) form.setValue('headBlind', index + 1)
                          else if ((field.value || 0) === index + 1)
                            form.setValue('headBlind', index)
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
                    onCheckedChange={field.onChange}
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
                    onCheckedChange={field.onChange}
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
