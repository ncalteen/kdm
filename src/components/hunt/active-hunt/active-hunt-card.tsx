'use client'

import { HuntBoard } from '@/components/hunt/hunt-board/hunt-board'
import { HuntMonsterCard } from '@/components/hunt/hunt-monster/hunt-monster-card'
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
import { AmbushType, TabType, TurnType } from '@/lib/enums'
import {
  AMBUSH_MESSAGE,
  ERROR_MESSAGE,
  HUNT_DELETED_MESSAGE,
  MONSTER_MOVED_MESSAGE,
  SURVIVORS_MOVED_MESSAGE
} from '@/lib/messages'
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

/**
 * Active Hunt Card Properties
 */
interface ActiveHuntCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Active Hunt Card Component
 *
 * @param props Active Hunt Card Properties
 * @returns Active Hunt Card Component
 */
export function ActiveHuntCard({
  saveSelectedHunt,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSelectedHunt,
  setSelectedShowdown,
  setSelectedSurvivor,
  setSelectedTab,
  setSurvivors,
  survivors
}: ActiveHuntCardProps): ReactElement {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false)
  const [isShowdownDialogOpen, setIsShowdownDialogOpen] =
    useState<boolean>(false)
  const [ambushType, setAmbushType] = useState<number>(1)

  /**
   * Handle Position Update
   */
  const handlePositionUpdate = useCallback(
    (survivorPosition: number, monsterPosition: number) =>
      saveSelectedHunt(
        { survivorPosition, monsterPosition },
        survivorPosition !== (selectedHunt?.survivorPosition ?? 0)
          ? SURVIVORS_MOVED_MESSAGE()
          : MONSTER_MOVED_MESSAGE()
      ),
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
      setIsCancelDialogOpen(false)

      toast.success(HUNT_DELETED_MESSAGE())
    } catch (error) {
      console.error('Delete Hunt Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }, [selectedHunt?.id, setSelectedHunt])

  /**
   * Handle Showdown
   */
  const handleShowdown = useCallback(() => setIsShowdownDialogOpen(true), [])

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
      const ambush =
        {
          0: AmbushType.SURVIVORS,
          1: AmbushType.NONE,
          2: AmbushType.MONSTER
        }[ambushType] || AmbushType.NONE

      // Create showdown from current hunt
      const showdown: Showdown = {
        ambush,
        id: getNextShowdownId(),
        monster: {
          accuracy: selectedHunt.monster.accuracy,
          accuracyTokens: selectedHunt.monster.accuracyTokens,
          aiDeckSize: selectedHunt.monster.aiDeckSize,
          damage: selectedHunt.monster.damage,
          damageTokens: selectedHunt.monster.damageTokens,
          evasion: selectedHunt.monster.evasion,
          evasionTokens: selectedHunt.monster.evasionTokens,
          knockedDown: selectedHunt.monster.knockedDown,
          level: selectedHunt.monster.level,
          luck: selectedHunt.monster.luck,
          luckTokens: selectedHunt.monster.luckTokens,
          moods: selectedHunt.monster.moods || [],
          movement: selectedHunt.monster.movement,
          movementTokens: selectedHunt.monster.movementTokens,
          name: selectedHunt.monster.name,
          notes: selectedHunt.monster.notes || '',
          speed: selectedHunt.monster.speed,
          speedTokens: selectedHunt.monster.speedTokens,
          strength: selectedHunt.monster.strength,
          strengthTokens: selectedHunt.monster.strengthTokens,
          toughness: selectedHunt.monster.toughness,
          traits: selectedHunt.monster.traits || [],
          type: selectedHunt.monster.type,
          wounds: selectedHunt.monster.wounds
        },
        scout: selectedHunt.scout,
        settlementId: selectedHunt.settlementId || 0,
        survivorDetails:
          selectedHunt.survivorDetails?.map((survivor) => ({
            accuracyTokens: survivor.accuracyTokens,
            bleedingTokens: 0,
            blockTokens: 0,
            color: survivor.color,
            deflectTokens: 0,
            evasionTokens: survivor.evasionTokens,
            id: survivor.id,
            insanityTokens: survivor.insanityTokens,
            knockedDown: false,
            luckTokens: survivor.luckTokens,
            movementTokens: survivor.movementTokens,
            notes: survivor.notes || '',
            priorityTarget: false,
            speedTokens: survivor.speedTokens,
            strengthTokens: survivor.strengthTokens,
            survivalTokens: survivor.survivalTokens
          })) || [],
        survivors: selectedHunt.survivors || [],
        turn: {
          // If survivors ambush, they go first. Otherwise, the monster does.
          currentTurn:
            ambush === AmbushType.SURVIVORS
              ? TurnType.SURVIVORS
              : TurnType.MONSTER,
          survivorStates: [],
          // If there is an ambush, start at round 0 (ambush round). Otherwise,
          // start at round 1.
          round: ambush === AmbushType.NONE ? 1 : 0
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
      setSelectedTab(TabType.SHOWDOWN)

      toast.success(AMBUSH_MESSAGE(ambushType))
    } catch (error) {
      console.error('Showdown Creation Error:', error)
      toast.error(ERROR_MESSAGE())
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
      <HuntBoard
        onPositionUpdate={handlePositionUpdate}
        selectedHunt={selectedHunt}
      />

      {/* Monster Card */}
      <HuntMonsterCard
        saveSelectedHunt={saveSelectedHunt}
        selectedHunt={selectedHunt}
      />

      {/* Hunt Party Survivors */}
      <HuntSurvivorsCard
        saveSelectedHunt={saveSelectedHunt}
        saveSelectedSurvivor={saveSelectedSurvivor}
        selectedHunt={selectedHunt}
        selectedSettlement={selectedSettlement}
        selectedSurvivor={selectedSurvivor}
        setSelectedSurvivor={setSelectedSurvivor}
        setSurvivors={setSurvivors}
        survivors={survivors}
      />

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
                This action cannot be undone. Any changes to the settlement or
                survivors will be retained.
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
              The hunt will end and the showdown will begin.{' '}
              <strong>
                This action cannot be undone. Any changes to the settlement,
                survivors, or monster will be retained.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Ambush Selection */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Survivors Ambush</span>
              <span>No Ambush</span>
              <span>Monster Ambushes</span>
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
