'use client'

import { ShowdownMonstersCard } from '@/components/showdown/showdown-monster/showdown-monsters-card'
import { ShowdownSurvivorsCard } from '@/components/showdown/showdown-survivors/showdown-survivors-card'
import { TurnCard } from '@/components/showdown/showdown-turn/showdown-turn-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { SettlementPhaseStep, TabType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  SETTLEMENT_PHASE_STARTED_MESSAGE,
  SHOWDOWN_DELETED_MESSAGE
} from '@/lib/messages'
import { getNextSettlementPhaseId } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { ReactElement, useCallback, useState } from 'react'
import { toast } from 'sonner'

/**
 * Active Showdown Card Properties
 */
interface ActiveShowdownCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Settlement Phase */
  setSelectedSettlementPhase: (settlementPhase: SettlementPhase | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Showdown Monster Index */
  setSelectedShowdownMonsterIndex: (index: number) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Active Showdown Card Component
 *
 * @param props Active Showdown Card Properties
 * @returns Active Showdown Card Component
 */
export function ActiveShowdownCard({
  campaign,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedShowdown,
  selectedShowdownMonsterIndex,
  selectedSettlement,
  selectedSurvivor,
  setSelectedSettlementPhase,
  setSelectedShowdown,
  setSelectedShowdownMonsterIndex,
  setSelectedSurvivor,
  setSelectedTab,
  updateCampaign
}: ActiveShowdownCardProps): ReactElement {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false)

  /**
   * Handle Cancel Showdown
   */
  const handleCancelShowdown = useCallback(
    () => setIsCancelDialogOpen(true),
    []
  )

  /**
   * Handle Delete Showdown
   *
   * Showdown is deleted and the survivors return to the settlement. This will
   * **not** trigger the settlement phase.
   */
  const handleDeleteShowdown = useCallback(() => {
    if (!selectedSettlement?.id) return

    try {
      // Remove the showdown from the campaign's showdowns array.
      updateCampaign({
        ...campaign,
        showdowns: campaign.showdowns?.filter(
          (showdown) => showdown.id !== selectedShowdown?.id
        ),
        survivors: campaign.survivors?.map((survivor) =>
          selectedShowdown?.survivors?.includes(survivor.id)
            ? // Reset the survivors' injuries
              {
                ...survivor,
                brainLightDamage: false,
                headHeavyDamage: false,
                armLightDamage: false,
                armHeavyDamage: false,
                bodyLightDamage: false,
                bodyHeavyDamage: false,
                waistLightDamage: false,
                waistHeavyDamage: false,
                legLightDamage: false,
                legHeavyDamage: false
              }
            : survivor
        )
      })
      setSelectedShowdown(null)
      setIsCancelDialogOpen(false)

      toast.success(SHOWDOWN_DELETED_MESSAGE())
    } catch (error) {
      console.error('Delete Showdown Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }, [
    campaign,
    selectedSettlement?.id,
    selectedShowdown?.id,
    selectedShowdown?.survivors,
    setSelectedShowdown,
    updateCampaign
  ])

  /**
   * Handle Proceed to Settlement Phase Transition
   */
  const handleProceedToSettlementPhase = useCallback(() => {
    if (!selectedSettlement || !selectedShowdown) return

    try {
      // Create the settlement phase from the current showdown
      const settlementPhase: SettlementPhase = {
        endeavors: 0,
        id: getNextSettlementPhaseId(campaign),
        returningScout: selectedShowdown.scout ?? null,
        returningSurvivors: selectedShowdown.survivors,
        settlementId: selectedSettlement.id,
        step: SettlementPhaseStep.SURVIVORS_RETURN
      }

      // Remove the showdown and add the settlement phase
      const updatedShowdowns = campaign.showdowns.filter(
        (showdown) => showdown.id !== selectedShowdown.id
      )
      const updatedSettlementPhases = [
        ...campaign.settlementPhases,
        settlementPhase
      ]

      updateCampaign({
        ...campaign,
        showdowns: updatedShowdowns,
        settlementPhases: updatedSettlementPhases
      })

      setSelectedShowdown(null)
      setSelectedShowdownMonsterIndex(0)
      setSelectedSettlementPhase(settlementPhase)
      setSelectedTab(TabType.SETTLEMENT_PHASE)

      toast.success(SETTLEMENT_PHASE_STARTED_MESSAGE())
    } catch (error) {
      console.error('Settlement Phase Creation Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }, [
    campaign,
    selectedSettlement,
    selectedShowdown,
    setSelectedSettlementPhase,
    setSelectedShowdown,
    setSelectedShowdownMonsterIndex,
    setSelectedTab,
    updateCampaign
  ])

  return (
    <div className="flex flex-col gap-2 h-full relative">
      {/* Action Buttons */}
      <div className="flex justify-between pointer-events-none">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancelShowdown}
          className="pointer-events-auto"
          title="End Showdown">
          <XIcon className="size-4" />
          End Showdown
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleProceedToSettlementPhase}
          className="pointer-events-auto"
          title="Begin Settlement Phase">
          Begin Settlement Phase <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col lg:flex-row gap-2">
          <ShowdownMonstersCard
            saveSelectedShowdown={saveSelectedShowdown}
            selectedShowdown={selectedShowdown}
            selectedShowdownMonsterIndex={selectedShowdownMonsterIndex}
            setSelectedShowdownMonsterIndex={setSelectedShowdownMonsterIndex}
          />

          <TurnCard
            saveSelectedShowdown={saveSelectedShowdown}
            selectedShowdown={selectedShowdown}
            selectedShowdownMonsterIndex={selectedShowdownMonsterIndex}
            selectedSurvivor={selectedSurvivor}
          />
        </div>

        <ShowdownSurvivorsCard
          campaign={campaign}
          saveSelectedShowdown={saveSelectedShowdown}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedShowdown={selectedShowdown}
          selectedSettlement={selectedSettlement}
          selectedSurvivor={selectedSurvivor}
          setSelectedSurvivor={setSelectedSurvivor}
        />
      </div>

      {/* Cancel Showdown Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Showdown</AlertDialogTitle>
            <AlertDialogDescription>
              The showdown will end and survivors will return to the settlement.{' '}
              <strong>
                This action cannot be undone. Any changes made to your
                settlement or survivors will be retained.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteShowdown}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              End Showdown
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
