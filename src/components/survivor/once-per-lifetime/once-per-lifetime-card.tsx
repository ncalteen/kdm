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
import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
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
import { PlusCircleIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Once Per Lifetime Card Component
 */
export function OncePerLifetimeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const formValues = form.getValues()

  // Use ref to avoid circular dependencies in effects
  const oncePerLifetimeRef = useRef<string[]>(formValues.oncePerLifetime || [])

  // Watch for changes in the oncePerLifetime field
  const oncePerLifetime = form.watch('oncePerLifetime')

  // Update our ref when oncePerLifetime changes
  useEffect(() => {
    if (oncePerLifetime) {
      oncePerLifetimeRef.current = oncePerLifetime
    }
  }, [oncePerLifetime])

  // Use a local state to track the checkbox to avoid infinite loop
  const [rerollUsedState, setRerollUsedState] = useState<boolean>(
    !!form.getValues('rerollUsed')
  )

  // Update form value when rerollUsedState changes
  useEffect(() => {
    form.setValue('rerollUsed', rerollUsedState, { shouldDirty: true })
  }, [rerollUsedState, form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      oncePerLifetimeRef.current.forEach((_, i) => {
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
   * Handles the removal of a once per lifetime event.
   *
   * @param index Event Index
   */
  const handleRemoveOncePerLifetime = (index: number) => {
    const currentOncePerLifetime = [...oncePerLifetimeRef.current]

    currentOncePerLifetime.splice(index, 1)
    form.setValue('oncePerLifetime', currentOncePerLifetime)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    toast.success('The once per lifetime event has been removed.')
  }

  /**
   * Handles the saving of a new once per lifetime event.
   *
   * @param value Event Value
   */
  const saveOncePerLifetime = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('Please enter a once per lifetime event.')

    const newOncePerLifetime = [...oncePerLifetimeRef.current, value]

    form.setValue('oncePerLifetime', newOncePerLifetime)
    setDisabledInputs((prev) => ({
      ...prev,
      [newOncePerLifetime.length - 1]: true
    }))
    setIsAddingNew(false)

    toast.success('The once per lifetime event has been added.')
  }

  const editOncePerLifetime = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event.
   *
   * @param event Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(oncePerLifetimeRef.current, oldIndex, newIndex)

      form.setValue('oncePerLifetime', newOrder)

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
    <Card className="mt-1 border-0">
      <CardHeader className="px-3 py-2 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Once Per Lifetime</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rerollUsed"
              checked={rerollUsedState}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setRerollUsedState(checked)
              }}
            />
            <Label htmlFor="rerollUsed" className="text-xs cursor-pointer">
              Reroll used
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {oncePerLifetimeRef.current.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={oncePerLifetimeRef.current.map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {oncePerLifetimeRef.current.map((event, index) => (
                  <OncePerLifetimeItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveOncePerLifetime={handleRemoveOncePerLifetime}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`oncePerLifetime.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success(
                        'The once per lifetime event has been updated.'
                      )
                    }}
                    onEdit={editOncePerLifetime}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewOncePerLifetimeItem
              onSave={saveOncePerLifetime}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOncePerLifetime}
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusCircleIcon className="h-4 w-4" />
                Add Once Per Lifetime Event
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
