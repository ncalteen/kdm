'use client'

import {
  NewNextDepartureItem,
  NextDepartureItem
} from '@/components/survivor/next-departure/next-departure-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
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
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
   * Save nextDeparture to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param updatedNextDeparture Updated nextDeparture array
   * @param successMsg Optional success message for toast
   */
  const saveToLocalStorage = (
    updatedNextDeparture: string[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          nextDeparture: updatedNextDeparture
        }
        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message) {
            return toast.error(error.errors[0].message)
          } else {
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
          }
        }

        campaign.survivors[survivorIndex].nextDeparture = updatedNextDeparture
        localStorage.setItem('campaign', JSON.stringify(campaign))
        if (successMsg) toast.success(successMsg)
        return true
      }
    } catch (error) {
      console.error('Next Departure Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
    return false
  }

  /**
   * Handles the removal of a next departure item.
   *
   * @param index Next Departure Index
   */
  const handleRemoveNextDeparture = (index: number) => {
    const currentNextDeparture = [...nextDeparture]

    currentNextDeparture.splice(index, 1)
    form.setValue('nextDeparture', currentNextDeparture)

    if (
      saveToLocalStorage(
        currentNextDeparture,
        'The lantern dims. Next departure bonus removed.'
      )
    ) {
      toast.success('The lantern dims. Next departure bonus removed.')
    }

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })
  }

  /**
   * Handles the saving of a new next departure item.
   *
   * @param value Next Departure Value
   */
  const saveNextDeparture = (value: string) => {
    const newNextDeparture = [...nextDeparture, value]

    if (
      !saveToLocalStorage(
        newNextDeparture,
        'A new hope flickers. Next departure bonus added.'
      )
    )
      return

    form.setValue('nextDeparture', newNextDeparture)
    setDisabledInputs((prev) => ({
      ...prev,
      [newNextDeparture.length - 1]: true
    }))
    setIsAddingNew(false)

    toast.success('A new hope flickers. Next departure bonus added.')
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
        <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
          Next Departure{' '}
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addNextDeparture}
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
                      const updated = [...nextDeparture]
                      updated[i] = value
                      if (
                        !saveToLocalStorage(
                          updated,
                          'The lantern glows. Next departure bonus updated.'
                        )
                      )
                        return
                      form.setValue(`nextDeparture.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success(
                        'The lantern glows. Next departure bonus updated.'
                      )
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
        </div>
      </CardContent>
    </Card>
  )
}
