'use client'

import {
  LocationItem,
  NewLocationItem
} from '@/components/settlement/locations/location-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LOCATION_UNLOCKED_MESSAGE,
  NAMELESS_LOCATION_ERROR,
  REMOVE_LOCATION_MESSAGE,
  UPDATE_LOCATION_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
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
import { toast } from 'sonner'

/**
 * Locations Card Properties
 */
interface LocationsCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Locations Card Component
 *
 * @param props Locations Card Properties
 * @returns Locations Card Component
 */
export function LocationsCard({
  saveSelectedSettlement,
  selectedSettlement
}: LocationsCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[LocationsCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.locations?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.locations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addLocation = () => setIsAddingNew(true)

  /**
   * Handles the removal of a location.
   *
   * @param index Location Index
   */
  const onRemove = (index: number) => {
    const currentLocations = [...(selectedSettlement?.locations || [])]
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

    saveSelectedSettlement(
      { locations: currentLocations },
      REMOVE_LOCATION_MESSAGE()
    )
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
      return toast.error(NAMELESS_LOCATION_ERROR())

    const locationData = { name: name.trim(), unlocked: unlocked || false }

    const updatedLocations = [...(selectedSettlement?.locations || [])]

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

    saveSelectedSettlement(
      { locations: updatedLocations },
      UPDATE_LOCATION_MESSAGE(i)
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
    const currentLocations = [...(selectedSettlement?.locations || [])]
    currentLocations[index] = { ...currentLocations[index], unlocked }

    saveSelectedSettlement(
      { locations: currentLocations },
      LOCATION_UNLOCKED_MESSAGE(unlocked)
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
      const newOrder = arrayMove(
        selectedSettlement?.locations || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ locations: newOrder })

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
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
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
            {selectedSettlement?.locations?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.locations || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.locations || []).map(
                    (location, index) => (
                      <LocationItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={(name, unlocked, i) =>
                          onSave(name, unlocked, i)
                        }
                        onToggleUnlocked={onToggleUnlocked}
                        onEdit={onEdit}
                        selectedSettlement={selectedSettlement}
                      />
                    )
                  )}
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
