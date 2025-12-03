'use client'

import {
  DepartingBonusItem,
  NewDepartingBonusItem
} from '@/components/settlement/departing-bonuses/departing-bonus-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DEPARTING_BONUS_REMOVED_MESSAGE,
  DEPARTING_BONUS_UPDATED_MESSAGE,
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
import { MapPinPlusIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Departing Bonuses Card Properties
 */
interface DepartingBonusesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Departing Bonuses Card Component
 *
 * @param props Departing Bonuses Card Properties
 * @returns Departing Bonuses Card Component
 */
export function DepartingBonusesCard({
  selectedSettlement,
  saveSelectedSettlement
}: DepartingBonusesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.departingBonuses || []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Add Departing Bonus
   */
  const addBonus = () => setIsAddingNew(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of a departing bonus.
   *
   * @param index Departing Bonus Index
   */
  const onRemove = (index: number) => {
    const currentDepartingBonuses = [
      ...(selectedSettlement?.departingBonuses || [])
    ]
    currentDepartingBonuses.splice(index, 1)

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
      { departingBonuses: currentDepartingBonuses },
      DEPARTING_BONUS_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving departing bonus.
   *
   * @param value Departing Bonus Value
   * @param i Departing Bonus Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('departing bonus'))

    const updatedDepartingBonuses = [
      ...(selectedSettlement?.departingBonuses || [])
    ]

    if (i !== undefined) {
      // Updating an existing value
      updatedDepartingBonuses[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedDepartingBonuses.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedDepartingBonuses.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { departingBonuses: updatedDepartingBonuses },
      DEPARTING_BONUS_UPDATED_MESSAGE(i)
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a departing bonus.
   *
   * @param index Departing Bonus Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering departing bonuses.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.departingBonuses || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ departingBonuses: newOrder })

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
    <Card className="p-0 pb-1 border-1 w-full gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <MapPinPlusIcon className="h-4 w-4" />
          Departure Bonuses
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
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Departing Bonuses List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.departingBonuses?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.departingBonuses || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.departingBonuses || []).map(
                    (bonus, index) => (
                      <DepartingBonusItem
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
              <NewDepartingBonusItem
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
