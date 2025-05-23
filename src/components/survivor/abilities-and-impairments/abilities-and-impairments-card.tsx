'use client'

import {
  AbilityImpairmentItem,
  NewAbilityImpairmentItem
} from '@/components/survivor/abilities-and-impairments/ability-impairment-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
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
 * Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const abilitiesAndImpairments = useMemo(
    () => form.watch('abilitiesAndImpairments') || [],
    [form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      abilitiesAndImpairments.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [abilitiesAndImpairments])

  const [skipNextHuntState, setSkipNextHuntState] = useState<boolean>(
    !!form.getValues('skipNextHunt')
  )

  useEffect(
    () =>
      form.setValue('skipNextHunt', skipNextHuntState, { shouldDirty: true }),
    [skipNextHuntState, form]
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addAbility = () => setIsAddingNew(true)

  /**
   * Save abilities/impairments to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedAbilitiesAndImpairments Updated Abilities/Impairments
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedAbilitiesAndImpairments: string[],
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
          abilitiesAndImpairments: updatedAbilitiesAndImpairments
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

        campaign.survivors[survivorIndex].abilitiesAndImpairments =
          updatedAbilitiesAndImpairments
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Ability/Impairment Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const onRemove = (index: number) => {
    const currentAbilitiesAndImpairments = [...abilitiesAndImpairments]

    currentAbilitiesAndImpairments.splice(index, 1)
    form.setValue('abilitiesAndImpairments', currentAbilitiesAndImpairments)

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
      currentAbilitiesAndImpairments,
      'The ability/impairment has been removed.'
    )
  }

  /**
   * Handles saving a new ability or impairment.
   *
   * @param value Ability/Impairment Value
   * @param i Ability/Impairment Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless ability/impairment cannot be recorded.')

    try {
      SurvivorSchema.shape.abilitiesAndImpairments.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedAbilitiesAndImpairments = [...abilitiesAndImpairments]

    if (i !== undefined) {
      // Updating an existing value
      updatedAbilitiesAndImpairments[i] = value
      form.setValue(`abilitiesAndImpairments.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedAbilitiesAndImpairments.push(value)

      form.setValue('abilitiesAndImpairments', updatedAbilitiesAndImpairments)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedAbilitiesAndImpairments.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedAbilitiesAndImpairments,
      i !== undefined
        ? 'The ability/impairment has been updated.'
        : 'The survivor gains a new ability/impairment.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Ability Index
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
      const newOrder = arrayMove(abilitiesAndImpairments, oldIndex, newIndex)

      form.setValue('abilitiesAndImpairments', newOrder)
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
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
            Abilities & Impairments{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addAbility}
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipNextHunt"
              checked={skipNextHuntState}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setSkipNextHuntState(checked)
              }}
            />
            <Label htmlFor="skipNextHunt" className="text-xs cursor-pointer">
              Skip Next Hunt
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {abilitiesAndImpairments.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={abilitiesAndImpairments.map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {abilitiesAndImpairments.map((ability, index) => (
                  <AbilityImpairmentItem
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
            <NewAbilityImpairmentItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
