'use client'

import {
  LocationItem,
  NewLocationItem
} from '@/components/settlement/locations/location-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SettlementSchema } from '@/schemas/settlement'
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
import { HomeIcon, PlusCircleIcon } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Locations Card Component
 */
export function LocationsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const locations = useMemo(() => form.watch('locations') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      locations.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
    setIsAddingNew(false)
  }, [locations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addLocation = () => {
    setIsAddingNew(true)
  }

  const handleRemoveLocation = (index: number) => {
    startTransition(() => {
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
    })
  }

  const saveLocation = (name: string, unlocked: boolean) => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot save a location without a name')

    startTransition(() => {
      const updated = [...locations, { name, unlocked }]
      form.setValue('locations', updated)
      setDisabledInputs((prev) => ({ ...prev, [updated.length - 1]: true }))
      setIsAddingNew(false)
    })

    toast.success('Location added')
  }

  const saveExistingLocation = (
    index: number,
    name: string,
    unlocked: boolean
  ) => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot save a location without a name')

    startTransition(() => {
      form.setValue(`locations.${index}.name`, name)
      form.setValue(`locations.${index}.unlocked`, unlocked)
      setDisabledInputs((prev) => ({ ...prev, [index]: true }))
    })

    toast.success('Location saved')
  }

  const editLocation = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
    toast.info('Editing location')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(locations, oldIndex, newIndex)

      form.setValue('locations', newOrder)

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
        <CardTitle className="text-md flex items-center gap-1">
          <HomeIcon className="h-4 w-4" /> Settlement Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
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
                  handleRemoveLocation={handleRemoveLocation}
                  isDisabled={!!disabledInputs[index]}
                  onSave={saveExistingLocation}
                  onEdit={editLocation}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewLocationItem
              index={locations.length}
              onSave={saveLocation}
              onCancel={() => setIsAddingNew(false)}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addLocation}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
