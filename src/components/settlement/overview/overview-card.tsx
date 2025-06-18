'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Overview Card Properties
 */
interface OverviewCardProps {
  /** Settlement Form */
  form: UseFormReturn<Settlement>
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Overview Card Component
 *
 * Displays and manages high-level information for the settlement including
 * survival limit, population count, death count, and lost settlements.
 *
 * @param props Overview Card Properties
 * @returns Overview Card Component
 */
export function OverviewCard({
  form,
  saveSelectedSettlement,
  selectedSettlement
}: OverviewCardProps): ReactElement {
  const isArcCampaign = useMemo(
    () => selectedSettlement?.survivorType === SurvivorType.ARC,
    [selectedSettlement?.survivorType]
  )
  const isLanternCampaign = useMemo(
    () =>
      selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
      selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_SUN,
    [selectedSettlement?.campaignType]
  )

  // Track survivors state to trigger re-calculations when survivors change
  const [survivors, setSurvivors] = useState<Survivor[]>([])

  // Calculate current population from living survivors
  const currentPopulation = useMemo(() => {
    return survivors.filter((survivor) => !survivor.dead).length
  }, [survivors])

  // Calculate death count from dead survivors
  const currentDeathCount = useMemo(() => {
    return survivors.filter((survivor) => survivor.dead).length
  }, [survivors])

  // Update survivors when settlement changes or when localStorage changes
  useEffect(() => {
    if (selectedSettlement?.id)
      setSurvivors(getSurvivors(selectedSettlement.id))
  }, [selectedSettlement?.id])

  // Listen for storage events to update survivors when they change in other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedSettlement?.id)
        setSurvivors(getSurvivors(selectedSettlement.id))
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

  // Calculate collective cognition for ARC campaigns
  useEffect(() => {
    if (!isArcCampaign) return

    // Check if we have a valid settlement with an ID in the form
    const formValues = form.getValues()
    if (!formValues.id || typeof formValues.id !== 'number') return

    let totalCc = 0

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
      saveSelectedSettlement({ ccValue: totalCc })
    }
  }, [isArcCampaign, selectedSettlement, saveSelectedSettlement, form])

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
  ) => saveSelectedSettlement({ [attrName]: value }, successMsg)

  return (
    <Card className="border-0 p-0 py-2">
      <CardContent>
        {/* Desktop Layout - Horizontal with separators */}
        <div className="hidden lg:flex flex-row items-start justify-between gap-4">
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
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Mobile/Tablet Layout - Table format */}
        <div className="lg:hidden space-y-2">
          {/* Survival Limit */}
          <FormField
            control={form.control}
            name="survivalLimit"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Survival Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="w-16 h-8 text-center no-spinners text-sm"
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
                </div>
              </FormItem>
            )}
          />

          {/* Population */}
          <FormField
            control={form.control}
            name="population"
            render={() => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Population</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-16 h-8 text-center no-spinners text-sm"
                      value={currentPopulation}
                      disabled
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Death Count */}
          <FormField
            control={form.control}
            name="deathCount"
            render={() => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Death Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-16 h-8 text-center no-spinners text-sm"
                      value={currentDeathCount}
                      disabled
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Lost Settlement Count */}
          <FormField
            control={form.control}
            name="lostSettlements"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Lost Settlements</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-16 h-8 text-center no-spinners text-sm"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Collective Cognition (ARC only) */}
          {isArcCampaign && (
            <FormField
              control={form.control}
              name="ccValue"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm">
                      Collective Cognition
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-16 h-8 text-center no-spinners text-sm"
                        value={selectedSettlement?.ccValue ?? '0'}
                        disabled
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {isLanternCampaign && (
            <FormField
              control={form.control}
              name="lanternResearchLevel"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm">Lantern Research</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-16 h-8 text-center no-spinners text-sm"
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
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
