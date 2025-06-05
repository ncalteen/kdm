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
import { Separator } from '@/components/ui/separator'
import { useSettlement } from '@/contexts/settlement-context'
import { useSettlementSave } from '@/hooks/use-settlement-save'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Population Card Component
 *
 * Displays and manages population statistics for the settlement including
 * survival limit, population count, death count, and lost settlements.
 *
 * @param form Settlement form instance
 * @returns Population Card Component
 */
export function OverviewCard(form: UseFormReturn<Settlement>): ReactElement {
  const { selectedSettlement } = useSettlement()
  const { saveSettlement } = useSettlementSave(form)

  const isArcCampaign = selectedSettlement?.survivorType === SurvivorType.ARC
  const isLanternCampaign =
    selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
    selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_SUN

  // Track survivors state to trigger re-calculations when survivors change
  const [survivors, setSurvivors] = useState<Survivor[]>([])

  // Update survivors when settlement changes or when localStorage changes
  useEffect(() => {
    if (selectedSettlement?.id) {
      setSurvivors(getSurvivors(selectedSettlement.id))
    }
  }, [selectedSettlement?.id])

  // Listen for storage events to update survivors when they change in other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedSettlement?.id) {
        setSurvivors(getSurvivors(selectedSettlement.id))
      }
    }

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events when survivors are updated in the same tab
    window.addEventListener('survivorsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('survivorsUpdated', handleStorageChange)
    }
  }, [selectedSettlement?.id])

  // Periodically check for survivor changes (fallback for same-tab updates)
  useEffect(() => {
    if (!selectedSettlement?.id) return

    const interval = setInterval(() => {
      const currentSurvivors = getSurvivors(selectedSettlement.id)
      // Check if survivors have changed
      if (JSON.stringify(currentSurvivors) !== JSON.stringify(survivors)) {
        setSurvivors(currentSurvivors)
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [selectedSettlement?.id, survivors])

  // Calculate current population from living survivors
  const currentPopulation = useMemo(() => {
    return survivors.filter((survivor) => !survivor.dead).length
  }, [survivors])

  // Calculate death count from dead survivors
  const currentDeathCount = useMemo(() => {
    return survivors.filter((survivor) => survivor.dead).length
  }, [survivors])

  // Update population and death count when they change
  useEffect(() => {
    if (!selectedSettlement?.id) return

    const formValues = form.getValues()

    // Update population if it differs from current count
    if (formValues.population !== currentPopulation) {
      form.setValue('population', currentPopulation)
      saveSettlement({ population: currentPopulation })
    }

    // Update death count if it differs from current count
    if (formValues.deathCount !== currentDeathCount) {
      form.setValue('deathCount', currentDeathCount)
      saveSettlement({ deathCount: currentDeathCount })
    }
  }, [
    currentPopulation,
    currentDeathCount,
    selectedSettlement?.id,
    form,
    saveSettlement
  ])

  // Calculate collective cognition for ARC campaigns
  useEffect(() => {
    if (!isArcCampaign || !selectedSettlement) return

    let totalCc = 0

    // Get current form values to ensure we're working with the latest data
    const formValues = form.getValues()

    // Calculate CC from nemesis victories. Each nemesis victory gives 3 CC.
    for (const nemesis of formValues.nemeses || []) {
      if (nemesis.ccLevel1) totalCc += 3
      if (nemesis.ccLevel2) totalCc += 3
      if (nemesis.ccLevel3) totalCc += 3
    }

    // Calculate CC from quarry victories.
    for (const quarry of formValues.quarries || []) {
      // Prologue Monster (1 CC)
      if (quarry.ccPrologue) totalCc += 1

      // Level 1 Monster (1 CC)
      if (quarry.ccLevel1) totalCc += 1

      // Level 2 Monster (2 CC)
      for (const level2Victory of quarry.ccLevel2 || [])
        if (level2Victory) totalCc += 2

      // Level 3 Monster (3 CC)
      for (const level3Victory of quarry.ccLevel3 || [])
        if (level3Victory) totalCc += 3
    }

    // Update form value and save if different
    const currentCcValue = form.getValues('ccValue')
    if (currentCcValue !== totalCc) {
      form.setValue('ccValue', totalCc)
      saveSettlement({ ccValue: totalCc })
    }
  }, [isArcCampaign, selectedSettlement, form, saveSettlement])

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   * @param successMsg Success message to show
   */
  const saveToLocalStorage = (
    attrName: 'survivalLimit' | 'lanternResearchLevel',
    value: number,
    successMsg: string
  ) => saveSettlement({ [attrName]: value }, successMsg)

  return (
    <Card className="border-0 p-0 py-2">
      <CardContent>
        <div className="flex flex-row items-start justify-between gap-4">
          {/* Survival Limit */}
          <FormField
            control={form.control}
            name="survivalLimit"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? '1'}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        form.setValue(field.name, value)
                        saveToLocalStorage(
                          'survivalLimit',
                          value,
                          "The settlement's will to live grows stronger."
                        )
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Survival Limit
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Population */}
          <FormField
            control={form.control}
            name="population"
            render={() => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      value={currentPopulation}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Population
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Death Count */}
          <FormField
            control={form.control}
            name="deathCount"
            render={() => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      value={currentDeathCount}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Death Count
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Lost Settlement Count */}
          <FormField
            control={form.control}
            name="lostSettlements"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Lost Settlements
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Collective Cognition (ARC only) */}
          {isArcCampaign && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-12"
              />

              <FormField
                control={form.control}
                name="ccValue"
                render={() => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          type="number"
                          className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                          value={selectedSettlement?.ccValue ?? '0'}
                          disabled
                        />
                      </FormControl>
                      <FormLabel className="text-center text-xs">
                        Collective Cognition
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {isLanternCampaign && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-12"
              />

              <FormField
                control={form.control}
                name="lanternResearchLevel"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            const finalValue =
                              isNaN(value) || value < 0 ? 0 : value
                            form.setValue(field.name, finalValue)
                            saveToLocalStorage(
                              'lanternResearchLevel',
                              finalValue,
                              'The lantern burns brighter with newfound knowledge.'
                            )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-center text-xs">
                        Lantern Research
                      </FormLabel>
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
