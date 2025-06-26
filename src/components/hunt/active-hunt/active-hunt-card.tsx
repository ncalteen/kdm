'use client'

import { HuntBoard } from '@/components/hunt/hunt-board/hunt-board'
import { HuntSurvivorsCard } from '@/components/hunt/hunt-survivors/hunt-survivors-card'
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
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { ReactElement, useCallback, useState } from 'react'
import { toast } from 'sonner'

/**
 * Active Hunt Card Properties
 */
interface ActiveHuntCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Active Hunt Card Component
 *
 * @param props Active Hunt Card Properties
 * @returns Active Hunt Card Component
 */
export function ActiveHuntCard({
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSelectedHunt,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ActiveHuntCardProps): ReactElement {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false)

  /**
   * Handle Position Update
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, quarryPosition: number) => {
      const survivorChanged =
        survivorPosition !== (selectedHunt?.survivorPosition ?? 0)

      saveSelectedHunt(
        { survivorPosition, quarryPosition },
        survivorChanged ? 'Survivors moved.' : 'Quarry moved.'
      )
    },
    [selectedHunt?.survivorPosition, saveSelectedHunt]
  )

  /**
   * Handle Cancel Hunt
   */
  const handleCancelHunt = useCallback(() => setIsCancelDialogOpen(true), [])

  /**
   * Handle Delete Hunt
   */
  const handleDeleteHunt = useCallback(() => {
    if (!selectedSettlement?.id) return

    try {
      const campaign = getCampaign()

      const updatedHunts = campaign.hunts?.filter(
        (hunt) => hunt.id !== selectedHunt?.id
      )

      saveCampaignToLocalStorage({
        ...campaign,
        hunts: updatedHunts
      })

      setSelectedHunt(null)

      toast.success(
        'The hunt ends. Survivors return to the relative safety of the settlement.'
      )

      setIsCancelDialogOpen(false)
    } catch (error) {
      console.error('Delete Hunt Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }, [selectedSettlement?.id, selectedHunt?.id, setSelectedHunt])

  /**
   * Handle Showdown
   */
  const handleShowdown = useCallback(() => {
    // TODO: Implement showdown logic
    console.log('Showdown clicked')
  }, [])

  return (
    <div className="flex flex-col gap-2 h-full relative">
      {/* Action Buttons */}
      <div className="flex justify-between pointer-events-none">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleCancelHunt}
          className="pointer-events-auto"
          title="End Hunt">
          <XIcon className="size-4" />
          End Hunt
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleShowdown}
          disabled={true}
          className="pointer-events-auto"
          title="Proceed to Showdown">
          Showdown <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* Hunt Board */}
      <div className="w-full">
        <HuntBoard
          onPositionUpdate={handlePositionUpdate}
          selectedHunt={selectedHunt}
        />
      </div>

      {/* Hunt Party Survivors */}
      <div className="w-full flex flex-row flex-wrap">
        <div className="flex-1">
          <HuntSurvivorsCard
            saveSelectedHunt={saveSelectedHunt}
            selectedHunt={selectedHunt}
            selectedSettlement={selectedSettlement}
            selectedSurvivor={selectedSurvivor}
            setSurvivors={setSurvivors}
            survivors={survivors}
            updateSelectedSurvivor={updateSelectedSurvivor}
          />
        </div>
        <div className="flex-1">
          {/*
            TODO: Survivor Gear Card?
           */}
        </div>
      </div>

      {/* Cancel Hunt Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Hunt</AlertDialogTitle>
            <AlertDialogDescription>
              The hunt will end and survivors will return to the settlement.{' '}
              <strong>
                This action cannot be undone. Any changes made to your
                settlement or survivors will be retained.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteHunt}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              End Hunt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
