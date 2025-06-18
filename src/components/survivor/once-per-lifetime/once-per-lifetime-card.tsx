'use client'

import {
  NewOncePerLifetimeItem,
  OncePerLifetimeItem
} from '@/components/survivor/once-per-lifetime/once-per-lifetime-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
import { CopyCheckIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Once Per Lifetime Card Properties
 */
interface OncePerLifetimeCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Once Per Lifetime Card Component
 *
 * @param props Once Per Lifetime Card Properties
 * @returns Once Per Lifetime Card Component
 */
export function OncePerLifetimeCard({
  form,
  saveSelectedSurvivor
}: OncePerLifetimeCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Watch form state
  const oncePerLifetime = form.watch('oncePerLifetime')
  const rerollUsed = form.watch('rerollUsed')

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      oncePerLifetime?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [oncePerLifetime])

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
    const currentOncePerLifetime = [...(oncePerLifetime || [])]
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
      'A fleeting moment fades back into darkness.'
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
      return toast.error('A nameless event cannot be recorded.')

    const updatedOncePerLifetime = [...(oncePerLifetime || [])]

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
      'A once-in-a-lifetime moment has been inscribed in memory.'
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
      const newOrder = arrayMove(oncePerLifetime || [], oldIndex, newIndex)

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
      checked
        ? 'The survivor has used their lifetime reroll.'
        : 'The survivor has regained their lifetime reroll.'
    )
  }

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
            <CopyCheckIcon className="h-4 w-4" />
            Once Per Lifetime
            {!isAddingNew && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addOncePerLifetime}
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
        </div>
      </CardHeader>

      {/* Once Per Lifetime List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[55px]">
          <div className="flex-1 overflow-y-auto">
            {oncePerLifetime?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(oncePerLifetime || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(oncePerLifetime || []).map((event, index) => (
                    <OncePerLifetimeItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(value, i) => onSave(value, i)}
                      onEdit={onEdit}
                    />
                  ))}
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
                checked={!!rerollUsed}
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
