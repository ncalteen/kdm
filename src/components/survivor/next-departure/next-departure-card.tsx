'use client'

import {
  NewNextDepartureItem,
  NextDepartureItem
} from '@/components/survivor/next-departure/next-departure-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
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
import { GiftIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Next Departure Card Component
 *
 * @param form Form
 * @returns Next Departure Card Component
 */
export function NextDepartureCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const watchedNextDeparture = form.watch('nextDeparture')
  const nextDeparture = useMemo(
    () => watchedNextDeparture || [],
    [watchedNextDeparture]
  )

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
   * Save to Local Storage
   *
   * @param updatedNextDeparture Updated Next Departure Bonuses
   * @param successMsg Success Message
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
        try {
          SurvivorSchema.shape.nextDeparture.parse(updatedNextDeparture)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        // Save to localStorage using the optimized utility
        saveCampaignToLocalStorage({
          ...campaign,
          survivors: campaign.survivors.map((s) =>
            s.id === formValues.id
              ? { ...s, nextDeparture: updatedNextDeparture }
              : s
          )
        })

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Next Departure Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a next departure item.
   *
   * @param index Next Departure Index
   */
  const onRemove = (index: number) => {
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

    saveToLocalStorage(
      currentNextDeparture,
      'The lantern dims. Next departure bonus removed.'
    )
  }

  /**
   * Handles saving a new next departure bonus.
   *
   * @param value Next Departure Value
   * @param i Next Departure Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless departure bonus cannot be recorded.')

    try {
      SurvivorSchema.shape.nextDeparture.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedNextDeparture = [...nextDeparture]

    if (i !== undefined) {
      // Updating an existing value
      updatedNextDeparture[i] = value
      form.setValue(`nextDeparture.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedNextDeparture.push(value)

      form.setValue('nextDeparture', updatedNextDeparture)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedNextDeparture.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedNextDeparture,
      i !== undefined
        ? 'The lantern glows. Next departure bonus updated.'
        : 'The lantern glows. Next departure bonus added.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Next Departure Index
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
      const newOrder = arrayMove(nextDeparture, oldIndex, newIndex)

      form.setValue('nextDeparture', newOrder)
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

  return (
    <Card className="p-0 pb-1 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <GiftIcon className="h-4 w-4" />
          Next Departure
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

      {/* Next Departure Bonus List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div className="flex-1 overflow-y-auto">
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
              <NewNextDepartureItem
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
