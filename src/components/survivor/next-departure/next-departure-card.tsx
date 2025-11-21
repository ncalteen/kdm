'use client'

import {
  NewNextDepartureItem,
  NextDepartureItem
} from '@/components/survivor/next-departure/next-departure-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SURVIVOR_NEXT_DEPARTURE_BONUS_REMOVED_MESSAGE,
  SURVIVOR_NEXT_DEPARTURE_BONUS_UPDATED_MESSAGE
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

/**
 * Next Departure Card Properties
 */
interface NextDepartureCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Next Departure Card Component
 *
 * @param props Next Departure Card Properties
 * @returns Next Departure Card Component
 */
export function NextDepartureCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: NextDepartureCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[NextDepartureCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      ;(selectedSurvivor?.nextDeparture || []).forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSurvivor?.nextDeparture])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addItem = () => setIsAddingNew(true)

  /**
   * Handles the removal of a next departure.
   *
   * @param index Next Departure Index
   */
  const onRemove = (index: number) => {
    const currentNextDeparture = [...(selectedSurvivor?.nextDeparture || [])]
    currentNextDeparture.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSurvivor(
      { nextDeparture: currentNextDeparture },
      SURVIVOR_NEXT_DEPARTURE_BONUS_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving a new next departure.
   *
   * @param value Next Departure Value
   * @param i Next Departure Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('next departure bonus'))

    const updatedNextDeparture = [...(selectedSurvivor?.nextDeparture || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedNextDeparture[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedNextDeparture.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedNextDeparture.length - 1]: true
      }))
    }

    saveSelectedSurvivor(
      { nextDeparture: updatedNextDeparture },
      SURVIVOR_NEXT_DEPARTURE_BONUS_UPDATED_MESSAGE(i === undefined)
    )

    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Next Departure Index
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
        selectedSurvivor?.nextDeparture || [],
        oldIndex,
        newIndex
      )

      saveSelectedSurvivor({ nextDeparture: newOrder })

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
          Next Departure
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addItem}
              className="h-6 w-6"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Next Departure List */}
      <CardContent className="p-0">
        <div className="flex flex-col h-22">
          <div className="flex-1 overflow-y-auto">
            {(selectedSurvivor?.nextDeparture || []).length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSurvivor?.nextDeparture || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSurvivor?.nextDeparture || []).map(
                    (item, index) => (
                      <NextDepartureItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={(value, i) => onSave(value, i)}
                        onEdit={onEdit}
                        selectedSurvivor={selectedSurvivor}
                      />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewNextDepartureItem
                onSave={onSave}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
