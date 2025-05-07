'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  BookOpen,
  CheckIcon,
  GripVertical,
  PencilIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface MilestoneItemProps {
  milestone: {
    name: string
    complete: boolean
    event: string
  }
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
}

/**
 * Milestone Item Component
 */
export function MilestoneItem({
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameValue(e.target.value)

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEventValue(e.target.value)

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
                disabled={isDisabled}
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
          className="flex-1 max-w-[50%]"
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
      <BookOpen className="h-4 w-4" />
      {isDisabled ? (
        <Badge
          variant="secondary"
          className="justify-start w-auto min-w-0 flex-none">
          {eventValue || <span className="opacity-50">No event</span>}
        </Badge>
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

/**
 * New Milestone Item Component
 */
export function NewMilestoneItem({
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEvent(e.target.value)

  const handleSave = () => {
    if (name.trim() !== '') onSave(name.trim(), event)
    else toast.warning('Cannot save a milestone without a name')
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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save milestone">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
