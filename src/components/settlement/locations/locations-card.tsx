'use client'

import {
  LocationItem,
  NewLocationItem
} from '@/components/settlement/locations/location-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import {
  Location,
  LocationSchema,
  Settlement,
  SettlementSchema
} from '@/schemas/settlement'
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
 * Locations Card Component
 */
export function LocationsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const locations = useMemo(() => form.watch('locations') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      locations.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [locations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addLocation = () => setIsAddingNew(true)

  /**
   * Save locations to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedLocations Updated Locations
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedLocations: Location[],
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
          locations: updatedLocations
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

        campaign.settlements[settlementIndex].locations = updatedLocations
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Location Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a location.
   *
   * @param index Location Index
   */
  const onRemove = (index: number) => {
    const currentLocations = [...locations]

    currentLocations.splice(index, 1)
    form.setValue('locations', currentLocations)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentLocations, 'The location has been removed.')
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

    try {
      LocationSchema.parse(locationData)
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedLocations = [...locations]

    if (i !== undefined) {
      // Updating an existing value
      updatedLocations[i] = locationData
      form.setValue(`locations.${i}`, locationData)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedLocations.push(locationData)

      form.setValue('locations', updatedLocations)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedLocations.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedLocations,
      i !== undefined
        ? 'The location has been updated.'
        : 'A new location illuminates the settlement.'
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
    const currentLocations = [...locations]
    currentLocations[index] = { ...currentLocations[index], unlocked }

    form.setValue('locations', currentLocations)
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
      const newOrder = arrayMove(locations, oldIndex, newIndex)

      form.setValue('locations', newOrder)
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
    <Card className="mt-1">
      <CardHeader className="px-4 pt-2 pb-0">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            Locations{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
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
              </div>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      {/* Locations List */}
      <CardContent className="p-1 pb-2">
        <div className="space-y-1">
          {locations.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={locations.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {locations.map((location, index) => (
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
      </CardContent>
    </Card>
  )
}
