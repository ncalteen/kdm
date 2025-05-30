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
import { getCampaign, getSettlement } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Survivor Attribute Card Component
 *
 * This component displays the survivor's core attributes (movement, accuracy,
 * strength, etc.) and allows them to be edited. For Arc survivors, it also
 * shows the Lumi attribute.
 *
 * @param form Form
 * @returns Attribute Card Component
 */
export function AttributeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  // Get the survivor type from the settlement data.
  const [survivorType, setSurvivorType] = useState<SurvivorType | undefined>(
    undefined
  )

  // Set the survivor type when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)
  }, [form])

  /**
   * Save attribute changes to localStorage for the current survivor.
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
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          [attrName]: value
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.survivors[survivorIndex][attrName] = value
        localStorage.setItem('campaign', JSON.stringify(campaign))

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

        toast.success(
          attributeMessages[attrName] || "The survivor's potential grows."
        )
      }
    } catch (error) {
      console.error('Attribute Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardContent className="p-2">
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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '1'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('movement', val)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Movement</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-px bg-border"></div>

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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '0'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('accuracy', val)
                      }}
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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '0'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('strength', val)
                      }}
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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '0'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('evasion', val)
                      }}
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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '0'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('luck', val)
                      }}
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
                      className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                      defaultValue={field.value ?? '0'}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        form.setValue(field.name, val)
                        saveToLocalStorage('speed', val)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Speed</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lumi (Arc) */}
          {survivorType === SurvivorType.ARC && (
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
                          className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl"
                          defaultValue={field.value ?? '0'}
                          min={0}
                          onChange={(e) => {
                            let val = parseInt(e.target.value)
                            if (isNaN(val) || val < 0) val = 0
                            form.setValue(field.name, val)
                            saveToLocalStorage('lumi', val)
                          }}
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
