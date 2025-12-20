'use client'

import {
  MilestoneItem,
  NewMilestoneItem
} from '@/components/settlement/milestones/milestone-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MILESTONE_COMPLETED_MESSAGE,
  MILESTONE_MISSING_EVENT_ERROR,
  MILESTONE_REMOVED_MESSAGE,
  MILESTONE_UPDATED_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { BadgeCheckIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Milestones Card Properties
 */
interface MilestonesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Milestones Card Component
 *
 * @param props Milestones Card Properties
 * @returns Milestones Card Component
 */
export function MilestonesCard({
  saveSelectedSettlement,
  selectedSettlement
}: MilestonesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.milestones || []).map((_, i) => [i, true])
    )
  )
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.milestones || []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Handles the removal of a milestone.
   *
   * @param index Milestone Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.milestones || [])]
    current.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSettlement({ milestones: current }, MILESTONE_REMOVED_MESSAGE())
  }

  /**
   * Handles saving a new milestone or updating an existing one.
   *
   * @param name Milestone Name
   * @param event Event Description
   * @param i Milestone Index (When Updating Only)
   */
  const onSave = (name?: string, event?: string, i?: number) => {
    if (!name || name.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('milestone'))

    if (!event || event.trim() === '')
      return toast.error(MILESTONE_MISSING_EVENT_ERROR())

    const updated = [...(selectedSettlement?.milestones || [])]

    if (i !== undefined) {
      // Updating an existing value
      updated[i] = { ...updated[i], name, event }
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updated.push({ name, event, complete: false })
      setDisabledInputs((prev) => ({
        ...prev,
        [updated.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { milestones: updated },
      MILESTONE_UPDATED_MESSAGE(i)
    )
    setIsAddingNew(false)
  }

  /**
   * Handles the end of a drag event for reordering milestones.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.milestones || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ milestones: newOrder })

      setDisabledInputs((prev) => {
        const next: { [key: number]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          const num = parseInt(k)
          if (num === oldIndex) next[newIndex] = prev[num]
          else if (num >= newIndex && num < oldIndex) next[num + 1] = prev[num]
          else if (num <= newIndex && num > oldIndex) next[num - 1] = prev[num]
          else next[num] = prev[num]
        })

        return next
      })
    }
  }

  /**
   * Handles milestone completion toggle.
   *
   * @param index Milestone Index
   * @param checked Completion Status
   */
  const onToggleComplete = (index: number, checked: boolean) => {
    const updated = [...(selectedSettlement?.milestones || [])]
    updated[index] = {
      ...updated[index],
      complete: checked
    }

    saveSelectedSettlement(
      { milestones: updated },
      MILESTONE_COMPLETED_MESSAGE(checked)
    )
  }

  return (
    <Card className="p-0 border-1 gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <BadgeCheckIcon className="h-4 w-4" />
          Milestones
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddingNew(true)}
              className="border-0 h-8 w-8"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Milestones List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.milestones?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.milestones || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.milestones || []).map(
                    (milestone, index) => (
                      <MilestoneItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        milestone={milestone}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={(i, name, event) => onSave(name, event, i)}
                        onEdit={() =>
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [index]: false
                          }))
                        }
                        onToggleComplete={onToggleComplete}
                      />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewMilestoneItem
                onSave={(name, event) => onSave(name, event)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
