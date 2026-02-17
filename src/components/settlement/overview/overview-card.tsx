'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CampaignType, SurvivorType } from '@/lib/enums'
import {
  LANTERN_RESEARCH_LEVEL_MINIMUM_ERROR,
  LANTERN_RESEARCH_LEVEL_UPDATED_MESSAGE,
  LOST_SETTLEMENT_COUNT_MINIMUM_ERROR,
  LOST_SETTLEMENT_COUNT_UPDATED_MESSAGE,
  SURVIVAL_LIMIT_MINIMUM_ERROR_MESSAGE,
  SURVIVAL_LIMIT_UPDATED_MESSAGE
} from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { ReactElement, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

/**
 * Overview Card Properties
 */
interface OverviewCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Settlement Phase */
  saveSelectedSettlementPhase: (
    updateData: Partial<SettlementPhase>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Settlement Phase */
  selectedSettlementPhase: SettlementPhase | null
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
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
  campaign,
  saveSelectedSettlementPhase,
  selectedSettlement,
  selectedSettlementPhase,
  updateCampaign
}: OverviewCardProps): ReactElement {
  // Calculate current population from living survivors
  const currentPopulation = useMemo(() => {
    return campaign.survivors.filter(
      (survivor) =>
        !survivor.dead && survivor.settlementId === selectedSettlement?.id
    ).length
  }, [campaign.survivors, selectedSettlement?.id])

  // Calculate death count from dead survivors
  const currentDeathCount = useMemo(() => {
    return campaign.survivors.filter(
      (survivor) =>
        survivor.dead && survivor.settlementId === selectedSettlement?.id
    ).length
  }, [campaign.survivors, selectedSettlement?.id])

  // Calculate current population from living survivors
  const currentCCValue = useMemo(() => {
    let totalCc = 0

    // Calculate CC from nemesis victories. Each nemesis victory gives 3 CC.
    for (const nemesis of selectedSettlement?.nemeses ?? []) {
      if (nemesis.ccLevel1) totalCc += 3
      if (nemesis.ccLevel2) totalCc += 3
      if (nemesis.ccLevel3) totalCc += 3
    }

    // Calculate CC from quarry victories.
    for (const quarry of selectedSettlement?.quarries ?? []) {
      // Prologue Monster (1 CC)
      if (quarry.ccPrologue) totalCc += 1

      // Level 1 Monster (1 CC)
      if (quarry.ccLevel1) totalCc += 1

      // Level 2 Monster (2 CC)
      for (const level2Victory of quarry.ccLevel2 ?? [])
        if (level2Victory) totalCc += 2

      // Level 3 Monster (3 CC)
      for (const level3Victory of quarry.ccLevel3 ?? [])
        if (level3Victory) totalCc += 3
    }

    return totalCc
  }, [selectedSettlement?.nemeses, selectedSettlement?.quarries])

  /**
   * Handle Survival Limit Change
   *
   * @param oldValue Old Survival Limit
   * @param newValue New Survival Limit
   */
  const handleSurvivalLimitChange = useCallback(
    (oldValue: number, newValue: number) => {
      if (isNaN(oldValue) || isNaN(newValue)) return
      if (oldValue === newValue) return

      if (newValue < 1)
        return toast.error(SURVIVAL_LIMIT_MINIMUM_ERROR_MESSAGE())

      updateCampaign({
        ...campaign,
        settlements: campaign.settlements.map((settlement) =>
          settlement.id === selectedSettlement?.id
            ? {
                ...settlement,
                survivalLimit: newValue
              }
            : settlement
        )
      })
      toast.success(SURVIVAL_LIMIT_UPDATED_MESSAGE(oldValue, newValue))
    },
    [campaign, selectedSettlement?.id, updateCampaign]
  )

  /**
   * Handle Lost Settlement Count Change
   *
   * @param oldValue Old Lost Settlement Count
   * @param newValue New Lost Settlement Count
   */
  const handleLostSettlementCountChange = useCallback(
    (oldValue: number, newValue: number) => {
      if (isNaN(oldValue) || isNaN(newValue)) return
      if (oldValue === newValue) return

      if (newValue < 0)
        return toast.error(LOST_SETTLEMENT_COUNT_MINIMUM_ERROR())

      updateCampaign({
        ...campaign,
        settlements: campaign.settlements.map((settlement) =>
          settlement.id === selectedSettlement?.id
            ? {
                ...settlement,
                lostSettlements: newValue
              }
            : settlement
        )
      })
      toast.success(LOST_SETTLEMENT_COUNT_UPDATED_MESSAGE(oldValue, newValue))
    },
    [campaign, selectedSettlement?.id, updateCampaign]
  )

  /**
   * Handle Lantern Research Level Change
   *
   * @param oldValue Old Lantern Research Level
   * @param newValue New Lantern Research Level
   */
  const handleLanternResearchLevelChange = useCallback(
    (oldValue: number, newValue: number) => {
      if (isNaN(oldValue) || isNaN(newValue)) return
      if (oldValue === newValue) return

      if (newValue < 0)
        return toast.error(LANTERN_RESEARCH_LEVEL_MINIMUM_ERROR())

      updateCampaign({
        ...campaign,
        settlements: campaign.settlements.map((settlement) =>
          settlement.id === selectedSettlement?.id
            ? {
                ...settlement,
                lanternResearchLevel: newValue
              }
            : settlement
        )
      })
      toast.success(LANTERN_RESEARCH_LEVEL_UPDATED_MESSAGE(oldValue, newValue))
    },
    [campaign, selectedSettlement?.id, updateCampaign]
  )

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
              defaultValue={selectedSettlement?.survivalLimit ?? 1}
              key={`survival-limit-${selectedSettlement?.id}-${selectedSettlement?.survivalLimit}`}
              onBlur={(e) =>
                handleSurvivalLimitChange(
                  selectedSettlement?.survivalLimit ?? 1,
                  parseInt(e.target.value, 10)
                )
              }
              disabled={!selectedSettlement}
              name="survival-limit-desktop"
              id="survival-limit-desktop"
            />
            <Label className="text-center text-xs">Survival Limit</Label>
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
              name="population-desktop"
              id="population-desktop"
            />
            <Label className="text-center text-xs">Population</Label>
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
              name="death-count-desktop"
              id="death-count-desktop"
            />
            <Label className="text-center text-xs">Death Count</Label>
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />

          {/* Lost Settlement Count */}
          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              min="0"
              placeholder="0"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              defaultValue={selectedSettlement?.lostSettlements ?? 0}
              key={`lost-settlements-${selectedSettlement?.id}-${selectedSettlement?.lostSettlements}`}
              onBlur={(e) =>
                handleLostSettlementCountChange(
                  selectedSettlement?.lostSettlements ?? 0,
                  parseInt(e.target.value, 10)
                )
              }
              disabled={!selectedSettlement}
              name="lost-settlements-desktop"
              id="lost-settlements-desktop"
            />
            <Label className="text-center text-xs">Lost Settlements</Label>
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
                  value={currentCCValue}
                  disabled
                  name="collective-cognition-desktop"
                  id="collective-cognition-desktop"
                />
                <Label className="text-center text-xs">
                  Collective Cognition
                </Label>
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
                  defaultValue={selectedSettlement?.lanternResearchLevel ?? 0}
                  key={`lantern-research-${selectedSettlement?.id}-${selectedSettlement?.lanternResearchLevel}`}
                  onBlur={(e) =>
                    handleLanternResearchLevelChange(
                      selectedSettlement?.lanternResearchLevel ?? 0,
                      parseInt(e.target.value, 10)
                    )
                  }
                  name="lantern-research-desktop"
                  id="lantern-research-desktop"
                />
                <Label className="text-center text-xs">Lantern Research</Label>
              </div>
            </>
          )}

          {/* Endeavors (Settlement Phase Only) */}
          {selectedSettlementPhase &&
            selectedSettlement?.id ===
              selectedSettlementPhase?.settlementId && (
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
                    defaultValue={selectedSettlementPhase?.endeavors ?? 0}
                    key={`endeavors-${selectedSettlement?.id}-${selectedSettlementPhase?.endeavors}`}
                    onBlur={(e) =>
                      saveSelectedSettlementPhase({
                        endeavors: parseInt(e.target.value, 10)
                      })
                    }
                    name="endeavors-desktop"
                    id="endeavors-desktop"
                  />
                  <Label className="text-center text-xs">Endeavors</Label>
                </div>
              </>
            )}
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-2">
          {/* Survival Limit */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Survival Limit</Label>
            <NumericInput
              label="Survival Limit"
              value={selectedSettlement?.survivalLimit ?? 1}
              min={1}
              onChange={(value) =>
                handleSurvivalLimitChange(
                  selectedSettlement?.survivalLimit ?? 1,
                  value
                )
              }
              className="w-16 h-8 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={!selectedSettlement}
            />
          </div>

          {/* Population */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Population</Label>
            <Input
              type="number"
              className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentPopulation}
              disabled
              name="population-mobile"
              id="population-mobile"
            />
          </div>

          {/* Death Count */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Death Count</Label>
            <Input
              type="number"
              className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={currentDeathCount}
              disabled
              name="death-count-mobile"
              id="death-count-mobile"
            />
          </div>

          {/* Lost Settlement Count */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Lost Settlements</Label>
            <NumericInput
              label="Lost Settlements"
              value={selectedSettlement?.lostSettlements ?? 0}
              min={0}
              onChange={(value) =>
                handleLostSettlementCountChange(
                  selectedSettlement?.lostSettlements ?? 0,
                  value
                )
              }
              disabled={!selectedSettlement}
              className="w-16 h-8 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Collective Cognition (ARC only) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <div className="flex items-center justify-between">
              <Label className="text-sm">Collective Cognition</Label>
              <Input
                type="number"
                className="w-16 h-8 text-center no-spinners text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={currentCCValue}
                disabled
                name="collective-cognition-mobile"
                id="collective-cognition-mobile"
              />
            </div>
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {(selectedSettlement?.campaignType ===
            CampaignType.PEOPLE_OF_THE_LANTERN ||
            selectedSettlement?.campaignType ===
              CampaignType.PEOPLE_OF_THE_SUN) && (
            <div className="flex items-center justify-between">
              <Label className="text-sm">Lantern Research</Label>
              <NumericInput
                label="Lantern Research"
                value={selectedSettlement?.lanternResearchLevel ?? 0}
                min={0}
                onChange={(value) =>
                  handleLanternResearchLevelChange(
                    selectedSettlement?.lanternResearchLevel ?? 0,
                    value
                  )
                }
                className="w-16 h-8 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
