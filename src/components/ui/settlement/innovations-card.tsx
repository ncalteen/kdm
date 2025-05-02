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
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface InnovationItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveInnovation: (index: number) => void
  id: string
  isDisabled: boolean
  onSave: (index: number) => void
  onEdit: (index: number) => void
}

function InnovationItem({
  index,
  form,
  handleRemoveInnovation,
  id,
  isDisabled,
  onSave,
  onEdit
}: InnovationItemProps) {
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
        name={`innovations.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Innovation"
                {...field}
                value={field.value || ''}
                disabled={isDisabled}
                onChange={(e) => {
                  form.setValue(`innovations.${index}`, e.target.value)
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
          title="Edit innovation">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index)}
          title="Save innovation">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveInnovation(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function NewInnovationItem({
  onSave,
  onCancel
}: {
  onSave: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSave = () => {
    if (value.trim() !== '') {
      onSave(value.trim())
    } else {
      toast.warning('Cannot save an empty innovation')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  useEffect(() => {
    // Focus input when shown
    const input = document.getElementById(
      'new-innovation-input'
    ) as HTMLInputElement
    if (input) input.focus()
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        id="new-innovation-input"
        placeholder="Add an innovation..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save innovation">
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

export function InnovationsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const innovations = useMemo(() => form.watch('innovations') || [], [form])

  // Track which inputs are disabled (saved)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  const [isAddingNew, setIsAddingNew] = useState(false)

  // Remove isAddingNew if innovations change (e.g. tab switch resets form)
  useEffect(() => {
    setIsAddingNew(false)
  }, [innovations])

  // Mark all loaded innovations as saved (disabled) if they are non-empty
  useEffect(() => {
    const initialDisabled: { [key: number]: boolean } = {}
    innovations.forEach((innovation, idx) => {
      if (innovation && innovation.trim() !== '') {
        initialDisabled[idx] = true
      }
    })
    setDisabledInputs(initialDisabled)
  }, [innovations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addInnovation = () => {
    setIsAddingNew(true)
  }

  const saveNewInnovation = (value: string) => {
    const currentInnovations = [...innovations, value]
    form.setValue('innovations', currentInnovations)
    setIsAddingNew(false)
    toast.success('Innovation added')
  }

  const cancelNewInnovation = () => {
    setIsAddingNew(false)
  }

  const handleRemoveInnovation = (index: number) => {
    const currentInnovations = [...innovations]
    currentInnovations.splice(index, 1)
    form.setValue('innovations', currentInnovations)

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

  const saveInnovation = (index: number) => {
    const currentInnovation = form.getValues(`innovations.${index}`)
    if (!currentInnovation || currentInnovation.trim() === '') {
      toast.warning('Cannot save an empty innovation')
      return
    }

    // Mark this input as disabled (saved)
    setDisabledInputs({
      ...disabledInputs,
      [index]: true
    })

    toast.success('Innovation saved')
  }

  const editInnovation = (index: number) => {
    // Mark this input as enabled (editable)
    const updatedDisabledInputs = { ...disabledInputs }
    updatedDisabledInputs[index] = false
    setDisabledInputs(updatedDisabledInputs)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(innovations, oldIndex, newIndex)
      form.setValue('innovations', newOrder)

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
          Innovations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={innovations.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {innovations.map((Innovation, index) => (
                <InnovationItem
                  key={index}
                  id={index.toString()}
                  index={index}
                  form={form}
                  handleRemoveInnovation={handleRemoveInnovation}
                  isDisabled={!!disabledInputs[index]}
                  onSave={saveInnovation}
                  onEdit={editInnovation}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewInnovationItem
              onSave={saveNewInnovation}
              onCancel={cancelNewInnovation}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addInnovation}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Innovation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
