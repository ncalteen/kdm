'use client'

import {
  DisorderItem,
  NewDisorderItem
} from '@/components/survivor/disorders/disorder-item'
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
 * Disorders Card Component
 *
 * @param form Form
 * @returns Disorders Card Component
 */
export function DisordersCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
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
   * Save disorders to localStorage for the current survivor, with Zod
   * validation and toast feedback.
   *
   * @param updatedDisorders Updated disorders array
   * @param successMsg Success message for toast
   */
  const saveToLocalStorage = (
    updatedDisorders: string[],
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
          disorders: updatedDisorders
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.survivors[survivorIndex].disorders = updatedDisorders
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Disorder Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a disorder.
   *
   * @param index Disorder Index
   */
  const onRemove = (index: number) => {
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

    saveToLocalStorage(
      currentDisorders,
      'The survivor has overcome their disorder.'
    )
  }

  /**
   * Handles saving a new disorder.
   *
   * @param value Disorder Value
   * @param i Disorder Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless disorder cannot be recorded.')

    if (i === undefined && disorders.length >= MAX_DISORDERS)
      return toast.error('A survivor can have at most 3 disorders.')

    try {
      SurvivorSchema.shape.disorders.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedDisorders = [...disorders]

    if (i !== undefined) {
      // Updating an existing value
      updatedDisorders[i] = value
      form.setValue(`disorders.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedDisorders.push(value)

      form.setValue('disorders', updatedDisorders)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedDisorders.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedDisorders,
      i !== undefined
        ? 'The disorder has been updated.'
        : 'The survivor gains a new disorder.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Disorder Index
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
      const newOrder = arrayMove(disorders, oldIndex, newIndex)

      form.setValue('disorders', newOrder)
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
    <Card className="mt-1 border-0">
      <CardHeader className="px-3 py-2 pb-2">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
          Disorders{' '}
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addDisorder}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  disorders.length >= MAX_DISORDERS ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Disorders List */}
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {disorders.length !== 0 && (
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
            <NewDisorderItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
