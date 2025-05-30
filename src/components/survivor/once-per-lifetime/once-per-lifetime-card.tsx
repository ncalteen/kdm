'use client'

import {
  NewOncePerLifetimeItem,
  OncePerLifetimeItem
} from '@/components/survivor/once-per-lifetime/once-per-lifetime-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
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
import { CopyCheckIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Once Per Lifetime Card Component
 */
export function OncePerLifetimeCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const oncePerLifetime = useMemo(
    () => form.watch('oncePerLifetime') || [],
    [form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      oncePerLifetime.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [oncePerLifetime])

  const [rerollUsedState, setRerollUsedState] = useState<boolean>(
    !!form.getValues('rerollUsed')
  )

  useEffect(
    () => form.setValue('rerollUsed', rerollUsedState, { shouldDirty: true }),
    [rerollUsedState, form]
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addOncePerLifetime = () => setIsAddingNew(true)

  /**
   * Save once per lifetime data to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedOncePerLifetime Updated Once Per Lifetime
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedOncePerLifetime: string[],
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
          oncePerLifetime: updatedOncePerLifetime
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

        campaign.survivors[survivorIndex].oncePerLifetime =
          updatedOncePerLifetime
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Once Per Lifetime Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a once per lifetime event.
   *
   * @param index Event Index
   */
  const onRemove = (index: number) => {
    const currentOncePerLifetime = [...oncePerLifetime]

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

    saveToLocalStorage(
      currentOncePerLifetime,
      'The fleeting moment fades back into darkness.'
    )
  }

  /**
   * Handles the saving of a new once per lifetime event.
   *
   * @param value Event Value
   * @param i Event Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless event cannot be recorded.')

    try {
      SurvivorSchema.shape.oncePerLifetime.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedOncePerLifetime = [...oncePerLifetime]

    if (i !== undefined) {
      // Updating an existing value
      updatedOncePerLifetime[i] = value
      form.setValue(`oncePerLifetime.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedOncePerLifetime.push(value)

      form.setValue('oncePerLifetime', updatedOncePerLifetime)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedOncePerLifetime.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedOncePerLifetime,
      'The once-in-a-lifetime moment has been inscribed in memory.'
    )
    setIsAddingNew(false)
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
      const newOrder = arrayMove(oncePerLifetime, oldIndex, newIndex)

      form.setValue('oncePerLifetime', newOrder)
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
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardHeader className="px-2 py-1">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
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

          {/* Skip Next Hunt */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="rerollUsed"
              checked={rerollUsedState}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setRerollUsedState(checked)
              }}
            />
            <Label htmlFor="skipNextHunt" className="text-xs cursor-pointer">
              Reroll Used
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Once Per Lifetime List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          {oncePerLifetime.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={oncePerLifetime.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {oncePerLifetime.map((event, index) => (
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
      </CardContent>
    </Card>
  )
}
