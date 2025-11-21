'use client'

import { MonsterCalculatedStats } from '@/components/showdown/showdown-monster/monster-calculated-stats'
import { SurvivorCalculatedStats } from '@/components/showdown/showdown-survivors/survivor-calculated-stats'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { AmbushType, TurnType } from '@/lib/enums'
import { SHOWDOWN_TURN_MESSAGE } from '@/lib/messages'
import {
  MonsterTurnState,
  Showdown,
  SurvivorTurnState
} from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { CheckCircleIcon, SkullIcon, UsersIcon, ZapIcon } from 'lucide-react'
import { ReactElement, useCallback, useMemo } from 'react'

/**
 * Turn Card Properties
 */
interface TurnCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Turn Card Component
 *
 * Manages turn alternation between Monster and Survivor turns.
 * During Survivor turns, tracks movement and activation usage for each survivor.
 *
 * @param props Turn Card Properties
 * @returns Turn Card Component
 */
export function TurnCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedSurvivor
}: TurnCardProps): ReactElement {
  /**
   * Get active survivor's turn state
   */
  const selectedSurvivorTurnState = useMemo(() => {
    if (!selectedSurvivor?.id || !selectedShowdown) return null

    return (
      selectedShowdown.turn?.survivorStates?.find(
        (state) => state.id === selectedSurvivor.id
      ) || {
        id: selectedSurvivor.id,
        movementUsed: false,
        activationUsed: false
      }
    )
  }, [selectedSurvivor?.id, selectedShowdown])

  /**
   * Switch Turn
   */
  const switchTurn = useCallback(() => {
    if (!selectedShowdown) return

    const currentTurn = selectedShowdown.turn?.currentTurn || TurnType.MONSTER

    // If the showdown starts with an ambush, the next turn is monster
    // (regardless of who ambushed whom). Otherwise, switch turns normally. E.g.
    // if the monster ambushes, it gets to go twice.
    const nextTurn =
      selectedShowdown.ambush === AmbushType.SURVIVORS ||
      selectedShowdown.ambush === AmbushType.MONSTER
        ? TurnType.MONSTER
        : currentTurn === TurnType.MONSTER
          ? TurnType.SURVIVORS
          : TurnType.MONSTER

    // If switching to survivors turn, reset all survivor turn states.
    const survivorStates =
      nextTurn === TurnType.SURVIVORS
        ? selectedShowdown.survivors?.map((survivorId) => ({
            id: survivorId,
            movementUsed: false,
            activationUsed: false
          })) || []
        : selectedShowdown.turn?.survivorStates || []

    saveSelectedShowdown(
      {
        // Always clear ambush (it only applies to the first turn).
        ambush: AmbushType.NONE,
        turn: {
          currentTurn: nextTurn,
          monsterState: selectedShowdown.turn?.monsterState || {
            aiCardDrawn: false
          },
          survivorStates
        }
      },
      SHOWDOWN_TURN_MESSAGE(nextTurn)
    )
  }, [selectedShowdown, saveSelectedShowdown])

  /**
   * Update Survivor Turn State
   */
  const updateSurvivorTurnState = useCallback(
    (survivorId: number, updates: Partial<SurvivorTurnState>) => {
      if (!selectedShowdown) return

      const currentStates = selectedShowdown.turn?.survivorStates || []
      const updatedStates = currentStates.map((state) =>
        state.id === survivorId ? { ...state, ...updates } : state
      )

      // If this survivor isn't in the states yet, add them
      if (!currentStates.find((state) => state.id === survivorId)) {
        updatedStates.push({
          id: survivorId,
          movementUsed: false,
          activationUsed: false,
          ...updates
        })
      }

      saveSelectedShowdown({
        turn: {
          currentTurn: selectedShowdown.turn?.currentTurn || TurnType.MONSTER,
          monsterState: selectedShowdown.turn?.monsterState || {
            aiCardDrawn: false
          },
          survivorStates: updatedStates
        }
      })
    },
    [selectedShowdown, saveSelectedShowdown]
  )

  /**
   * Update Monster Turn State
   */
  const updateMonsterTurnState = useCallback(
    (updates: Partial<MonsterTurnState>) => {
      if (!selectedShowdown) return

      const currentState = selectedShowdown.turn?.monsterState || {}

      saveSelectedShowdown({
        turn: {
          currentTurn: selectedShowdown.turn?.currentTurn || TurnType.MONSTER,
          survivorStates: selectedShowdown.turn?.survivorStates || [],
          monsterState: { ...currentState, ...updates }
        }
      })
    },
    [selectedShowdown, saveSelectedShowdown]
  )

  const isMonsterTurn = selectedShowdown?.turn?.currentTurn === TurnType.MONSTER

  return (
    <Card className="h-full min-w-[300px] gap-2 flex flex-col justify-between">
      <div>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg flex items-center gap-2">
            {isMonsterTurn ? (
              <>
                <SkullIcon className="h-5 w-5" />
                Monster Turn
              </>
            ) : (
              <>
                <UsersIcon className="h-5 w-5" />
                Survivors&apos; Turn
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Survivor Turn Content */}
          {!isMonsterTurn && (
            <div className="space-y-3">
              <div className="space-y-2">
                {/* Survivor Name */}
                <div className="font-medium text-sm text-center h-6">
                  {selectedSurvivor?.name || 'No Survivor Selected'}
                  {selectedSurvivor?.id === selectedShowdown?.scout && (
                    <Badge variant="outline" className="ml-2">
                      Scout
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Movement */}
                  <div className="flex items-center space-x-2">
                    <Toggle
                      size="sm"
                      variant="outline"
                      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500 w-[120px]"
                      pressed={selectedSurvivorTurnState?.movementUsed}
                      onPressedChange={(pressed: boolean) =>
                        selectedSurvivor
                          ? updateSurvivorTurnState(selectedSurvivor.id!, {
                              movementUsed: !!pressed
                            })
                          : null
                      }>
                      <CheckCircleIcon className="h-3 w-3" />
                      Move
                    </Toggle>
                  </div>

                  {/* Activation */}
                  <div className="flex items-center space-x-2">
                    <Toggle
                      size="sm"
                      variant="outline"
                      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500 w-[120px]"
                      pressed={selectedSurvivorTurnState?.activationUsed}
                      onPressedChange={(pressed: boolean) =>
                        selectedSurvivor
                          ? updateSurvivorTurnState(selectedSurvivor.id!, {
                              activationUsed: !!pressed
                            })
                          : null
                      }>
                      <CheckCircleIcon className="h-3 w-3" />
                      Activate
                    </Toggle>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Calculated Stats */}
              <SurvivorCalculatedStats
                selectedShowdown={selectedShowdown}
                selectedSurvivor={selectedSurvivor}
              />
            </div>
          )}

          {/* Monster Turn Content */}
          {isMonsterTurn && (
            <div className="space-y-3">
              <div className="space-y-2">
                {/* Survivor Name */}
                <div className="font-medium text-sm text-center h-6">
                  Targeting: {selectedSurvivor?.name || 'No Survivor Selected'}
                  {selectedSurvivor?.id === selectedShowdown?.scout && (
                    <Badge variant="outline" className="ml-2">
                      Scout
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                  {/* AI Card */}
                  <div className="flex items-center space-x-2">
                    <Toggle
                      size="sm"
                      variant="outline"
                      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500 w-[120px]"
                      pressed={selectedShowdown?.turn.monsterState?.aiCardDrawn}
                      onPressedChange={(pressed: boolean) =>
                        selectedShowdown
                          ? updateMonsterTurnState({
                              aiCardDrawn: !!pressed
                            })
                          : null
                      }>
                      <CheckCircleIcon className="h-3 w-3" />
                      AI Card
                    </Toggle>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Calculated Stats */}
              <MonsterCalculatedStats
                selectedShowdown={selectedShowdown}
                selectedSurvivor={selectedSurvivor}
              />
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="flex flex-col gap-2">
        <Separator />

        {/* Turn Switch Button */}
        <Button
          onClick={switchTurn}
          variant={isMonsterTurn ? 'default' : 'secondary'}
          className="w-full">
          {isMonsterTurn ? (
            <>
              <UsersIcon className="h-4 w-4 mr-2" />
              End Monster Turn
            </>
          ) : (
            <>
              <ZapIcon className="h-4 w-4 mr-2" />
              End Survivor Turn
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
