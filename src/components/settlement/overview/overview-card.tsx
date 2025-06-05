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
import { ReactElement, useEffect, useMemo } from 'react'
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

  // Watch for changes to nemesis victories, quarry victories for ARC campaigns
  const nemeses = useMemo(
    () => selectedSettlement?.nemeses || [],
    [selectedSettlement?.nemeses]
  )
  const quarries = useMemo(
    () => selectedSettlement?.quarries || [],
    [selectedSettlement?.quarries]
  )

  // Calculate population and death count from survivors
  const survivors = useMemo(() => {
    return getSurvivors(selectedSettlement?.id) || []
  }, [selectedSettlement?.id])

  const population = useMemo(() => {
    return survivors.filter((survivor) => !survivor.dead).length
  }, [survivors])

  const deathCount = useMemo(() => {
    return survivors.filter((survivor) => survivor.dead).length
  }, [survivors])

  // Calculate collective cognition for ARC campaigns
  useEffect(() => {
    if (!isArcCampaign) return

    let totalCc = 0

    // Calculate CC from nemesis victories. Each nemesis victory gives 3 CC.
    for (const nemesis of nemeses) {
      if (nemesis.ccLevel1) totalCc += 3
      if (nemesis.ccLevel2) totalCc += 3
      if (nemesis.ccLevel3) totalCc += 3
    }

    // Calculate CC from quarry victories.
    for (const quarry of quarries) {
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

    selectedSettlement.ccValue = totalCc
  }, [isArcCampaign, nemeses, quarries, selectedSettlement])

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
        <div className="flex flex-row items-center justify-between gap-4">
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
                      value={population}
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
                      value={deathCount}
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
