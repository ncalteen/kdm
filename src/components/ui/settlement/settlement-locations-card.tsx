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
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { Input } from '../input'

interface LocationItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveLocation: (index: number) => void
  id: string
  isDisabled: boolean
  onSave: (index: number, name: string, unlocked: boolean) => void
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

  // Local state for editing
  const [nameValue, setNameValue] = useState(
    form.getValues(`locations.${index}.name`) || ''
  )
  const [unlockedValue, setUnlockedValue] = useState(
    form.getValues(`locations.${index}.unlocked`) || false
  )

  // Keep local state in sync when switching between edit/saved
  useEffect(() => {
    setNameValue(form.getValues(`locations.${index}.name`) || '')
    setUnlockedValue(form.getValues(`locations.${index}.unlocked`) || false)
  }, [form, isDisabled, index])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, unlockedValue)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        checked={unlockedValue}
        disabled={isDisabled}
        onCheckedChange={(checked) => {
          if (!isDisabled) setUnlockedValue(!!checked)
        }}
      />
      <Input
        placeholder="Location Name"
        value={nameValue}
        disabled={isDisabled}
        onChange={(e) => {
          if (!isDisabled) setNameValue(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        className="flex-1"
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
          onClick={() => onSave(index, nameValue, unlockedValue)}
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
  const locations = useMemo(() => form.watch('locations') || [], [form])

  // Track which inputs are disabled (saved)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  // Ensure disabledInputs is always in sync with locations
  // On first load, all initial locations are disabled (saved)
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      locations.forEach((_, i) => {
        // If this location existed on first render, default to true (disabled/saved)
        // If it was added later, keep its previous state (false = editable)
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

  const addLocation = () => {
    const currentLocations = [...locations]
    currentLocations.push({ name: '', unlocked: false })
    form.setValue('locations', currentLocations)
    setDisabledInputs((prev) => ({
      ...prev,
      [currentLocations.length - 1]: false
    }))
  }

  const handleRemoveLocation = (index: number) => {
    const currentLocations = [...locations]
    currentLocations.splice(index, 1)
    form.setValue('locations', currentLocations)

    // Remove from disabled inputs and reindex
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })
  }

  const saveLocation = (index: number, name: string, unlocked: boolean) => {
    if (!name || name.trim() === '') {
      toast.warning('Cannot save a location without a name')
      return
    }
    form.setValue(`locations.${index}.name`, name)
    form.setValue(`locations.${index}.unlocked`, unlocked)
    setDisabledInputs((prev) => ({ ...prev, [index]: true }))
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
      // Reorder the disabled inputs state
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
              onClick={addLocation}
              disabled={Object.values(disabledInputs).some((v) => v === false)}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
