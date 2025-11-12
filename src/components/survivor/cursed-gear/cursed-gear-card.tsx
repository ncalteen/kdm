'use client'

import {
  CursedGearItem,
  NewCursedGearItem
} from '@/components/survivor/cursed-gear/cursed-gear-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SURVIVOR_CURSED_GEAR_REMOVED_MESSAGE,
  SURVIVOR_CURSED_GEAR_UPDATED_MESSAGE
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
import { BadgeMinusIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Cursed Gear Card Properties
 */
interface CursedGearCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Cursed Gear Card Component
 *
 * @param props Cursed Gear Card Properties
 * @returns Cursed Gear Card Component
 */
export function CursedGearCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: CursedGearCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[CursedGearCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      ;(selectedSurvivor?.cursedGear || []).forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSurvivor?.cursedGear])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addItem = () => setIsAddingNew(true)

  /**
   * Handles the removal of a cursed gear.
   *
   * @param index Cursed Gear Index
   */
  const onRemove = (index: number) => {
    const currentCursedGear = [...(selectedSurvivor?.cursedGear || [])]
    currentCursedGear.splice(index, 1)

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
      { cursedGear: currentCursedGear },
      SURVIVOR_CURSED_GEAR_REMOVED_MESSAGE(selectedSurvivor?.name)
    )
  }

  /**
   * Handles saving a new cursed gear.
   *
   * @param value Cursed Gear Value
   * @param i Cursed Gear Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('cursed gear'))

    const updatedCursedGear = [...(selectedSurvivor?.cursedGear || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedCursedGear[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedCursedGear.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedCursedGear.length - 1]: true
      }))
    }

    saveSelectedSurvivor(
      { cursedGear: updatedCursedGear },
      SURVIVOR_CURSED_GEAR_UPDATED_MESSAGE(
        selectedSurvivor?.name,
        i === undefined
      )
    )

    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Cursed Gear Index
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
        selectedSurvivor?.cursedGear || [],
        oldIndex,
        newIndex
      )

      saveSelectedSurvivor({ cursedGear: newOrder })

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
          <BadgeMinusIcon className="h-4 w-4" />
          Cursed Gear
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addItem}
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

      {/* Cursed Gear List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[125px]">
          <div className="flex-1 overflow-y-auto">
            {(selectedSurvivor?.cursedGear || []).length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSurvivor?.cursedGear || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSurvivor?.cursedGear || []).map((item, index) => (
                    <CursedGearItem
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
              <NewCursedGearItem
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
