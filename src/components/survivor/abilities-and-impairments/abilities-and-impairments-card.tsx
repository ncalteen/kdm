'use client'

import {
  AbilityImpairmentItem,
  NewAbilityImpairmentItem
} from '@/components/survivor/abilities-and-impairments/ability-impairment-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  ABILITY_IMPAIRMENT_REMOVED_MESSAGE,
  ABILITY_IMPAIRMENT_UPDATED_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SURVIVOR_SKIP_NEXT_HUNT_UPDATED_MESSAGE
} from '@/lib/messages'
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
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Abilities and Impairments Card Properties
 */
interface AbilitiesAndImpairmentsCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
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
      ABILITY_IMPAIRMENT_REMOVED_MESSAGE()
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
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('ability/impairment'))

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
      ABILITY_IMPAIRMENT_UPDATED_MESSAGE(i === undefined)
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
    <Card className="p-2 border-0 gap-0">
      {/* Title */}
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-sm flex flex-row items-center justify-between h-8">
          Abilities & Impairments
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAbility}
                className="h-6 w-6"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {selectedSurvivor?.abilitiesAndImpairments?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSurvivor?.abilitiesAndImpairments || []).map(
                    (_, index) => index.toString()
                  )}
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

          {/* Skip Next Hunt */}
          <div className="flex justify-end mt-2 pr-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="skipNextHunt"
                checked={!!selectedSurvivor?.skipNextHunt}
                onCheckedChange={(checked) =>
                  saveToLocalStorage(
                    undefined,
                    !!checked,
                    SURVIVOR_SKIP_NEXT_HUNT_UPDATED_MESSAGE(!!checked)
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
