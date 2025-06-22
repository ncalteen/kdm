'use client'

import {
  AbilityImpairmentItem,
  NewAbilityImpairmentItem
} from '@/components/survivor/abilities-and-impairments/ability-impairment-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Survivor } from '@/schemas/survivor'
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
import { BicepsFlexedIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Abilities and Impairments Card Properties
 */
interface AbilitiesAndImpairmentsCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Abilities and Impairments Card Component
 *
 * @param props Abilities and Impairments Card Properties
 * @returns Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: AbilitiesAndImpairmentsCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[AbilitiesAndImpairmentsCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSurvivor?.abilitiesAndImpairments?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSurvivor?.abilitiesAndImpairments])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addAbility = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedAbilitiesAndImpairments Updated Abilities/Impairments
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedAbilitiesAndImpairments?: string[],
    updatedSkipNextHunt?: boolean,
    successMsg?: string
  ) => {
    const updateData: Partial<Survivor> = {}

    if (updatedAbilitiesAndImpairments !== undefined)
      updateData.abilitiesAndImpairments = updatedAbilitiesAndImpairments
    if (updatedSkipNextHunt !== undefined)
      updateData.skipNextHunt = updatedSkipNextHunt

    saveSelectedSurvivor(updateData, successMsg)
    setIsAddingNew(false)
  }

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const onRemove = (index: number) => {
    const updatedAbilitiesAndImpairments = [
      ...(selectedSurvivor?.abilitiesAndImpairments || [])
    ]
    updatedAbilitiesAndImpairments.splice(index, 1)

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
      updatedAbilitiesAndImpairments,
      undefined,
      'The ability/impairment has been removed.'
    )
  }

  /**
   * Handles saving a new ability or impairment.
   *
   * @param value Ability/Impairment Value
   * @param i Ability/Impairment Index (When Updating Only)
   */
  const onSaveAbilityOrImpairment = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless ability/impairment cannot be recorded.')

    const updatedAbilitiesAndImpairments = [
      ...(selectedSurvivor?.abilitiesAndImpairments || [])
    ]

    if (i !== undefined) {
      // Updating an existing value
      updatedAbilitiesAndImpairments[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedAbilitiesAndImpairments.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedAbilitiesAndImpairments.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedAbilitiesAndImpairments,
      undefined,
      i !== undefined
        ? 'The ability/impairment has been updated.'
        : 'The survivor gains a new ability/impairment.'
    )
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
      const newOrder = arrayMove(
        selectedSurvivor?.abilitiesAndImpairments || [],
        oldIndex,
        newIndex
      )

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
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            <BicepsFlexedIcon className="h-4 w-4" />
            Abilities & Impairments
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
        </div>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="p-1 pb-2">
        <div className="flex flex-col h-[120px]">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {selectedSurvivor?.abilitiesAndImpairments?.length !== 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={(
                      selectedSurvivor?.abilitiesAndImpairments || []
                    ).map((_, index) => index.toString())}
                    strategy={verticalListSortingStrategy}>
                    {selectedSurvivor?.abilitiesAndImpairments?.map(
                      (ability, index) => (
                        <AbilityImpairmentItem
                          key={index}
                          id={index.toString()}
                          index={index}
                          onRemove={onRemove}
                          isDisabled={!!disabledInputs[index]}
                          onSave={(value, i) =>
                            onSaveAbilityOrImpairment(value, i)
                          }
                          onEdit={onEdit}
                          selectedSurvivor={selectedSurvivor}
                        />
                      )
                    )}
                  </SortableContext>
                </DndContext>
              )}
              {isAddingNew && (
                <NewAbilityImpairmentItem
                  onSave={onSaveAbilityOrImpairment}
                  onCancel={() => setIsAddingNew(false)}
                />
              )}
            </div>
          </div>

          {/* Skip Next Hunt - Bottom Right */}
          <div className="flex justify-end mt-2 pr-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="skipNextHunt"
                checked={!!selectedSurvivor?.skipNextHunt}
                onCheckedChange={(checked) =>
                  saveToLocalStorage(
                    undefined,
                    !!checked,
                    !!checked
                      ? 'The survivor will skip the next hunt.'
                      : 'The survivor will not skip the next hunt.'
                  )
                }
              />
              <Label htmlFor="skipNextHunt" className="text-xs cursor-pointer">
                Skip Next Hunt
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
