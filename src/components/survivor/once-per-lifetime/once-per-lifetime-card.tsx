'use client'

import {
  NewOncePerLifetimeItem,
  OncePerLifetimeItem
} from '@/components/survivor/once-per-lifetime/once-per-lifetime-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SURVIVOR_LIFETIME_REROLL_USED_UPDATED_MESSAGE,
  SURVIVOR_ONCE_PER_LIFETIME_EVENT_REMOVED_MESSAGE,
  SURVIVOR_ONCE_PER_LIFETIME_EVENT_UPDATED_MESSAGE
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
 * Once Per Lifetime Card Properties
 */
interface OncePerLifetimeCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Once Per Lifetime Card Component
 *
 * @param props Once Per Lifetime Card Properties
 * @returns Once Per Lifetime Card Component
 */
export function OncePerLifetimeCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: OncePerLifetimeCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[OncePerLifetimeCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSurvivor?.oncePerLifetime?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSurvivor?.oncePerLifetime])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addOncePerLifetime = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedOncePerLifetime Updated Once Per Lifetime
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedOncePerLifetime: string[],
    updatedRerollUsed?: boolean,
    successMsg?: string
  ) => {
    const updateData: Partial<Survivor> = {
      oncePerLifetime: updatedOncePerLifetime
    }

    if (updatedRerollUsed !== undefined)
      updateData.rerollUsed = updatedRerollUsed

    saveSelectedSurvivor(updateData, successMsg)
    setIsAddingNew(false)
  }

  /**
   * Handles the removal of a once per lifetime event.
   *
   * @param index Event Index
   */
  const onRemove = (index: number) => {
    const currentOncePerLifetime = [
      ...(selectedSurvivor?.oncePerLifetime || [])
    ]
    currentOncePerLifetime.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(
      currentOncePerLifetime,
      undefined,
      SURVIVOR_ONCE_PER_LIFETIME_EVENT_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving a new once per lifetime event.
   *
   * @param value Event Value
   * @param i Event Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(
        NAMELESS_OBJECT_ERROR_MESSAGE('once per lifetime event')
      )

    const updatedOncePerLifetime = [
      ...(selectedSurvivor?.oncePerLifetime || [])
    ]

    if (i !== undefined) {
      // Updating an existing value
      updatedOncePerLifetime[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedOncePerLifetime.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedOncePerLifetime.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedOncePerLifetime,
      undefined,
      SURVIVOR_ONCE_PER_LIFETIME_EVENT_UPDATED_MESSAGE()
    )
  }

  /**
   * Enables editing a value.
   *
   * @param index Event Index
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
        selectedSurvivor?.oncePerLifetime || [],
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

  /**
   * Handle toggling the rerollUsed checkbox
   */
  const handleRerollUsedToggle = (checked: boolean) => {
    saveSelectedSurvivor(
      { rerollUsed: checked },
      SURVIVOR_LIFETIME_REROLL_USED_UPDATED_MESSAGE(checked)
    )
  }

  return (
    <Card className="p-2 border-0 gap-0">
      {/* Title */}
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-sm flex flex-row items-center justify-between h-8">
          Once Per Lifetime
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOncePerLifetime}
                className="h-6 w-6"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Once Per Lifetime List */}
      <CardContent className="p-0">
        <div className="flex flex-col h-25">
          <div className="flex-1 overflow-y-auto">
            {selectedSurvivor?.oncePerLifetime?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSurvivor?.oncePerLifetime || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSurvivor?.oncePerLifetime || []).map(
                    (event, index) => (
                      <OncePerLifetimeItem
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
              <NewOncePerLifetimeItem
                onSave={onSave}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>

          {/* Reroll Used - Bottom Right */}
          <div className="flex justify-end mt-2 pr-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rerollUsed"
                checked={!!selectedSurvivor?.rerollUsed}
                onCheckedChange={handleRerollUsedToggle}
              />
              <Label htmlFor="rerollUsed" className="text-xs cursor-pointer">
                Reroll Used
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
