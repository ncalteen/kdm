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
  BookOpen,
  CheckIcon,
  GripVertical,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface MilestoneItemProps {
  milestone: {
    name: string
    complete: boolean
    event: string
  }
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
}

function MilestoneItem({
  milestone,
  index,
  form,
  isDisabled,
  onSave,
  onEdit,
  onRemove,
  id
}: MilestoneItemProps & {
  isDisabled: boolean
  onSave: (index: number, name: string, event: string) => void
  onEdit: (index: number) => void
  onRemove: (index: number) => void
  id: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [nameValue, setNameValue] = useState(milestone.name)
  const [eventValue, setEventValue] = useState(milestone.event)

  useEffect(() => {
    setNameValue(milestone.name)
    setEventValue(milestone.event)
  }, [milestone.name, milestone.event])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value)
  }
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventValue(e.target.value)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, eventValue)
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
      <FormField
        control={form.control}
        name={`milestones.${index}.complete`}
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                className="mt-2"
                onCheckedChange={(checked) => {
                  form.setValue(`milestones.${index}.complete`, !!checked)
                }}
                id={`milestone-${index}-complete`}
                name={`milestones[${index}].complete`}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {isDisabled ? (
        <Input
          value={nameValue}
          disabled
          className="flex-1"
          id={`milestone-${index}-name`}
          name={`milestones[${index}].name`}
        />
      ) : (
        <Input
          value={nameValue}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
          id={`milestone-${index}-name`}
          name={`milestones[${index}].name`}
        />
      )}
      <BookOpen />
      {isDisabled ? (
        <Input
          value={eventValue}
          disabled
          className="flex-1"
          id={`milestone-${index}-event`}
          name={`milestones[${index}].event`}
        />
      ) : (
        <Input
          value={eventValue}
          onChange={handleEventChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
          id={`milestone-${index}-event`}
          name={`milestones[${index}].event`}
        />
      )}
      <div className="flex items-center gap-2 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit milestone">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(index, nameValue, eventValue)}
            title="Save milestone">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 ml-2"
          type="button"
          onClick={() => onRemove(index)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewMilestoneItem({
  index,
  onSave,
  onCancel
}: {
  index: number
  onSave: (name: string, event: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [event, setEvent] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent(e.target.value)
  }
  const handleSave = () => {
    if (name.trim() !== '') {
      onSave(name.trim(), event)
    } else {
      toast.warning('Cannot save a milestone without a name')
    }
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
      <Checkbox checked={false} disabled className="mt-2" />
      <Input
        placeholder="Add a milestone..."
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`milestone-new-${index}-name`}
        name={`milestones[new-${index}].name`}
      />
      <BookOpen />
      <Input
        placeholder="Event..."
        value={event}
        onChange={handleEventChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        id={`milestone-new-${index}-event`}
        name={`milestones[new-${index}].event`}
      />
      <Button type="button" variant="ghost" size="icon" onClick={handleSave} title="Save milestone">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function MilestonesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const milestones = useMemo(() => form.watch('milestones') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      milestones.forEach((_, i) => {
        next[i] = prev[i] ?? true
      })
      return next
    })
  }, [milestones])

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMilestone = useCallback(() => setIsAddingNew(true), [])

  const saveNewMilestone = useCallback(
    (name: string, event: string) => {
      if (milestones.some((m) => m.name === name)) {
        toast.warning('A milestone with this name already exists')
        return false
      }
      const newMilestone = { name, complete: false, event }
      const updated = [...milestones, newMilestone]
      form.setValue('milestones', updated)
      setDisabledInputs((prev) => ({ ...prev, [updated.length - 1]: true }))
      setIsAddingNew(false)
      toast.success('New milestone added')
      return true
    },
    [milestones, form]
  )

  const cancelNewMilestone = useCallback(() => setIsAddingNew(false), [])

  const handleRemoveMilestone = useCallback(
    (index: number) => {
      const updated = [...milestones]
      updated.splice(index, 1)
      form.setValue('milestones', updated)
      setDisabledInputs((prev) => {
        const next = { ...prev }
        delete next[index]
        const reindexed: { [key: number]: boolean } = {}
        Object.keys(next).forEach((k) => {
          const num = parseInt(k)
          if (num > index) {
            reindexed[num - 1] = next[num]
          } else if (num < index) {
            reindexed[num] = next[num]
          }
        })
        return reindexed
      })
    },
    [milestones, form]
  )

  const handleEdit = useCallback((index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }, [])

  const handleSave = useCallback(
    (index: number, name: string, event: string) => {
      if (!name || name.trim() === '') {
        toast.warning('Cannot save a milestone without a name')
        return
      }
      const updated = [...milestones]
      updated[index] = { ...updated[index], name, event }
      form.setValue('milestones', updated)
      setDisabledInputs((prev) => ({ ...prev, [index]: true }))
      toast.success('Milestone saved')
    },
    [milestones, form]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = parseInt(active.id.toString())
          const newIndex = parseInt(over.id.toString())
          const newOrder = arrayMove(milestones, oldIndex, newIndex)
          form.setValue('milestones', newOrder)
        })
      }
    },
    [milestones, form]
  )

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Settlement Milestones
        </CardTitle>
        <CardDescription className="text-left">
          Trigger these effects when the milestone condition is met.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={milestones.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {milestones.map((milestone, index) => (
                <MilestoneItem
                  key={index}
                  id={index.toString()}
                  milestone={milestone}
                  index={index}
                  form={form}
                  isDisabled={!!disabledInputs[index]}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onRemove={handleRemoveMilestone}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewMilestoneItem
              index={milestones.length}
              onSave={saveNewMilestone}
              onCancel={cancelNewMilestone}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMilestone}
              disabled={isAddingNew || Object.values(disabledInputs).some((v) => v === false)}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
