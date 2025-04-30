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
import { useState } from 'react'
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

export function InnovationsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const innovations = form.watch('innovations') || []

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

  const addInnovation = () => {
    const currentInnovations = [...innovations]
    currentInnovations.push('')
    form.setValue('innovations', currentInnovations)
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

    toast.info('Editing innovation')
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

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addInnovation}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Innovation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
