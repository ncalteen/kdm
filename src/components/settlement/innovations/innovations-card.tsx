'use client'

import {
  InnovationItem,
  NewInnovationItem
} from '@/components/settlement/innovations/innovation-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
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
import { LightBulbIcon } from '@primer/octicons-react'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Innovations Card Component
 */
export function InnovationsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const innovations = useMemo(() => form.watch('innovations') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      innovations.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [innovations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addInnovation = () => setIsAddingNew(true)

  /**
   * Save innovations to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedInnovations Updated Innovations
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedInnovations: string[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          innovations: updatedInnovations
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].innovations = updatedInnovations
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Innovation Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of an innovation.
   *
   * @param index Innovation Index
   */
  const onRemove = (index: number) => {
    const currentInnovations = [...innovations]

    currentInnovations.splice(index, 1)
    form.setValue('innovations', currentInnovations)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentInnovations, 'The innovation has been lost.')
  }

  /**
   * Handles saving a new innovation.
   *
   * @param value Innovation Value
   * @param i Innovation Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless innovation cannot be recorded.')

    try {
      SettlementSchema.shape.innovations.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedInnovations = [...innovations]

    if (i !== undefined) {
      // Updating an existing value
      updatedInnovations[i] = value
      form.setValue(`innovations.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedInnovations.push(value)

      form.setValue('innovations', updatedInnovations)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedInnovations.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedInnovations,
      i !== undefined
        ? 'The innovation has been updated.'
        : 'The settlement has innovated.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Innovation Index
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
      const newOrder = arrayMove(innovations, oldIndex, newIndex)

      form.setValue('innovations', newOrder)
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
    <Card className="p-0 pb-1 mt-2 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <LightBulbIcon className="h-4 w-4" />
          Innovations
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addInnovation}
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

      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          {innovations.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={innovations.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {innovations.map((innovation, index) => (
                  <InnovationItem
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
            <NewInnovationItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
