'use client'

import { ShowdownMonsterCard } from '@/components/showdown/monster/showdown-monster-card'
import { ShowdownSurvivorsCard } from '@/components/showdown/showdown-survivors/showdown-survivors-card'
import { TurnCard } from '@/components/showdown/turn/turn-card'
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
import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { ReactElement, useCallback, useState } from 'react'
import { toast } from 'sonner'

/**
 * Active Showdown Card Properties
 */
interface ActiveShowdownCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Active Showdown Card Component
 *
 * @param props Active Showdown Card Properties
 * @returns Active Showdown Card Component
 */
export function ActiveShowdownCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSelectedShowdown,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
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
   */
  const handleDeleteShowdown = useCallback(() => {
    if (!selectedSettlement?.id) return

    try {
      const campaign = getCampaign()

      const updatedShowdowns = campaign.showdowns?.filter(
        (showdown) => showdown.id !== selectedShowdown?.id
      )

      saveCampaignToLocalStorage({
        ...campaign,
        showdowns: updatedShowdowns
      })

      setSelectedShowdown(null)

      toast.success(
        'The showdown ends. Survivors return to the relative safety of the settlement.'
      )

      setIsCancelDialogOpen(false)
    } catch (error) {
      console.error('Delete Showdown Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }, [selectedSettlement?.id, selectedShowdown?.id, setSelectedShowdown])

  /**
   * Handle Settlement Phase Transition
   */
  const handleSettlementPhase = useCallback(() => {
    console.log('TODO: Settlement Phase Transition')
  }, [])

  return (
    <div className="flex flex-col gap-2 h-full relative">
      {/* Action Buttons */}
      <div className="flex justify-between pointer-events-none">
        <Button
          variant="destructive"
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
          onClick={handleSettlementPhase}
          disabled={true}
          className="pointer-events-auto"
          title="Proceed to Settlement Phase">
          Settlement Phase <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 flex-1">
        {/* Left Column - Monster and Survivors */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Turn Card - Mobile: above monster card */}
          <div className="lg:hidden">
            <TurnCard
              saveSelectedShowdown={saveSelectedShowdown}
              selectedShowdown={selectedShowdown}
              survivors={survivors}
            />
          </div>

          {/* Monster Card */}
          <ShowdownMonsterCard
            saveSelectedShowdown={saveSelectedShowdown}
            selectedShowdown={selectedShowdown}
          />

          {/* Showdown Party Survivors */}
          <ShowdownSurvivorsCard
            saveSelectedShowdown={saveSelectedShowdown}
            selectedShowdown={selectedShowdown}
            selectedSettlement={selectedSettlement}
            selectedSurvivor={selectedSurvivor}
            setSurvivors={setSurvivors}
            survivors={survivors}
            updateSelectedSurvivor={updateSelectedSurvivor}
          />
        </div>

        {/* Right Column - Turn Card for larger screens */}
        <div className="hidden lg:block lg:w-80">
          <TurnCard
            saveSelectedShowdown={saveSelectedShowdown}
            selectedShowdown={selectedShowdown}
            survivors={survivors}
          />
        </div>
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
