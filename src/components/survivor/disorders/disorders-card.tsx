'use client'

import {
  DisorderItem,
  NewDisorderItem
} from '@/components/survivor/disorders/disorder-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SURVIVOR_DISORDER_LIMIT_EXCEEDED_ERROR_MESSAGE,
  SURVIVOR_DISORDER_REMOVED_MESSAGE,
  SURVIVOR_DISORDER_UPDATED_MESSAGE
} from '@/lib/messages'
import { Survivor } from '@/schemas/survivor'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

const MAX_DISORDERS = 3

/**
 * Disorders Card Properties
 */
interface DisordersCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Disorders Card Component
 */
export function DisordersCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: DisordersCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[DisordersCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSurvivor?.disorders?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSurvivor?.disorders])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addDisorder = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedDisorders Updated Disorders
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedDisorders: string[],
    successMsg?: string
  ) => {
    saveSelectedSurvivor(
      {
        disorders: updatedDisorders
      },
      successMsg
    )

    setIsAddingNew(false)
  }

  /**
   * Handles the removal of a disorder.
   *
   * @param index Disorder Index
   */ const onRemove = (index: number) => {
    const currentDisorders = [...(selectedSurvivor?.disorders || [])]
    currentDisorders.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentDisorders, SURVIVOR_DISORDER_REMOVED_MESSAGE())
  }

  /**
   * Handles saving a new disorder.
   *
   * @param value Disorder Value
   * @param i Disorder Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('disorder'))

    if (
      i === undefined &&
      (selectedSurvivor?.disorders?.length || 0) >= MAX_DISORDERS
    )
      return toast.error(SURVIVOR_DISORDER_LIMIT_EXCEEDED_ERROR_MESSAGE())

    const updatedDisorders = [...(selectedSurvivor?.disorders || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedDisorders[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedDisorders.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedDisorders.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedDisorders,
      SURVIVOR_DISORDER_UPDATED_MESSAGE(i === undefined)
    )
  }

  /**
   * Enables editing a value.
   *
   * @param index Disorder Index
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
        selectedSurvivor?.disorders || [],
        oldIndex,
        newIndex
      )

      saveToLocalStorage(newOrder)

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
    <Card className="p-2 border-0 gap-0">
      {/* Title */}
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-sm flex flex-row items-center justify-between h-8">
          Disorders
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addDisorder}
              className="h-6 w-6"
              disabled={
                isAddingNew ||
                (selectedSurvivor?.disorders?.length || 0) >= MAX_DISORDERS ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Disorders List */}
      <CardContent className="p-0">
        <div className="flex flex-col h-27">
          {selectedSurvivor?.disorders?.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={(selectedSurvivor?.disorders || []).map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {(selectedSurvivor?.disorders || []).map((disorder, index) => (
                  <DisorderItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    onRemove={onRemove}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(value, i) => onSave(value, i)}
                    onEdit={onEdit}
                    selectedSurvivor={selectedSurvivor}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewDisorderItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
