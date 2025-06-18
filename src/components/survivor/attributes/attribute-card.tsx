'use client'

import { Card, CardContent } from '@/components/ui/card'
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
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Attribute Card Properties
 */
interface AttributeCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Survivor Attribute Card Component
 *
 * This component displays the survivor's core attributes (movement, accuracy,
 * strength, etc.) and allows them to be edited. For Arc survivors, it also
 * shows the Lumi attribute.
 *
 * @param props Attribute Card Properties
 * @returns Attribute Card Component
 */
export function AttributeCard({
  form,
  saveSelectedSurvivor,
  selectedSettlement
}: AttributeCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'movement'
      | 'accuracy'
      | 'strength'
      | 'evasion'
      | 'luck'
      | 'speed'
      | 'lumi',
    value: number
  ) => {
    // Thematic success messages for each attribute
    const attributeMessages: Record<string, string> = {
      movement: 'Strides through darkness grow more confident.',
      accuracy: "The survivor's aim pierces through shadow.",
      strength: 'Muscles forged in adversity grow stronger.',
      evasion: 'Grace in the face of death improves.',
      luck: 'Fortune favors the desperate soul.',
      speed: 'Swift as shadows, the survivor advances.',
      lumi: 'Arc energy courses through enlightened veins.'
    }

    const updateData: Partial<Survivor> = {
      [attrName]: value
    }

    saveSelectedSurvivor(
      updateData,
      attributeMessages[attrName] || "The survivor's potential grows."
    )
  }

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex flex-row justify-between">
          {/* Movement */}
          <FormField
            control={form.control}
            name="movement"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="1"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 1}
                      onChange={(e) =>
                        saveToLocalStorage('movement', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Movement</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-px bg-border" />

          {/* Accuracy */}
          <FormField
            control={form.control}
            name="accuracy"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        saveToLocalStorage('accuracy', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Accuracy</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Strength */}
          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        saveToLocalStorage('strength', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Strength</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Evasion */}
          <FormField
            control={form.control}
            name="evasion"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        saveToLocalStorage('evasion', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Evasion</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Luck */}
          <FormField
            control={form.control}
            name="luck"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        saveToLocalStorage('luck', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Luck</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Speed */}
          <FormField
            control={form.control}
            name="speed"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        saveToLocalStorage('speed', parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Speed</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lumi (Arc) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <>
              <div className="w-px bg-border" />
              <FormField
                control={form.control}
                name="lumi"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                          {...field}
                          value={field.value ?? 0}
                          min={0}
                          onChange={(e) =>
                            saveToLocalStorage('lumi', parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lumi</FormLabel>
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
