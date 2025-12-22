'use client'

import { HuntBoardSpace } from '@/components/hunt/hunt-board/hunt-board-space'
import { HuntBoardToken } from '@/components/hunt/hunt-board/hunt-board-token'
import { Card, CardContent } from '@/components/ui/card'
import { HuntEventType } from '@/lib/enums'
import { getOverwhelmingDarknessLabel } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { BadgeIcon, BadgeInfoIcon, BrainIcon, SkullIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Hunt Board Component Properties
 */
interface HuntBoardProps {
  /** On Hunt Board Update */
  onHuntBoardUpdate: (
    position: number,
    eventType: HuntEventType | undefined
  ) => void
  /** On Position Update */
  onPositionUpdate: (survivorPosition: number, quarryPosition: number) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
}

/**
 * Hunt Board Component
 *
 * Displays the 13-space hunt board where survivors and quarry can be positioned.
 * Survivors can be dragged between spaces. When survivors and quarry occupy the
 * same space, the hunt ends.
 */
export function HuntBoard({
  onHuntBoardUpdate,
  onPositionUpdate,
  selectedHunt
}: HuntBoardProps): ReactElement {
  // Define hunt board spaces
  const spaces = [
    { index: 0, label: 'Start', isStart: true },
    { index: 1, label: selectedHunt?.monster?.huntBoard?.[1] ?? null },
    { index: 2, label: selectedHunt?.monster?.huntBoard?.[2] ?? null },
    { index: 3, label: selectedHunt?.monster?.huntBoard?.[3] ?? null },
    { index: 4, label: selectedHunt?.monster?.huntBoard?.[4] ?? null },
    { index: 5, label: selectedHunt?.monster?.huntBoard?.[5] ?? null },
    {
      index: 6,
      label: getOverwhelmingDarknessLabel(selectedHunt?.monster?.name)
    },
    { index: 7, label: selectedHunt?.monster?.huntBoard?.[7] ?? null },
    { index: 8, label: selectedHunt?.monster?.huntBoard?.[8] ?? null },
    { index: 9, label: selectedHunt?.monster?.huntBoard?.[9] ?? null },
    { index: 10, label: selectedHunt?.monster?.huntBoard?.[10] ?? null },
    { index: 11, label: selectedHunt?.monster?.huntBoard?.[11] ?? null },
    { index: 12, label: 'Starvation', isStarvation: true }
  ]

  /**
   * Handle Drag End
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over) {
      const spaceId = over.id as string
      const newPosition = parseInt(spaceId.replace('space-', ''))

      if (newPosition >= 0 && newPosition <= 12)
        if (active.id === 'survivors-token')
          onPositionUpdate(newPosition, selectedHunt?.monsterPosition ?? 6)
        else if (active.id === 'quarry-token')
          onPositionUpdate(selectedHunt?.survivorPosition ?? 0, newPosition)
    }
  }

  /**
   * Handle Space Click - Cycles through event types
   */
  const handleSpaceClick = (pos: number) => {
    // Skip fixed positions
    if (pos === 0 || pos === 6 || pos === 12) return

    const current =
      selectedHunt?.monster?.huntBoard?.[
        pos as keyof typeof selectedHunt.monster.huntBoard
      ]

    // Cycle: undefined -> basic -> monster -> undefined
    let newEventType: HuntEventType | undefined
    if (!current) newEventType = HuntEventType.BASIC
    else if (current === HuntEventType.BASIC)
      newEventType = HuntEventType.MONSTER
    else newEventType = undefined

    onHuntBoardUpdate(pos, newEventType)
  }

  /**
   * Get Icon for Hunt Board Space based on label
   *
   * @param label - The label of the space
   * @returns ReactElement or label string
   */
  const getLabelOrIcon = (label: HuntEventType | string | null | undefined) => {
    switch (label) {
      case 'Start':
        return 'Start'
      case 'Starvation':
        return 'Starvation'
      case HuntEventType.ARC:
        return <BrainIcon className="size-6" />
      case HuntEventType.BASIC:
        return <BadgeIcon className="size-6" />
      case HuntEventType.MONSTER:
        return <SkullIcon className="size-6" />
      case HuntEventType.SCOUT:
        return <BadgeInfoIcon className="size-6" />
      default:
        return label
    }
  }

  return (
    <Card className="p-0 w-full min-w-[430px]">
      <CardContent className="p-0 w-full overflow-x-auto">
        <DndContext onDragEnd={handleDragEnd}>
          {/* Hunt Board Grid */}
          <div className="w-full overflow-x-auto gap-1 p-2 bg-muted/30 rounded-lg relative flex flex-row flex-wrap items-center justify-center">
            {spaces.map((space) => (
              <div
                key={space.index}
                className="relative w-[75px] sm:w-[85px] md:w-[90px] h-[75px] sm:h-[85px] md:h-[90px] flex-shrink-0 flex items-center justify-center">
                <HuntBoardSpace
                  onClick={() => handleSpaceClick(space.index)}
                  className={
                    space.isStart || space.isStarvation || space.index === 6
                      ? ''
                      : 'cursor-pointer'
                  }
                  index={space.index}
                  label={getLabelOrIcon(space.label)}
                  isStart={space.isStart}
                  isStarvation={space.isStarvation}
                />

                {selectedHunt?.survivorPosition === space.index && (
                  <HuntBoardToken
                    overlap={
                      selectedHunt?.survivorPosition ===
                      selectedHunt?.monsterPosition
                    }
                    tokenType="survivors"
                  />
                )}

                {selectedHunt?.monsterPosition === space.index && (
                  <HuntBoardToken
                    overlap={
                      selectedHunt?.survivorPosition ===
                      selectedHunt?.monsterPosition
                    }
                    tokenType="quarry"
                  />
                )}
              </div>
            ))}
          </div>
        </DndContext>
      </CardContent>
    </Card>
  )
}
