'use client'

import {
  MilestoneItem,
  NewMilestoneItem
} from '@/components/settlement/milestones/milestone-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import {
  DndContext,
  DragEndEvent,
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
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Milestones Card Component
 */
export function MilestonesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const milestones = useMemo(() => form.watch('milestones') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      milestones.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [milestones])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMilestone = () => setIsAddingNew(true)

  /**
   * Save milestones to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedMilestones Updated Milestones
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedMilestones: typeof milestones,
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
          milestones: updatedMilestones
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

        campaign.settlements[settlementIndex].milestones = updatedMilestones
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Milestone Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a milestone.
   *
   * @param index Milestone Index
   */
  const onRemove = (index: number) => {
    const currentMilestones = [...milestones]

    currentMilestones.splice(index, 1)
    form.setValue('milestones', currentMilestones)

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
      currentMilestones,
      'The milestone fades into the darkness.'
    )
  }

  /**
   * Handles saving a new milestone or updating an existing one.
   *
   * @param name Milestone Name
   * @param event Event Description
   * @param i Milestone Index (When Updating Only)
   */
  const onSave = (name?: string, event?: string, i?: number) => {
    if (!name || name.trim() === '')
      return toast.error('A nameless milestone cannot be recorded.')

    if (!event || event.trim() === '')
      return toast.error('A milestone without an event cannot be recorded.')

    try {
      SettlementSchema.shape.milestones.parse([
        { name, event, complete: false }
      ])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedMilestones = [...milestones]

    if (i !== undefined) {
      // Updating an existing value
      updatedMilestones[i] = { ...updatedMilestones[i], name, event }
      form.setValue(`milestones.${i}.name`, name)
      form.setValue(`milestones.${i}.event`, event)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedMilestones.push({ name, event, complete: false })

      form.setValue('milestones', updatedMilestones)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedMilestones.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedMilestones,
      i !== undefined
        ? 'Milestone chronicles have been updated.'
        : "A new milestone marks the settlement's destiny."
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a milestone.
   *
   * @param index Milestone Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering milestones.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(milestones, oldIndex, newIndex)

      form.setValue('milestones', newOrder)
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
   * Handles milestone completion toggle.
   *
   * @param index Milestone Index
   * @param checked Completion Status
   */
  const onToggleComplete = (index: number, checked: boolean) => {
    const updatedMilestones = [...milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      complete: checked
    }

    form.setValue('milestones', updatedMilestones)
    saveToLocalStorage(
      updatedMilestones,
      checked
        ? 'Milestone achieved - the settlement progresses through the darkness.'
        : 'Milestone status updated.'
    )
  }

  return (
    <Card>
      <CardHeader className="px-4 pt-2 pb-0">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            Milestones{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addMilestone}
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

      {/* Milestones List */}
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {milestones.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={milestones.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {milestones.map((milestone, index) => (
                  <MilestoneItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    milestone={milestone}
                    onRemove={onRemove}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, name, event) => onSave(name, event, i)}
                    onEdit={onEdit}
                    onToggleComplete={onToggleComplete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewMilestoneItem
              onSave={(name, event) => onSave(name, event)}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
