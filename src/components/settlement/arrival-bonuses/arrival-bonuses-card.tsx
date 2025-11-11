'use client'

import {
  ArrivalBonusItem,
  NewArrivalBonusItem
} from '@/components/settlement/arrival-bonuses/arrival-bonus-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NAMELESS_ARRIVAL_BONUS_ERROR,
  REMOVE_ARRIVAL_BONUS_MESSAGE,
  UPDATE_ARRIVAL_BONUS_MESSAGE
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
import { HousePlusIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Arrival Bonuses Card Card Properties
 */
interface ArrivalBonusesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Arrival Bonuses Card Component
 */
export function ArrivalBonusesCard({
  saveSelectedSettlement,
  selectedSettlement
}: ArrivalBonusesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[ArrivalBonusesCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.arrivalBonuses?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.arrivalBonuses])

  /**
   * Add Arrival Bonus
   */
  const addBonus = useCallback(() => setIsAddingNew(true), [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of a arrival bonus.
   *
   * @param index Arrival Bonus Index
   */
  const onRemove = useCallback(
    (index: number) => {
      const currentArrivalBonuses = [
        ...(selectedSettlement?.arrivalBonuses || [])
      ]
      currentArrivalBonuses.splice(index, 1)

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
          arrivalBonuses: currentArrivalBonuses
        },
        REMOVE_ARRIVAL_BONUS_MESSAGE()
      )
    },
    [selectedSettlement?.arrivalBonuses, saveSelectedSettlement]
  )

  /**
   * Handles saving arrival bonus.
   *
   * @param value Arrival Bonus Value
   * @param i Arrival Bonus Index (When Updating Only)
   */
  const onSave = useCallback(
    (value?: string, i?: number) => {
      if (!value || value.trim() === '')
        return toast.error(NAMELESS_ARRIVAL_BONUS_ERROR())

      const updatedArrivalBonuses = [
        ...(selectedSettlement?.arrivalBonuses || [])
      ]

      if (i !== undefined) {
        // Updating an existing value
        updatedArrivalBonuses[i] = value
        setDisabledInputs((prev) => ({
          ...prev,
          [i]: true
        }))
      } else {
        // Adding a new value
        updatedArrivalBonuses.push(value)
        setDisabledInputs((prev) => ({
          ...prev,
          [updatedArrivalBonuses.length - 1]: true
        }))
      }

      saveSelectedSettlement(
        {
          arrivalBonuses: updatedArrivalBonuses
        },
        UPDATE_ARRIVAL_BONUS_MESSAGE(i)
      )
      setIsAddingNew(false)
    },
    [selectedSettlement?.arrivalBonuses, saveSelectedSettlement]
  )

  /**
   * Enables editing a arrival bonus.
   *
   * @param index Arrival Bonus Index
   */
  const onEdit = useCallback(
    (index: number) =>
      setDisabledInputs((prev) => ({ ...prev, [index]: false })),
    []
  )

  /**
   * Handles the end of a drag event for reordering arrival bonuses.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = parseInt(active.id.toString())
        const newIndex = parseInt(over.id.toString())
        const newOrder = arrayMove(
          selectedSettlement?.arrivalBonuses || [],
          oldIndex,
          newIndex
        )

        saveSelectedSettlement({
          arrivalBonuses: newOrder
        })

        setDisabledInputs((prev) => {
          const next: { [key: number]: boolean } = {}

          Object.keys(prev).forEach((k) => {
            const num = parseInt(k)
            if (num === oldIndex) next[newIndex] = prev[num]
            else if (num >= newIndex && num < oldIndex)
              next[num + 1] = prev[num]
            else if (num <= newIndex && num > oldIndex)
              next[num - 1] = prev[num]
            else next[num] = prev[num]
          })

          return next
        })
      }
    },
    [selectedSettlement?.arrivalBonuses, saveSelectedSettlement]
  )

  /**
   * Handles canceling the addition of a new arrival bonus.
   */
  const handleCancelNew = useCallback(() => setIsAddingNew(false), [])

  return (
    <Card className="p-0 pb-1 border-1 w-full gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <HousePlusIcon className="h-4 w-4" aria-hidden="true" />
          Arrival Bonuses
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addBonus}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }
                aria-label="Add new arrival bonus"
                name="add-arrival-bonus"
                id="add-arrival-bonus">
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Arrival Bonuses List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div
            className="flex-1 overflow-y-auto"
            role="list"
            aria-label="Arrival bonuses list">
            {(selectedSettlement?.arrivalBonuses || []).length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.arrivalBonuses || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.arrivalBonuses || []).map(
                    (bonus, index) => (
                      <ArrivalBonusItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={onSave}
                        onEdit={onEdit}
                        selectedSettlement={selectedSettlement}
                      />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewArrivalBonusItem onSave={onSave} onCancel={handleCancelNew} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
