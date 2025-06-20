'use client'

import { HuntBoardSpace } from '@/components/hunt/hunt-board/hunt-board-space'
import { QuarryToken } from '@/components/hunt/hunt-board/quarry-token'
import { SurvivorToken } from '@/components/hunt/hunt-board/survivor-token'
import { Card, CardContent } from '@/components/ui/card'
import { Hunt } from '@/schemas/hunt'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { ReactElement } from 'react'

/**
 * Hunt Board Component Properties
 */
interface HuntBoardProps {
  /** On Position Update */
  onPositionUpdate: (survivorPosition: number, quarryPosition: number) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
}

/**
 * Hunt Board Component
 *
 * Displays the 13-space hunt board where survivors and quarry can be positioned.
 * Survivors can be dragged between spaces. When survivors and quarry occupy the
 * same space, the hunt ends.
 */
export function HuntBoard({
  onPositionUpdate,
  selectedHunt
}: HuntBoardProps): ReactElement {
  // Define hunt board spaces
  const spaces = [
    { index: 0, label: 'Start', isStart: true },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 5 },
    { index: 6, label: 'Overwhelming Darkness' },
    { index: 7 },
    { index: 8 },
    { index: 9 },
    { index: 10 },
    { index: 11 },
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
        if (active.id === 'survivor-token')
          onPositionUpdate(newPosition, selectedHunt?.quarryPosition ?? 6)
        else if (active.id === 'quarry-token')
          onPositionUpdate(selectedHunt?.survivorPosition ?? 0, newPosition)
    }
  }

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <DndContext onDragEnd={handleDragEnd}>
          {/* Hunt Board Grid */}
          <div className="w-full overflow-x-auto">
            <div className="gap-0.5 md:gap-1 p-2 md:p-4 bg-muted/30 rounded-lg relative">
              {spaces.map((space) => (
                <div
                  key={space.index}
                  className="relative w-[60px] sm:w-[80px] md:w-[100px] h-[60px] sm:h-[80px] md:h-[100px] flex-shrink-0 flex items-center justify-center">
                  <HuntBoardSpace
                    index={space.index}
                    label={space.label ?? ''}
                    isStart={space.isStart}
                    isStarvation={space.isStarvation}
                  />
                  {/* Show draggable tokens on their current spaces */}
                  {selectedHunt?.survivorPosition === space.index && (
                    <SurvivorToken
                      overlap={
                        selectedHunt?.survivorPosition ===
                        selectedHunt?.quarryPosition
                      }
                    />
                  )}
                  {selectedHunt?.quarryPosition === space.index && (
                    <QuarryToken
                      overlap={
                        selectedHunt?.survivorPosition ===
                        selectedHunt?.quarryPosition
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DndContext>
      </CardContent>
    </Card>
  )
}
