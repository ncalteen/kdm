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

  const [nameValue, setNameValue] = useState(
    form.getValues(`locations.${index}.name`) || ''
  )
  const [unlockedValue, setUnlockedValue] = useState(
    form.getValues(`locations.${index}.unlocked`) || false
  )

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
        id={`location-${index}-unlocked`}
        name={`locations[${index}].unlocked`}
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
        id={`location-${index}-name`}
        name={`locations[${index}].name`}
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

function NewLocationItem({
  index,
  onSave,
  onCancel
}: {
  index: number
  onSave: (name: string, unlocked: boolean) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const handleSave = () => {
    onSave(name.trim(), unlocked)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }
  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Checkbox
        checked={unlocked}
        onCheckedChange={(checked) => setUnlocked(checked === true)}
        id={`location-new-${index}-unlocked`}
        name={`locations[new-${index}].unlocked`}
      />
      <Input
        placeholder="Add a location..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`location-new-${index}-name`}
        name={`locations[new-${index}].name`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save location">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        title="Cancel">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SettlementLocationsCard(
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
  }

  const saveLocation = (name: string, unlocked: boolean) => {
    if (!name || name.trim() === '') {
      toast.warning('Cannot save a location without a name')
      return
    }
    const updated = [...locations, { name, unlocked }]
    form.setValue('locations', updated)
    setDisabledInputs((prev) => ({ ...prev, [updated.length - 1]: true }))
    setIsAddingNew(false)
    toast.success('Location added')
  }

  const saveExistingLocation = (
    index: number,
    name: string,
    unlocked: boolean
  ) => {
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
