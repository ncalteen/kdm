'use client'

import {
  DisorderItem,
  NewDisorderItem
} from '@/components/survivor/disorders/disorder-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PlusCircleIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Disorders Card Component
 */
export function DisordersCard(form: UseFormReturn<Survivor>): ReactElement {
  const disorders = useMemo(() => form.watch('disorders') || [], [form])
  const MAX_DISORDERS = 3

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      disorders.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [disorders])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addDisorder = () => setIsAddingNew(true)

  /**
   * Handles the removal of a disorder.
   *
   * @param index Disorder Index
   */
  const handleRemoveDisorder = (index: number) => {
    const currentDisorders = [...disorders]

    currentDisorders.splice(index, 1)
    form.setValue('disorders', currentDisorders)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    toast.success('The survivor has overcome their disorder.')
  }

  /**
   * Handles the saving of a new disorder.
   *
   * @param value Disorder Value
   */
  const saveDisorder = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('You must name the disorder.')

    if (disorders.length >= MAX_DISORDERS)
      return toast.error('A survivor can have at most 3 disorders.')

    const newDisorders = [...disorders, value]

    form.setValue('disorders', newDisorders)
    setDisabledInputs((prev) => ({ ...prev, [newDisorders.length - 1]: true }))
    setIsAddingNew(false)

    toast.success('The survivor gains a new disorder.')
  }

  const editDisorder = (index: number) =>
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
      const newOrder = arrayMove(disorders, oldIndex, newIndex)

      form.setValue('disorders', newOrder)

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
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Disorders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {disorders.length === 0 && !isAddingNew ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No disorders...yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={disorders.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {disorders.map((disorder, index) => (
                  <DisorderItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveDisorder={handleRemoveDisorder}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`disorders.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success('The disorder has been updated.')
                    }}
                    onEdit={editDisorder}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewDisorderItem
              onSave={saveDisorder}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addDisorder}
              disabled={
                isAddingNew ||
                disorders.length >= MAX_DISORDERS ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Disorder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
