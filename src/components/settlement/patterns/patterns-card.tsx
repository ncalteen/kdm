'use client'

import {
  NewPatternItem,
  PatternItem
} from '@/components/settlement/patterns/pattern-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import { PlusIcon, ScissorsLineDashedIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Patterns Card Component
 *
 * Displays and manages an editable and draggable list of crafting patterns.
 * Users can add, edit, remove, and reorder pattern items. All changes are
 * automatically saved to localStorage with appropriate validation and user feedback.
 *
 * @param form Settlement form instance
 * @returns Patterns Card Component
 */
export function PatternsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const patterns = useMemo(() => form.watch('patterns') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      patterns.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [patterns])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addPattern = () => setIsAddingNew(true)

  /**
   * Save patterns to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedPatterns Updated Patterns
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedPatterns: string[],
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
          patterns: updatedPatterns
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

        campaign.settlements[settlementIndex].patterns = updatedPatterns
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Pattern Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a pattern.
   *
   * @param index Pattern Index
   */
  const onRemove = (index: number) => {
    const currentPatterns = [...patterns]

    currentPatterns.splice(index, 1)
    form.setValue('patterns', currentPatterns)

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
      currentPatterns,
      'The pattern has been banished from memory.'
    )
  }

  /**
   * Handles saving a new pattern or impairment.
   *
   * @param value Pattern Value
   * @param i Pattern Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless pattern cannot be preserved.')

    try {
      SettlementSchema.shape.patterns.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedPatterns = [...patterns]

    if (i !== undefined) {
      // Updating an existing value
      updatedPatterns[i] = value
      form.setValue(`patterns.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedPatterns.push(value)

      form.setValue('patterns', updatedPatterns)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedPatterns.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedPatterns,
      i !== undefined
        ? 'The pattern has been etched into memory.'
        : 'Insight has granted a new pattern.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Pattern Index
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
      const newOrder = arrayMove(patterns, oldIndex, newIndex)

      form.setValue('patterns', newOrder)
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
          <ScissorsLineDashedIcon className="h-4 w-4" />
          Patterns
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addPattern}
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
        <CardDescription className="text-left text-xs">
          Patterns gained only when instructed.
        </CardDescription>
      </CardHeader>

      {/* Patterns List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          {patterns.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={patterns.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {patterns.map((pattern, index) => (
                  <PatternItem
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
            <NewPatternItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
