'use client'

import {
  LocationItem,
  NewLocationItem
} from '@/components/settlement/locations/location-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Location, Settlement } from '@/schemas/settlement'
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
import { HouseIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Locations Card Props
 */
interface LocationsCardProps extends Partial<Settlement> {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Save settlement function */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Locations Card Component
 */
export function LocationsCard({
  form,
  saveSettlement,
  ...settlement
}: LocationsCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      settlement.locations?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [settlement.locations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addLocation = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedLocations Updated Locations
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedLocations: Location[],
    successMsg?: string
  ) => saveSettlement({ locations: updatedLocations }, successMsg)

  /**
   * Handles the removal of a location.
   *
   * @param index Location Index
   */
  const onRemove = (index: number) => {
    const currentLocations = [...(settlement.locations || [])]
    currentLocations.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentLocations, 'The location has been destroyed.')
  }

  /**
   * Handles saving a new or updated location.
   *
   * @param name Location Name
   * @param unlocked Location Unlocked State
   * @param i Location Index (When Updating Only)
   */
  const onSave = (name?: string, unlocked?: boolean, i?: number) => {
    if (!name || name.trim() === '')
      return toast.error('A nameless location cannot be recorded.')

    const locationData = { name: name.trim(), unlocked: unlocked || false }

    const updatedLocations = [...(settlement.locations || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedLocations[i] = locationData
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedLocations.push(locationData)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedLocations.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedLocations,
      i !== undefined
        ? 'The location has been updated.'
        : 'A new location illuminates within settlement.'
    )
    setIsAddingNew(false)
  }

  /**
   * Handles toggling the unlocked state of a location.
   *
   * @param index Location Index
   * @param unlocked New Unlocked State
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const currentLocations = [...(settlement.locations || [])]
    currentLocations[index] = { ...currentLocations[index], unlocked }

    saveToLocalStorage(
      currentLocations,
      unlocked
        ? 'The location has been illuminated.'
        : 'The location fades into darkness.'
    )
  }

  /**
   * Enables editing a value.
   *
   * @param index Location Index
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
      const newOrder = arrayMove(settlement.locations || [], oldIndex, newIndex)

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
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
          <HouseIcon className="h-4 w-4" />
          Locations
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addLocation}
              className="border-0 h-8 w-8"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Locations List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto">
            {settlement.locations?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(settlement.locations || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(settlement.locations || []).map((location, index) => (
                    <LocationItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(name, unlocked, i) => onSave(name, unlocked, i)}
                      onToggleUnlocked={onToggleUnlocked}
                      onEdit={onEdit}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewLocationItem
                onSave={onSave}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
