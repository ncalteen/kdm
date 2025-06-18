'use client'

import { HuntBoardSpace } from '@/components/hunt/hunt-board/hunt-board-space'
import { QuarryToken } from '@/components/hunt/hunt-board/quarry-token'
import { SurvivorToken } from '@/components/hunt/hunt-board/survivor-token'
import { Hunt } from '@/schemas/hunt'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Skull, Users } from 'lucide-react'
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
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Hunt Board</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag the survivor and quarry tokens to move them across the hunt
            board.
          </p>
        </div>

        {/* Hunt Board Grid */}
        <div className="flex gap-1 p-4 bg-muted/30 rounded-lg relative overflow-x-auto">
          {spaces.map((space) => (
            <div
              key={space.index}
              className="relative flex-1 min-w-[100px] h-[100px] items-center justify-center">
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

        {/* Hunt Status */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-2 h-2 text-white" />
                </div>
                <span>Survivors: Space {selectedHunt?.survivorPosition}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Skull className="w-2 h-2 text-white" />
                </div>
                <span>
                  Quarry ({selectedHunt?.quarryName}): Space{' '}
                  {selectedHunt?.quarryPosition}
                </span>
              </div>
            </div>

            {selectedHunt?.survivorPosition ===
              selectedHunt?.quarryPosition && (
              <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-800 dark:text-yellow-200">
                <strong>Hunt Complete!</strong> Survivors and quarry occupy the
                same space.
                {selectedHunt?.ambush ? ' This was an ambush!' : ''}
              </div>
            )}

            {selectedHunt?.survivorPosition === 12 && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-800 dark:text-red-200">
                <strong>Starvation!</strong> The survivors have reached the
                starvation space. The hunt is over.
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
