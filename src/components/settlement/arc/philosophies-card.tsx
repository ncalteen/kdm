'use client'

import {
  NewPhilosophyItem,
  PhilosophyItem
} from '@/components/settlement/arc/philosophy-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Philosophy } from '@/lib/enums'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  PHILOSOPHY_CREATED_MESSAGE,
  PHILOSOPHY_REMOVED_MESSAGE,
  PHILOSOPHY_UPDATED_MESSAGE
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
import { BrainCogIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Philosophies Card Properties
 */
interface PhilosophiesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Philosophies Card Component
 *
 * @param props Philosophies Card Properties
 * @returns Philosophies Card Component
 */
export function PhilosophiesCard({
  saveSelectedSettlement,
  selectedSettlement
}: PhilosophiesCardProps): ReactElement {
  const settlementIdRef = useRef<string | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.knowledges || []).map((_, i) => [i, true])
      )
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addPhilosophy = () => setIsAddingNew(true)

  /**
   * Handles the removal of a philosophy.
   *
   * @param index Philosophy Index
   */
  const onRemove = (index: number) => {
    const currentPhilosophies = [...(selectedSettlement?.philosophies || [])]
    currentPhilosophies.splice(index, 1)

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
      {
        philosophies: currentPhilosophies
      },
      PHILOSOPHY_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving a new philosophy or updating an existing one.
   *
   * @param value Philosophy Value
   * @param i Philosophy Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('philosophy'))

    const updatedPhilosophies = [...(selectedSettlement?.philosophies || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedPhilosophies[i] = value as Philosophy
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedPhilosophies.push(value as Philosophy)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedPhilosophies.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      {
        philosophies: updatedPhilosophies
      },
      i !== undefined
        ? PHILOSOPHY_UPDATED_MESSAGE()
        : PHILOSOPHY_CREATED_MESSAGE()
    )

    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Philosophy Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.philosophies || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({
        philosophies: newOrder
      })

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

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <BrainCogIcon className="h-4 w-4" />
          Philosophies
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addPhilosophy}
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

      {/* Philosophies List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="h-[200px] overflow-y-auto">
          <div className="space-y-1">
            {selectedSettlement?.philosophies?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.philosophies || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.philosophies || []).map(
                    (philosophy, index) => (
                      <PhilosophyItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={(value, i) => onSave(value, i)}
                        onEdit={onEdit}
                        selectedSettlement={selectedSettlement}
                      />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewPhilosophyItem
                onSave={(value) => onSave(value)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
