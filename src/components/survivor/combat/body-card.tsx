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
import { useSurvivorSave } from '@/hooks/use-survivor-save'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { Shield, ShirtIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Body Card Component
 *
 * This component displays the survivor's body status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Body Card Component
 */
export function BodyCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
  const { saveSurvivor } = useSurvivorSave(form)

  /**
   * Save to Local Storage
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
  ) =>
    saveSurvivor(
      {
        [attrName]: value
      },
      'The body persists through torment and pain.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex flex-row">
          <FormField
            control={form.control}
            name="bodyArmor"
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
                      className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners"
                      defaultValue={field.value ?? '0'}
                      min={0}
                      onChange={(e) =>
                        saveToLocalStorage(
                          'bodyArmor',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mx-2 w-px bg-border h-[80px]" />

          <div className="flex flex-row items-start w-full">
            <div className="font-bold flex flex-row gap-1 w-[70px]">
              <ShirtIcon /> Body
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage(
                            'bodyDestroyedBack',
                            checked === true
                          )
                        }
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
                              const safeValue = Math.max(
                                0,
                                Math.min(5, newValue)
                              )

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
                              const safeValue = Math.max(
                                0,
                                Math.min(5, newValue)
                              )

                              saveToLocalStorage(
                                'bodyGapingChestWound',
                                safeValue
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormLabel className="text-xs">
                      Gaping Chest Wound
                    </FormLabel>
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage(
                            'bodyLightDamage',
                            checked === true
                          )
                        }
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage(
                            'bodyHeavyDamage',
                            checked === true
                          )
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs mt-1">H</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
