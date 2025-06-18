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
import { RibbonIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Waist Card Properties
 */
interface WaistCardProps extends Partial<Survivor> {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Waist Card Component
 *
 * This component displays the survivor's waist status. It includes armor
 * points, severe injuries, and light/heavy damage.
 *
 * @param props Waist Card Properties
 * @returns Waist Card Component
 */
export function WaistCard({
  form,
  saveSelectedSurvivor
}: WaistCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'waistArmor'
      | 'waistBrokenHip'
      | 'waistIntestinalProlapse'
      | 'waistDestroyedGenitals'
      | 'waistWarpedPelvis'
      | 'waistLightDamage'
      | 'waistHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      'The core withstands the relentless onslaught.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex flex-row">
          <FormField
            control={form.control}
            name="waistArmor"
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
                          'waistArmor',
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
              <RibbonIcon /> Waist
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('waistBrokenHip', !!checked)
                        }
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage(
                            'waistIntestinalProlapse',
                            !!checked
                          )
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs">
                      Intestinal Prolapse
                    </FormLabel>
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage(
                            'waistDestroyedGenitals',
                            !!checked
                          )
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs">
                      Destroyed Genitals
                    </FormLabel>
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
                              const safeValue = Math.max(
                                0,
                                Math.min(5, newValue)
                              )

                              saveToLocalStorage('waistWarpedPelvis', safeValue)
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('waistLightDamage', !!checked)
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
                        onCheckedChange={(checked) =>
                          saveToLocalStorage('waistHeavyDamage', !!checked)
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
