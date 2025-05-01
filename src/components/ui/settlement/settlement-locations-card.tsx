'use client'

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
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  CheckIcon,
  GripVertical,
  HomeIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface LocationItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveLocation: (index: number) => void
  id: string
  isDisabled: boolean
  onSave: (index: number) => void
  onEdit: (index: number) => void
}

function LocationItem({
  index,
  form,
  handleRemoveLocation,
  id,
  isDisabled,
  onSave,
  onEdit
}: LocationItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <FormField
        control={form.control}
        name={`locations.${index}.unlocked`}
        render={({ field }) => (
          <FormItem className="flex items-center m-0 mt-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                disabled={isDisabled}
                onCheckedChange={(checked) => {
                  form.setValue(`locations.${index}.unlocked`, !!checked)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`locations.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Location Name"
                {...field}
                value={field.value || ''}
                disabled={isDisabled}
                onChange={(e) => {
                  form.setValue(`locations.${index}.name`, e.target.value)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit location">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index)}
          title="Save location">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveLocation(index)}
        title="Remove location">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SettlementLocationsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const locations = form.watch('locations') || []

  // Track which inputs are disabled (saved)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addLocation = () => {
    const currentLocations = [...locations]
    currentLocations.push({ name: '', unlocked: false })
    form.setValue('locations', currentLocations)
  }

  const handleRemoveLocation = (index: number) => {
    const currentLocations = [...locations]
    currentLocations.splice(index, 1)
    form.setValue('locations', currentLocations)

    // Remove from disabled inputs
    const updatedDisabledInputs = { ...disabledInputs }
    delete updatedDisabledInputs[index]

    // Reindex the disabled inputs for the remaining items
    const newDisabledInputs: { [key: number]: boolean } = {}
    Object.keys(updatedDisabledInputs).forEach((key) => {
      const numKey = parseInt(key)
      if (numKey > index) {
        newDisabledInputs[numKey - 1] = updatedDisabledInputs[numKey]
      } else {
        newDisabledInputs[numKey] = updatedDisabledInputs[numKey]
      }
    })

    setDisabledInputs(newDisabledInputs)
  }

  const saveLocation = (index: number) => {
    const currentLocation = form.getValues(`locations.${index}`)
    if (!currentLocation.name || currentLocation.name.trim() === '') {
      toast.warning('Cannot save a location without a name')
      return
    }

    // Mark this input as disabled (saved)
    setDisabledInputs({
      ...disabledInputs,
      [index]: true
    })

    toast.success('Location saved')
  }

  const editLocation = (index: number) => {
    // Mark this input as enabled (editable)
    const updatedDisabledInputs = { ...disabledInputs }
    updatedDisabledInputs[index] = false
    setDisabledInputs(updatedDisabledInputs)

    toast.info('Editing location')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(locations, oldIndex, newIndex)
      form.setValue('locations', newOrder)

      // Reorder the disabled inputs state
      const newDisabledInputs: { [key: number]: boolean } = {}
      Object.keys(disabledInputs).forEach((key) => {
        const numKey = parseInt(key)
        if (numKey === oldIndex) {
          newDisabledInputs[newIndex] = disabledInputs[numKey]
        } else if (numKey >= newIndex && numKey < oldIndex) {
          newDisabledInputs[numKey + 1] = disabledInputs[numKey]
        } else if (numKey <= newIndex && numKey > oldIndex) {
          newDisabledInputs[numKey - 1] = disabledInputs[numKey]
        } else {
          newDisabledInputs[numKey] = disabledInputs[numKey]
        }
      })
      setDisabledInputs(newDisabledInputs)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <HomeIcon className="h-5 w-5" /> Settlement Locations
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
                  onSave={saveLocation}
                  onEdit={editLocation}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addLocation}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
