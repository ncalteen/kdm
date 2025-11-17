'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { TurnType } from '@/lib/enums'
import { SHOWDOWN_TURN_MESSAGE } from '@/lib/messages'
import { Showdown, SurvivorTurnState } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { CheckCircleIcon, SkullIcon, UsersIcon, ZapIcon } from 'lucide-react'
import { ReactElement, useCallback, useMemo } from 'react'

/**
 * Turn Card Properties
 */
interface TurnCardProps {
  /** Active Survivor */
  activeSurvivor: Survivor | null
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
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
  activeSurvivor,
  saveSelectedShowdown,
  selectedShowdown
}: TurnCardProps): ReactElement {
  /**
   * Get active survivor's turn state
   */
  const activeSurvivorTurnState = useMemo(() => {
    if (!activeSurvivor?.id || !selectedShowdown) return null

    return (
      selectedShowdown.turn?.survivorStates?.find(
        (state) => state.id === activeSurvivor.id
      ) || {
        id: activeSurvivor.id,
        movementUsed: false,
        activationUsed: false
      }
    )
  }, [activeSurvivor?.id, selectedShowdown])

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
    <Card className="h-full min-w-[300px]">
      <CardHeader className="pb-4">
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
                ? 'Survivors Turn (Ambush)'
                : `Survivor Turn (Round: ${selectedShowdown?.turn?.round})`}
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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

        {/* Survivor Turn Content */}
        {!isMonsterTurn && (
          <>
            <Separator />

            {/* Active Survivor Actions */}
            {activeSurvivor && activeSurvivorTurnState ? (
              <div className="space-y-3">
                <div className="border rounded-lg p-3 space-y-2">
                  {/* Survivor Name */}
                  <div className="font-medium text-sm">
                    {activeSurvivor.name || `Survivor ${activeSurvivor.id}`}
                    {activeSurvivor.id === selectedShowdown?.scout && (
                      <Badge variant="outline" className="ml-2">
                        Scout
                      </Badge>
                    )}
                  </div>

                  {/* Action Checkboxes */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Movement */}
                    <div className="flex items-center space-x-2">
                      <Toggle
                        id={`movement-${activeSurvivor.id}`}
                        size="sm"
                        variant="outline"
                        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500"
                        pressed={activeSurvivorTurnState.movementUsed}
                        onPressedChange={(pressed: boolean) =>
                          updateSurvivorTurnState(activeSurvivor.id!, {
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
                        id={`activation-${activeSurvivor.id}`}
                        size="sm"
                        variant="outline"
                        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:outline-green-500 data-[state=on]:*:[svg]:stroke-green-500"
                        pressed={activeSurvivorTurnState.activationUsed}
                        onPressedChange={(pressed: boolean) =>
                          updateSurvivorTurnState(activeSurvivor.id!, {
                            activationUsed: !!pressed
                          })
                        }>
                        <CheckCircleIcon className="h-3 w-3" />
                        Activate
                      </Toggle>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Select a survivor to track their actions.
              </div>
            )}
          </>
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
    </Card>
  )
}
