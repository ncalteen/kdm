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
import { ReactElement, useEffect, useState } from 'react'
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
  selectedSettlement: Partial<Settlement> | null
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
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[MilestonesCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.milestones?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.milestones])

  /**
   * Add Milestone
   */
  const addMilestone = () => setIsAddingNew(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of a milestone.
   *
   * @param index Milestone Index
   */
  const onRemove = (index: number) => {
    const currentMilestones = [...(selectedSettlement?.milestones || [])]

    currentMilestones.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSettlement(
      { milestones: currentMilestones },
      MILESTONE_REMOVED_MESSAGE()
    )
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

    const updatedMilestones = [...(selectedSettlement?.milestones || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedMilestones[i] = { ...updatedMilestones[i], name, event }
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedMilestones.push({ name, event, complete: false })
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedMilestones.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { milestones: updatedMilestones },
      MILESTONE_UPDATED_MESSAGE(i)
    )

    setIsAddingNew(false)
  }

  /**
   * Enables editing a milestone.
   *
   * @param index Milestone Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

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
    const updatedMilestones = [...(selectedSettlement?.milestones || [])]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      complete: checked
    }

    saveSelectedSettlement(
      { milestones: updatedMilestones },
      MILESTONE_COMPLETED_MESSAGE(checked)
    )
  }

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <BadgeCheckIcon className="h-4 w-4" />
          Milestones
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addMilestone}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Milestones List */}
      <CardContent className="p-1 pb-2">
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
                        onEdit={onEdit}
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
