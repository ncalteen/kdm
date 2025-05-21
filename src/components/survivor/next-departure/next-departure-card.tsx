'use client'

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
import { NewNextDepartureItem, NextDepartureItem } from './next-departure-item'

/**
 * Next Departure Card Component
 */
export function NextDepartureCard(form: UseFormReturn<Survivor>): ReactElement {
  const nextDeparture = useMemo(() => form.watch('nextDeparture') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      nextDeparture.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [nextDeparture])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNextDeparture = () => setIsAddingNew(true)

  /**
   * Handles the removal of a next departure item.
   *
   * @param index Next Departure Index
   */
  const handleRemoveNextDeparture = (index: number) => {
    const currentNextDeparture = [...nextDeparture]

    currentNextDeparture.splice(index, 1)
    form.setValue('nextDeparture', currentNextDeparture)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    toast.success('The next departure item has been removed.')
  }

  /**
   * Handles the saving of a new next departure item.
   *
   * @param value Next Departure Value
   */
  const saveNextDeparture = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('You must name the next departure item.')

    const newNextDeparture = [...nextDeparture, value]

    form.setValue('nextDeparture', newNextDeparture)
    setDisabledInputs((prev) => ({
      ...prev,
      [newNextDeparture.length - 1]: true
    }))
    setIsAddingNew(false)

    toast.success('The survivor gains a new next departure item.')
  }

  const editNextDeparture = (index: number) =>
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
      const newOrder = arrayMove(nextDeparture, oldIndex, newIndex)

      form.setValue('nextDeparture', newOrder)

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
        <CardTitle className="text-md">Next Departure</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {nextDeparture.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={nextDeparture.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {nextDeparture.map((nextDepart, index) => (
                  <NextDepartureItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveNextDeparture={handleRemoveNextDeparture}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`nextDeparture.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success('Next departure bonus updated.')
                    }}
                    onEdit={editNextDeparture}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewNextDepartureItem
              onSave={saveNextDeparture}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addNextDeparture}
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusCircleIcon className="h-4 w-4" />
                Add Next Departure Bonus
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
