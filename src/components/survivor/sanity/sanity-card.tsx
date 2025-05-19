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
import { getSettlement } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { Shield } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

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

  // Set the survivor type when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)
  }, [form])

  return (
    <Card className="m-0 mt-1 border-2">
      <CardContent className="p-2">
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
                        className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-center p-0 bg-transparent border-none no-spinners"
                        {...field}
                        value={field.value ?? '0'}
                        onChange={(e) => {
                          form.setValue(field.name, parseInt(e.target.value))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormLabel className="text-xs">Insanity</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="mx-2.5 w-px bg-border" />

          {/* Brain */}
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="font-bold text-l">Brain</div>
            <div className="absolute top-0 right-0 flex items-center">
              <FormField
                control={form.control}
                name="brainLightDamage"
                render={({ field }) => (
                  <FormItem className="space-y-0 flex flex-col items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-xs mt-1">L</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="text-xs mt-auto">
              If your insanity is 3+, you are <strong>insane</strong>.
            </div>
          </div>

          {/* Torment (Arc) */}
          {survivorType === SurvivorType.ARC && (
            <>
              <div className="mx-2.5 w-px bg-border" />

              <FormField
                control={form.control}
                name="torment"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 text-center no-spinners"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => {
                            form.setValue(field.name, parseInt(e.target.value))
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
