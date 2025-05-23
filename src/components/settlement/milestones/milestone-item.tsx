'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Milestone, Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  BookOpen,
  CheckIcon,
  GripVertical,
  PencilIcon,
  TrashIcon
} from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Milestone Item Component Properties
 */
export interface MilestoneItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Milestone ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** Milestone */
  milestone: Milestone
  /** OnEdit Callback */
  onEdit: (index: number) => void
  /** OnRemove Callback */
  onRemove: (index: number) => void
  /** OnSave Callback */
  onSave: (index: number, name: string, event: string) => void
  /** OnToggleComplete Callback */
  onToggleComplete: (index: number, checked: boolean) => void
}

/**
 * New Milestone Item Component Properties
 */
export interface NewMilestoneItemProps {
  /** Index */
  index: number
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (name: string, event: string) => void
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
  onToggleComplete,
  id
}: MilestoneItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [nameValue, setNameValue] = useState<string>(milestone.name)
  const [eventValue, setEventValue] = useState<string>(milestone.event)

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
                // Milestones should only be completable if they are saved.
                disabled={!isDisabled}
                onCheckedChange={(checked) => {
                  form.setValue(`milestones.${index}.complete`, !!checked)
                  onToggleComplete(index, !!checked)
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
}: NewMilestoneItemProps): ReactElement {
  const [name, setName] = useState<string | undefined>(undefined)
  const [event, setEvent] = useState<string | undefined>(undefined)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEvent(e.target.value)

  const handleSave = () => {
    if (name && event && name.trim() !== '' && event.trim() !== '')
      onSave(name.trim(), event)
    else toast.warning('Cannot save a milestone without a name and event.')
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
