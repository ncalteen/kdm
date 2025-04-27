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
  const isArcCampaign = campaignType === CampaignType.ARC

  return (
    <Card className="mt-4">
      <CardContent className="pt-2 pb-2">
        <div className="flex">
          {/* Left side - Survival input and canSpendSurvival */}
          <div className="flex-1">
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="survival"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Input
                          placeholder="1"
                          type="number"
                          className="w-16 text-center"
                          {...field}
                          value={field.value ?? '1'}
                          onChange={(e) => {
                            form.setValue(field.name, parseInt(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="min-w-24 text-right text-2xl">
                        Survival
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <br />

              <div className="ml-20 -mt-1">
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

              {isArcCampaign && (
                <FormField
                  control={form.control}
                  name="systemicPressure"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Input
                            placeholder="0"
                            type="number"
                            className="w-16 text-center"
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
                        <FormLabel className="text-sm font-medium">
                          Systemic Pressure
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Right side - Survival actions checkboxes */}
          <div className="ml-6 flex flex-col space-y-2">
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
                  <FormLabel className="text-sm font-medium leading-none">
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
                  <FormLabel className="text-sm font-medium leading-none">
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
                  <FormLabel className="text-sm font-medium leading-none">
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
                  <FormLabel className="text-sm font-medium leading-none">
                    Dash
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isArcCampaign ? (
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
                    <FormLabel className="text-sm font-medium leading-none">
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
                    <FormLabel className="text-sm font-medium leading-none">
                      Endure
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
