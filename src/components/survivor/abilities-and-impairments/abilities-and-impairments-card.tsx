'use client'

import {
  AbilityItem,
  NewAbilityItem
} from '@/components/survivor/abilities-and-impairments/ability-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SurvivorSchema } from '@/schemas/survivor'
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
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  ...form
}: UseFormReturn<z.infer<typeof SurvivorSchema>>) {
  const formValues = form.getValues()

  // Use ref to avoid circular dependencies in effects
  const abilitiesRef = useRef<string[]>(
    formValues.abilitiesAndImpairments || []
  )

  // Watch for changes in the abilities field
  const abilities = form.watch('abilitiesAndImpairments')

  // Update our ref when abilities change
  useEffect(() => {
    if (abilities) {
      abilitiesRef.current = abilities
    }
  }, [abilities])

  // Use a local state to track the checkbox to avoid infinite loop
  const [skipNextHuntState, setSkipNextHuntState] = useState(
    !!form.getValues('skipNextHunt')
  )

  // Update form value when skipNextHuntState changes
  useEffect(() => {
    form.setValue('skipNextHunt', skipNextHuntState, { shouldDirty: true })
  }, [skipNextHuntState, form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

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
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const handleRemoveAbility = (index: number) => {
    const currentAbilities = [...abilitiesRef.current]

    currentAbilities.splice(index, 1)
    form.setValue('abilitiesAndImpairments', currentAbilities)

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
   */
  const saveAbility = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('Please enter an ability or impairment.')

    const newAbilities = [...abilitiesRef.current, value]

    form.setValue('abilitiesAndImpairments', newAbilities)
    setDisabledInputs((prev) => ({ ...prev, [newAbilities.length - 1]: true }))
    setIsAddingNew(false)

    toast.success('The ability or impairment has been added.')
  }

  const editAbility = (index: number) =>
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
      const newOrder = arrayMove(abilitiesRef.current, oldIndex, newIndex)

      form.setValue('abilitiesAndImpairments', newOrder)

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
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-1">
            Abilities & Impairments
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipNextHunt"
              checked={skipNextHuntState}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setSkipNextHuntState(checked)
              }}
            />
            <Label htmlFor="skipNextHunt">Skip Next Hunt</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {abilitiesRef.current.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No abilities or impairments added yet.
            </div>
          ) : (
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
                    onSave={(i, value) => {
                      form.setValue(`abilitiesAndImpairments.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success(
                        'The ability or impairment has been updated.'
                      )
                    }}
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
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addAbility}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Ability or Impairment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
