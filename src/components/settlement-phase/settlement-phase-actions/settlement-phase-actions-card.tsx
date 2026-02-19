'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SettlementPhaseStep, TabType } from '@/lib/enums'
import {
  SETTLEMENT_PHASE_ENDED_MESSAGE,
  SURVIVORS_HEALED_MESSAGE
} from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { CircleXIcon, HeartPlusIcon, SwordsIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { toast } from 'sonner'

/**
 * Settlement Phase Actions Card Properties
 */
interface SettlementPhaseActionsCardProps {
  /** Campaign */
  campaign: Campaign
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Settlement Phase */
  selectedSettlementPhase: SettlementPhase | null
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Settlement Phase Actions Card Component
 *
 * @param props Settlement Phase Actions Card Properties
 * @returns Settlement Phase Actions Card Component
 */
export function SettlementPhaseActionsCard({
  campaign,
  selectedSettlement,
  selectedSettlementPhase,
  setSelectedTab,
  updateCampaign
}: SettlementPhaseActionsCardProps): ReactElement {
  /**
   * Heal Returning Survivors
   *
   * Heals all returning survivors by removing all damage and setting armor to
   * zero. Only affects survivors that are alive.
   */
  function healReturningSurvivors() {
    if (!selectedSettlement || !selectedSettlementPhase) return

    // Get the survivors, heal them, and set armor to zero (if they are alive)
    const updatedSurvivors = campaign.survivors
      .filter(
        (survivor) =>
          (selectedSettlementPhase.returningSurvivors.includes(survivor.id) ||
            selectedSettlementPhase.returningScout === survivor.id) &&
          survivor.dead === false
      )
      .map((survivor) => ({
        ...survivor,
        brainLightDamage: false,
        headArmor: 0,
        headHeavyDamage: false,
        armArmor: 0,
        armLightDamage: false,
        armHeavyDamage: false,
        bodyArmor: 0,
        bodyLightDamage: false,
        bodyHeavyDamage: false,
        waistArmor: 0,
        waistLightDamage: false,
        waistHeavyDamage: false,
        legArmor: 0,
        legLightDamage: false,
        legHeavyDamage: false
      }))

    // Update the campaign data
    const updatedCampaign = {
      ...campaign,
      survivors: campaign.survivors.map((survivor) => {
        const updatedSurvivor = updatedSurvivors.find(
          (s) => s.id === survivor.id
        )
        return updatedSurvivor ? updatedSurvivor : survivor
      })
    }

    updateCampaign(updatedCampaign)
    toast.success(SURVIVORS_HEALED_MESSAGE())
  }

  /**
   * Proceed to Special Showdown
   *
   * Currently this simply sets the selected tab to the showdown tab. In the
   * future, this may also trigger other UI changes or updates to the campaign
   * data.
   */
  function proceedToSpecialShowdown() {
    if (!selectedSettlement || !selectedSettlementPhase) return

    setSelectedTab(TabType.SHOWDOWN)
  }

  /**
   * End Settlement Phase
   *
   * Ends the settlement phase and navigates to the timeline tab.
   */
  function endSettlementPhase() {
    if (!selectedSettlement || !selectedSettlementPhase) return

    // Remove this settlement phase from the campaign data.
    const updatedCampaign = {
      ...campaign,
      settlementPhases: campaign.settlementPhases.filter(
        (phase) => phase.id !== selectedSettlementPhase.id
      )
    }

    updateCampaign(updatedCampaign)
    setSelectedTab(TabType.TIMELINE)
    toast.success(SETTLEMENT_PHASE_ENDED_MESSAGE())
  }

  return (
    <Card className="p-0 py-2 border-0 flex items-center">
      <CardContent className="text-xs">
        {/* Heal Returning Survivors */}
        {(selectedSettlementPhase?.step ===
          SettlementPhaseStep.SURVIVORS_RETURN ||
          selectedSettlementPhase?.step ===
            SettlementPhaseStep.UPDATE_DEATH_COUNT) && (
          <Button
            className="h-12 w-60"
            variant="default"
            size="icon"
            onClick={healReturningSurvivors}>
            <HeartPlusIcon className="size-8" />
            Heal Returning Survivors
          </Button>
        )}

        {/* Proceed to Special Showdown */}
        {selectedSettlementPhase?.step ===
          SettlementPhaseStep.SPECIAL_SHOWDOWN && (
          <Button
            className="h-12 w-60"
            variant="default"
            size="icon"
            onClick={proceedToSpecialShowdown}>
            <SwordsIcon className="size-8" />
            Proceed to Special Showdown
          </Button>
        )}

        {/* End Settlement Phase */}
        {selectedSettlementPhase?.step ===
          SettlementPhaseStep.END_SETTLEMENT_PHASE && (
          <Button
            className="h-12 w-60"
            variant="destructive"
            size="icon"
            onClick={endSettlementPhase}>
            <CircleXIcon className="size-8" />
            End Settlement Phase
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
