'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useEffect, useMemo } from 'react'
import { toast } from 'sonner'

/**
 * Overview Card Properties
 */
interface OverviewCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Survivors */
  survivors: Survivor[] | null
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
  saveSelectedSettlement,
  selectedSettlement,
  survivors
}: OverviewCardProps): ReactElement {
  // Calculate current population from living survivors
  const currentPopulation = useMemo(() => {
    return survivors?.filter(
      (survivor) =>
        !survivor.dead && survivor.settlementId === selectedSettlement?.id
    ).length
  }, [survivors, selectedSettlement?.id])

  // Calculate death count from dead survivors
  const currentDeathCount = useMemo(() => {
    return survivors?.filter(
      (survivor) =>
        survivor.dead && survivor.settlementId === selectedSettlement?.id
    ).length
  }, [survivors, selectedSettlement?.id])

  // Calculate collective cognition for ARC campaigns
  useEffect(() => {
    if (selectedSettlement?.survivorType !== SurvivorType.ARC) return
    if (!selectedSettlement?.id) return

    console.debug(
      '[OverviewCard] Calculating Collective Cognition',
      selectedSettlement?.id,
      selectedSettlement?.survivorType,
      selectedSettlement?.ccValue,
      selectedSettlement?.nemeses,
      selectedSettlement?.quarries
    )

    let totalCc = 0

    // Calculate CC from nemesis victories. Each nemesis victory gives 3 CC.
    for (const nemesis of selectedSettlement?.nemeses || []) {
      if (nemesis.ccLevel1) totalCc += 3
      if (nemesis.ccLevel2) totalCc += 3
      if (nemesis.ccLevel3) totalCc += 3
    }

    // Calculate CC from quarry victories.
    for (const quarry of selectedSettlement?.quarries || []) {
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
    if (selectedSettlement.ccValue !== totalCc)
      saveSelectedSettlement({ ccValue: totalCc })
  }, [
    saveSelectedSettlement,
    selectedSettlement?.id,
    selectedSettlement?.survivorType,
    selectedSettlement?.ccValue,
    selectedSettlement?.nemeses,
    selectedSettlement?.quarries
  ])

  /**
   * Handle Survival Limit Change
   *
   * @param value Survival Limit
   */
  const handleSurvivalLimitChange = (value: string) => {
    const numericValue = parseInt(value, 10)

    if (isNaN(numericValue)) return

    if (numericValue < 1)
      return toast.error('Survival limit cannot be reduced below 1.')

    saveSelectedSettlement(
      { survivalLimit: numericValue },
      "The settlement's will to live grows stronger."
    )
  }

  /**
   * Handle Lantern Research Level Change
   *
   * @param value Lantern Research Level
   */
  const handleLanternResearchLevelChange = (value: string) => {
    const numericValue = parseInt(value, 10)

    if (isNaN(numericValue)) return

    if (numericValue < 0)
      return toast.error('Lantern research level cannot be reduced below 0.')

    saveSelectedSettlement(
      { lanternResearchLevel: numericValue },
      "The lantern's glow illuminates new knowledge."
    )
  }

  return (
    <Card className="border-0 p-0 py-2">
      <CardContent>
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-row items-start justify-between gap-4">
          {/* Survival Limit */}
          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              min="1"
              placeholder="1"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSettlement?.survivalLimit ?? '1'}
              onChange={(e) => handleSurvivalLimitChange(e.target.value)}
            />
            <label className="text-center text-xs">Survival Limit</label>
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Population */}
          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentPopulation}
              disabled
            />
            <label className="text-center text-xs">Population</label>
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Death Count */}
          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentDeathCount}
              disabled
            />
            <label className="text-center text-xs">Death Count</label>
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Lost Settlement Count */}
          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              placeholder="0"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSettlement?.lostSettlements ?? '0'}
              disabled
            />
            <label className="text-center text-xs">Lost Settlements</label>
          </div>

          {/* Collective Cognition (ARC only) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-12"
              />

              <div className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={selectedSettlement?.ccValue ?? '0'}
                  disabled
                />
                <label className="text-center text-xs">
                  Collective Cognition
                </label>
              </div>
            </>
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {(selectedSettlement?.campaignType ===
            CampaignType.PEOPLE_OF_THE_LANTERN ||
            selectedSettlement?.campaignType ===
              CampaignType.PEOPLE_OF_THE_SUN) && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-12"
              />

              <div className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={selectedSettlement?.lanternResearchLevel ?? '0'}
                  onChange={(e) => {
                    handleLanternResearchLevelChange(e.target.value)
                  }}
                />
                <label className="text-center text-xs">Lantern Research</label>
              </div>
            </>
          )}
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-2">
          {/* Survival Limit */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Survival Limit</label>
            <Input
              type="number"
              min="1"
              placeholder="1"
              className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSettlement?.survivalLimit ?? '1'}
              onChange={(e) => {
                handleSurvivalLimitChange(e.target.value)
              }}
            />
          </div>

          {/* Population */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Population</label>
            <Input
              type="number"
              className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentPopulation}
              disabled
            />
          </div>

          {/* Death Count */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Death Count</label>
            <Input
              type="number"
              className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentDeathCount}
              disabled
            />
          </div>

          {/* Lost Settlement Count */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Lost Settlements</label>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSettlement?.lostSettlements ?? '0'}
                disabled
              />
            </FormControl>
          </div>

          {/* Collective Cognition (ARC only) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <div className="flex items-center justify-between">
              <label className="text-sm">Collective Cognition</label>
              <Input
                type="number"
                className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSettlement?.ccValue ?? '0'}
                disabled
              />
            </div>
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {(selectedSettlement?.campaignType ===
            CampaignType.PEOPLE_OF_THE_LANTERN ||
            selectedSettlement?.campaignType ===
              CampaignType.PEOPLE_OF_THE_SUN) && (
            <div className="flex items-center justify-between">
              <label className="text-sm">Lantern Research</label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSettlement?.lanternResearchLevel ?? '0'}
                onChange={(e) =>
                  handleLanternResearchLevelChange(e.target.value)
                }
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
