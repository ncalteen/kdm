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
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { HandMetalIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Arms Card Properties
 */
interface ArmsCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Arms Card Component
 *
 * This component displays the survivor's arms status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param props Arms Card Properties
 * @returns Arms Card Component
 */
export function ArmsCard({
  form,
  saveSelectedSurvivor
}: ArmsCardProps): ReactElement {
  /**
   * Save to Local Storage
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
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      'Arms endure another battle.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
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
                      className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners"
                      defaultValue={field.value ?? '0'}
                      min={0}
                      onChange={(e) =>
                        saveToLocalStorage('armArmor', parseInt(e.target.value))
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('armRupturedMuscle', !!checked)
                        }
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
                              const safeValue = Math.max(
                                0,
                                Math.min(5, newValue)
                              )

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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('armLightDamage', !!checked)
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('armHeavyDamage', !!checked)
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
