import { CampaignType } from '@/lib/enums'
import { SURVIVOR_SCHEMA } from '@/schemas/survivor'
import { Lock } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import { Checkbox } from '../checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form'
import { Input } from '../input'

export function SurvivalCard(
  form: UseFormReturn<z.infer<typeof SURVIVOR_SCHEMA>>
) {
  const campaignType = form.watch('type')

  return (
    <Card className="mt-4">
      <CardContent className="pt-2 pb-2">
        <div className="flex">
          {/* Left - Survival and cannot spend survival inputs */}
          <div className="flex-1">
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="survival"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder="1"
                          type="number"
                          className="w-12 text-center no-spinners"
                          {...field}
                          value={field.value ?? '1'}
                          onChange={(e) => {
                            form.setValue(field.name, parseInt(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="min-w-20 text-right text-xl">
                        Survival
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <br />

              <div className="-mt-1">
                <FormField
                  control={form.control}
                  name="canSpendSurvival"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={!field.value}
                          onCheckedChange={(checked) => {
                            form.setValue(field.name, !checked)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-medium leading-none">
                        <Lock className="inline h-3 w-3 mr-1" /> Cannot spend
                        survival
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Middle - Survival actions checkboxes */}
          <div className="flex">
            <div className="flex flex-col space-y-2">
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

              {campaignType === CampaignType.ARC ? (
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
              ) : (
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
              )}
            </div>

            {/* Right - (Arc) Systemic pressure */}
            {campaignType === CampaignType.ARC && (
              <>
                <div className="mx-4 w-px bg-border"></div>
                <div className="ml-4">
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
