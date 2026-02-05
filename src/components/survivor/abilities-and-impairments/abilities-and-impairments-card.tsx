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
import { ReactElement, useRef, useState } from 'react'
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
  const survivorIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSurvivor?.abilitiesAndImpairments ?? []).map((_, i) => [i, true])
    )
  )
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSurvivor?.abilitiesAndImpairments ?? []).map((_, i) => [
          i,
          true
        ])
      )
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const onRemove = (index: number) => {
    const updated = [...(selectedSurvivor?.abilitiesAndImpairments ?? [])]
    updated.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSurvivor(
      {
        abilitiesAndImpairments: updated
      },
      ABILITY_IMPAIRMENT_REMOVED_MESSAGE()
    )
    setIsAddingNew(false)
  }

  /**
   * Handles saving a new ability or impairment.
   *
   * @param value Ability/Impairment Value
   * @param i Ability/Impairment Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('ability/impairment'))

    const updated = [...(selectedSurvivor?.abilitiesAndImpairments ?? [])]

    if (i !== undefined) {
      // Updating an existing value
      updated[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updated.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updated.length - 1]: true
      }))
    }

    saveSelectedSurvivor(
      { abilitiesAndImpairments: updated },
      ABILITY_IMPAIRMENT_UPDATED_MESSAGE(i === undefined)
    )
  }

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
        selectedSurvivor?.abilitiesAndImpairments ?? [],
        oldIndex,
        newIndex
      )

      saveSelectedSurvivor({ abilitiesAndImpairments: newOrder })
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
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddingNew(true)}
              className="h-6 w-6"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="p-0">
        <div className="flex flex-col">
          {selectedSurvivor?.abilitiesAndImpairments?.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={(selectedSurvivor?.abilitiesAndImpairments ?? []).map(
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
                      onSave={(value, i) => onSave(value, i)}
                      onEdit={(index: number) =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }
                      selectedSurvivor={selectedSurvivor}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewAbilityImpairmentItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}

          {/* Skip Next Hunt */}
          <div className="flex justify-end mt-2 pr-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="skipNextHunt"
                checked={!!selectedSurvivor?.skipNextHunt}
                onCheckedChange={(checked) =>
                  saveSelectedSurvivor(
                    {
                      skipNextHunt: !!checked
                    },
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
