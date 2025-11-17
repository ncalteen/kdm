'use client'

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
import { TurnType } from '@/lib/enums'
import { SHOWDOWN_TURN_MESSAGE } from '@/lib/messages'
import { Showdown, SurvivorTurnState } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { CheckCircleIcon, SkullIcon, UsersIcon, ZapIcon } from 'lucide-react'
import { ReactElement, useCallback, useMemo } from 'react'
import { SurvivorCalculatedStats } from '../showdown-survivors/survivor-calculated-stats'

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
  selectedShowdown: Partial<Showdown> | null
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

    const currentRound = selectedShowdown.turn?.round || 1
    const currentTurn = selectedShowdown.turn?.currentTurn || TurnType.MONSTER

    // If the showdown starts with an ambush, and it is the first round, the
    // next turn is monster (regardless of who ambushed whom). Otherwise, switch
    // turns normally.
    const nextTurn =
      selectedShowdown.ambush && currentRound === 0
        ? TurnType.MONSTER
        : currentTurn === TurnType.MONSTER
          ? TurnType.SURVIVORS
          : TurnType.MONSTER

    // If switching to survivors turn, reset all survivor turn states
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
        turn: {
          currentTurn: nextTurn,
          survivorStates,
          round: selectedShowdown.turn?.round
            ? selectedShowdown.turn.round + 1
            : 1
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
          round: selectedShowdown.turn?.round || 1,
          survivorStates: updatedStates
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
                {selectedShowdown?.turn?.round === 0
                  ? 'Monster Turn (Ambush)'
                  : `Monster Turn (Round: ${selectedShowdown?.turn?.round})`}
              </>
            ) : (
              <>
                <UsersIcon className="h-5 w-5" />
                {selectedShowdown?.turn?.round === 0
                  ? "Survivors' Turn (Ambush)"
                  : `Survivors' Turn (Round: ${selectedShowdown?.turn?.round})`}
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Survivor Turn Content */}
          {!isMonsterTurn && selectedSurvivor && selectedSurvivorTurnState && (
            <div className="space-y-3">
              <div className="space-y-2">
                {/* Survivor Name */}
                <div className="font-medium text-sm text-center h-6">
                  {selectedSurvivor.name || `Survivor ${selectedSurvivor.id}`}
                  {selectedSurvivor.id === selectedShowdown?.scout && (
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
                      id={`movement-${selectedSurvivor.id}`}
                      size="sm"
                      variant="outline"
                      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500 w-[120px]"
                      pressed={selectedSurvivorTurnState.movementUsed}
                      onPressedChange={(pressed: boolean) =>
                        updateSurvivorTurnState(selectedSurvivor.id!, {
                          movementUsed: !!pressed
                        })
                      }>
                      <CheckCircleIcon className="h-3 w-3" />
                      Move
                    </Toggle>
                  </div>

                  {/* Activation */}
                  <div className="flex items-center space-x-2">
                    <Toggle
                      id={`activation-${selectedSurvivor.id}`}
                      size="sm"
                      variant="outline"
                      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500 w-[120px]"
                      pressed={selectedSurvivorTurnState.activationUsed}
                      onPressedChange={(pressed: boolean) =>
                        updateSurvivorTurnState(selectedSurvivor.id!, {
                          activationUsed: !!pressed
                        })
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
            <>
              <Separator />
              <div className="text-center text-sm text-muted-foreground py-4">
                <ZapIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                End the turn when the monster is finished.
              </div>
            </>
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
