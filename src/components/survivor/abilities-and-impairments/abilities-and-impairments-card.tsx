'use client'

import {
  AbilityItem,
  NewAbilityItem
} from '@/components/survivor/abilities-and-impairments/ability-item'
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
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const formValues = form.getValues()

  // Use ref to avoid circular dependencies in effects
  const abilitiesRef = useRef<string[]>(
    formValues.abilitiesAndImpairments || []
  )

  // Watch for changes in the abilities field
  const abilities = form.watch('abilitiesAndImpairments')

  // Update our ref when abilities change
  useEffect(() => {
    if (abilities) abilitiesRef.current = abilities
  }, [abilities])

  // Use a local state to track the checkbox to avoid infinite loop
  const [skipNextHuntState, setSkipNextHuntState] = useState<boolean>(
    !!form.getValues('skipNextHunt')
  )

  // Update form value when skipNextHuntState changes
  useEffect(
    () =>
      form.setValue('skipNextHunt', skipNextHuntState, { shouldDirty: true }),
    [skipNextHuntState, form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      abilitiesRef.current.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [abilities])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addAbility = () => setIsAddingNew(true)

  /**
   * Save abilities and impairments to localStorage for the current survivor.
   *
   * @param updatedAbilities Updated Abilities
   */
  const saveToLocalStorage = (updatedAbilities: string[]) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()

      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        campaign.survivors[survivorIndex].abilitiesAndImpairments =
          updatedAbilities
        localStorage.setItem('campaign', JSON.stringify(campaign))
      }
    } catch (error) {
      console.error('Abilities/Impairments Save Error:', error)
    }
  }

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const handleRemoveAbility = (index: number) => {
    const currentAbilities = [...abilitiesRef.current]

    currentAbilities.splice(index, 1)
    form.setValue('abilitiesAndImpairments', currentAbilities)
    saveToLocalStorage(currentAbilities)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    toast.success('The ability or impairment has been removed.')
  }

  /**
   * Handles the saving of a new ability or impairment.
   *
   * @param value Ability Value
   * @param i Ability Index (Updating Only)
   */
  const saveAbility = (value: string, i?: number) => {
    try {
      SurvivorSchema.shape.abilitiesAndImpairments.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const abilitiesAndImpairments =
      i !== undefined
        ? [...abilitiesRef.current]
        : [...abilitiesRef.current, value]

    if (i !== undefined) {
      abilitiesAndImpairments[i] = value
      form.setValue(`abilitiesAndImpairments.${i}`, value)
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      form.setValue('abilitiesAndImpairments', abilitiesAndImpairments)
      setDisabledInputs((prev) => ({
        ...prev,
        [abilitiesAndImpairments.length - 1]: true
      }))
    }

    saveToLocalStorage(abilitiesAndImpairments)
    setIsAddingNew(false)

    toast.success('The ability or impairment has been added.')
  }

  /**
   * Enables the input for editing.
   *
   * @param index Ability Index
   */
  const editAbility = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(abilitiesRef.current, oldIndex, newIndex)

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
              Skip next hunt
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="pb-2 pt-1">
        <div className="space-y-2">
          {abilitiesRef.current.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={abilitiesRef.current.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {abilitiesRef.current.map((ability, index) => (
                  <AbilityItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveAbility={handleRemoveAbility}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => saveAbility(value, i)}
                    onEdit={editAbility}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewAbilityItem
              onSave={saveAbility}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
