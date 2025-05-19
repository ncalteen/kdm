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
import { cn, getSettlement } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { Lock } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

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
                            form.setValue(field.name, parseInt(e.target.value))
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
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-1">
                          <FormControl>
                            <Checkbox
                              checked={!canSpendField.value}
                              onCheckedChange={(checked) => {
                                form.setValue(canSpendField.name, !checked)
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
            <div className="flex flex-col space-y-1 mb-0">
              {/* Dodge */}
              <FormField
                control={form.control}
                name="canDodge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue(field.name, !!checked)
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue(field.name, !!checked)
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue(field.name, !!checked)
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue(field.name, !!checked)
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
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              form.setValue(field.name, !!checked)
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
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              form.setValue(field.name, !!checked)
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
                              form.setValue(
                                field.name,
                                parseInt(e.target.value)
                              )
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
