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
import { Slider } from '@/components/ui/slider'
import { useSelectedTab } from '@/contexts/selected-tab-context'
import { AmbushType, MonsterType, TurnType } from '@/lib/enums'
import {
  getCampaign,
  getNextShowdownId,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { ReactElement, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { HuntMonsterCard } from '../monster/hunt-monster-card'

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
  setSelectedShowdown,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ActiveHuntCardProps): ReactElement {
  const { setSelectedTab } = useSelectedTab()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false)
  const [isShowdownDialogOpen, setIsShowdownDialogOpen] =
    useState<boolean>(false)
  const [ambushType, setAmbushType] = useState<number>(1)

  /**
   * Handle Position Update
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, monsterPosition: number) => {
      const survivorChanged =
        survivorPosition !== (selectedHunt?.survivorPosition ?? 0)

      saveSelectedHunt(
        { survivorPosition, monsterPosition },
        survivorChanged ? 'Survivors moved.' : 'Monster moved.'
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
    setIsShowdownDialogOpen(true)
  }, [])

  /**
   * Handle Proceed to Showdown
   */
  const handleProceedToShowdown = useCallback(() => {
    if (
      !selectedSettlement?.id ||
      !selectedHunt?.id ||
      !selectedHunt?.monster?.level
    )
      return

    try {
      const campaign = getCampaign()

      // Convert ambush type number to enum
      const ambushTypeMap = {
        0: AmbushType.SURVIVORS,
        1: AmbushType.NONE,
        2: AmbushType.MONSTER
      }
      const ambush = ambushTypeMap[ambushType as keyof typeof ambushTypeMap]

      // Create showdown from current hunt
      const showdown: Showdown = {
        ambush,
        id: getNextShowdownId(),
        monster: {
          accuracy: 0,
          aiDeckSize: 10,
          evasion: 0,
          knockedDown: false,
          level: selectedHunt.quarryLevel,
          luck: 0,
          moods: [],
          movement: 6,
          name: selectedHunt.quarryName!,
          speed: 0,
          strength: 0,
          toughness: 12,
          traits: [],
          type: MonsterType.QUARRY,
          wounds: 0
        },
        scout: selectedHunt.scout,
        settlementId: selectedHunt.settlementId || 0,
        survivorColors: selectedHunt.survivorColors || [],
        survivors: selectedHunt.survivors || [],
        // If survivors ambush, they go first. Otherwise, the monster does.
        turn: {
          currentTurn:
            ambush === AmbushType.SURVIVORS
              ? TurnType.SURVIVORS
              : TurnType.MONSTER,
          survivorStates: [],
          turnNumber: ambush === AmbushType.NONE ? 1 : 0
        }
      }

      // Remove the hunt and add the showdown
      const updatedHunts = campaign.hunts?.filter(
        (hunt) => hunt.id !== selectedHunt.id
      )
      const updatedShowdowns = [...(campaign.showdowns || []), showdown]

      saveCampaignToLocalStorage({
        ...campaign,
        hunts: updatedHunts,
        showdowns: updatedShowdowns
      })

      setSelectedHunt(null)
      setSelectedShowdown(showdown)
      setIsShowdownDialogOpen(false)
      setSelectedTab('showdown')

      const ambushMessage = {
        [AmbushType.SURVIVORS]: 'The survivors ambush their quarry!',
        [AmbushType.MONSTER]: 'The monster ambushes the survivors!',
        [AmbushType.NONE]: 'The hunt reaches its epic climax.'
      }

      toast.success(
        `${ambushMessage[ambushTypeMap[ambushType as keyof typeof ambushTypeMap]]} The showdown begins.`
      )
    } catch (error) {
      console.error('Showdown Creation Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }, [
    selectedSettlement?.id,
    selectedHunt,
    ambushType,
    setSelectedHunt,
    setSelectedShowdown,
    setSelectedTab
  ])

  return (
    <div className="flex flex-col gap-2 h-full relative">
      {/* Action Buttons */}
      <div className="flex justify-between pointer-events-none">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancelHunt}
          className="pointer-events-auto"
          title="End Hunt">
          <XIcon className="size-4" />
          End Hunt
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleShowdown}
          className="pointer-events-auto"
          title="Begin Showdown">
          Begin Showdown <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* Hunt Board */}
      <div className="w-full">
        <HuntBoard
          onPositionUpdate={handlePositionUpdate}
          selectedHunt={selectedHunt}
        />
      </div>

      {/* Monster Card */}
      <HuntMonsterCard
        saveSelectedHunt={saveSelectedHunt}
        selectedHunt={selectedHunt}
      />

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

      {/* Showdown Confirmation Dialog */}
      <AlertDialog
        open={isShowdownDialogOpen}
        onOpenChange={setIsShowdownDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proceed to Showdown</AlertDialogTitle>
            <AlertDialogDescription>
              The hunt will end and the showdown will begin. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Ambush Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Survivors ambush</span>
                <span>No ambush</span>
                <span>Monster ambushes</span>
              </div>
              <Slider
                value={[ambushType]}
                onValueChange={(value) => setAmbushType(value[0])}
                max={2}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToShowdown}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
