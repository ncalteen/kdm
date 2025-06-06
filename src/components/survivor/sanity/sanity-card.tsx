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
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BrainIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Sanity Card Props
 */
interface SanityCardProps {
  /** Survivor form instance */
  form: UseFormReturn<Survivor>
  /** Current settlement */
  settlement: Settlement
  /** Function to save survivor data */
  saveSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

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
export function SanityCard({
  form,
  settlement,
  saveSurvivor
}: SanityCardProps): ReactElement {
  /**
   * Save sanity data to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param field Field name to update
   * @param value New value
   * @param successMsg Optional success message
   */
  const saveToLocalStorage = (
    field: keyof Survivor,
    value: number | boolean,
    successMsg?: string
  ) =>
    saveSurvivor(
      {
        [field]: value
      },
      successMsg
    )

  /**
   * Update Insanity
   */
  const updateInsanity = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error('Insanity cannot be negative..')
    }

    saveToLocalStorage('insanity', value, 'Insanity level updated.')
  }

  /**
   * Update Brain Light Damage
   */
  const updateBrainLightDamage = (checked: boolean) =>
    saveToLocalStorage(
      'brainLightDamage',
      !!checked,
      !!checked
        ? 'The survivor suffers brain damage from the horrors witnessed.'
        : 'The survivor recovers from their brain injury.'
    )

  /**
   * Update Torment (Arc)
   */
  const updateTorment = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error('Torment cannot be negative.')
    }

    saveToLocalStorage('torment', value, 'Torment level updated.')
  }

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
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
                        className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners"
                        {...field}
                        value={field.value ?? '0'}
                        onChange={(e) => updateInsanity(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormLabel className="text-xs">Insanity</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="mx-2 w-px bg-border h-[80px]" />

          {/* Brain */}
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="font-bold flex gap-1 items-center">
              <BrainIcon />
              Brain
            </div>
            <div className="absolute top-0 right-0 flex items-center">
              <FormField
                control={form.control}
                name="brainLightDamage"
                render={({ field }) => (
                  <FormItem className="space-y-0 flex flex-col items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          updateBrainLightDamage(!!checked)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs mt-1">L</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="text-xs mt-auto text-muted-foreground">
              If your insanity is 3+, you are <strong>insane</strong>.
            </div>
          </div>

          {/* Torment (Arc) */}
          {settlement.survivorType === SurvivorType.ARC && (
            <>
              <div className="mx-2 w-px bg-border" />

              <FormField
                control={form.control}
                name="torment"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => updateTorment(e.target.value)}
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
