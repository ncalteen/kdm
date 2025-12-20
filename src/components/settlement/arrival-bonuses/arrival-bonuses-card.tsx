'use client'

import {
  ArrivalBonusItem,
  NewArrivalBonusItem
} from '@/components/settlement/arrival-bonuses/arrival-bonus-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ARRIVAL_BONUS_REMOVED_MESSAGE,
  ARRIVAL_BONUS_UPDATED_MESSAGE,
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
import { HousePlusIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
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
  selectedSettlement: Settlement | null
}

/**
 * Arrival Bonuses Card Component
 *
 * @param props Arrival Bonuses Card Card Properties
 * @returns Arrival Bonuses Card Component
 */
export function ArrivalBonusesCard({
  saveSelectedSettlement,
  selectedSettlement
}: ArrivalBonusesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.arrivalBonuses || []).map((_, i) => [i, true])
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
        (selectedSettlement?.arrivalBonuses || []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Handles the removal of a arrival bonus.
   *
   * @param index Arrival Bonus Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.arrivalBonuses || [])]
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

    saveSelectedSettlement(
      { arrivalBonuses: current },
      ARRIVAL_BONUS_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving arrival bonus.
   *
   * @param value Arrival Bonus Value
   * @param i Arrival Bonus Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('arrival bonus'))

    const updated = [...(selectedSettlement?.arrivalBonuses || [])]

    if (i !== undefined) {
      // Updating an existing value
      updated[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updated.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updated.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { arrivalBonuses: updated },
      ARRIVAL_BONUS_UPDATED_MESSAGE(i)
    )
    setIsAddingNew(false)
  }

  /**
   * Handles the end of a drag event for reordering arrival bonuses.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.arrivalBonuses || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ arrivalBonuses: newOrder })

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
    <Card className="p-0 border-1 gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <HousePlusIcon className="h-4 w-4" />
          Arrival Bonuses
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

      {/* Arrival Bonuses List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div className="flex-1 overflow-y-auto">
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
                        onSave={(value, i) => onSave(value, i)}
                        onEdit={() =>
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [index]: false
                          }))
                        }
                        selectedSettlement={selectedSettlement}
                      />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewArrivalBonusItem
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
