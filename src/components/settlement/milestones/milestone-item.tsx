'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Milestone, Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  BookOpenIcon,
  CheckIcon,
  GripVertical,
  PencilIcon,
  TrashIcon
} from 'lucide-react'
import { ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

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
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (name: string, event: string) => void
}

/**
 * Milestone Item Component
 *
 * Individual milestone item with drag-and-drop functionality.
 * Supports inline editing, completion tracking, and provides save/cancel actions.
 *
 * @param props Milestone item properties
 * @returns Milestone Item Component
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
}: MilestoneItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const nameRef = useRef<HTMLInputElement>(null)
  const eventRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.value = milestone.name || ''
    }
    if (eventRef.current) {
      eventRef.current.value = milestone.event || ''
    }

    if (!isDisabled && nameRef.current) {
      nameRef.current.focus()
      const val = nameRef.current.value
      nameRef.current.value = ''
      nameRef.current.value = val
    }
  }, [milestone.name, milestone.event, isDisabled])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && nameRef.current && eventRef.current) {
      e.preventDefault()
      onSave(index, nameRef.current.value, eventRef.current.value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Completion Checkbox */}
      <Checkbox
        checked={milestone.complete}
        disabled={!isDisabled}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            form.setValue(`milestones.${index}.complete`, checked)
            onToggleComplete(index, checked)
          }
        }}
        className="mr-2"
      />

      {/* Name Display/Input Field */}
      {isDisabled ? (
        <span className="flex-1 text-sm text-left">{milestone.name}</span>
      ) : (
        <Input
          ref={nameRef}
          placeholder="Milestone name"
          defaultValue={milestone.name}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus={!isDisabled}
        />
      )}

      {/* Event Display/Input Field */}
      {isDisabled ? (
        <Badge variant="secondary" className="flex-1 justify-start">
          <BookOpenIcon className="h-4 w-4" />
          {milestone.event}
        </Badge>
      ) : (
        <Input
          ref={eventRef}
          placeholder="Event description"
          defaultValue={milestone.event}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
        />
      )}

      {/* Interaction Buttons */}
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => onEdit(index)}
          title="Edit milestone">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() =>
            onSave(index, nameRef.current!.value, eventRef.current!.value)
          }
          title="Save milestone">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onRemove(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Milestone Item Component
 *
 * Component for adding a new milestone item.
 * Provides input fields for name and event with save/cancel functionality.
 *
 * @param props New milestone item properties
 * @returns New Milestone Item Component
 */
export function NewMilestoneItem({
  onCancel,
  onSave
}: NewMilestoneItemProps): ReactElement {
  const nameRef = useRef<HTMLInputElement>(null)
  const eventRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && nameRef.current && eventRef.current) {
      e.preventDefault()
      onSave(nameRef.current.value, eventRef.current.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex items-center">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Completion Checkbox */}
      <Checkbox checked={false} disabled className="mr-1" />

      {/* Name Input Field */}
      <Input
        ref={nameRef}
        placeholder="Milestone name"
        defaultValue=""
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />

      {/* Event Input Field */}
      <Input
        ref={eventRef}
        placeholder="Event description"
        defaultValue=""
        onKeyDown={handleKeyDown}
        className="flex-1 pr-8"
      />

      {/* Interaction Buttons */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() =>
          onSave(nameRef.current?.value || '', eventRef.current?.value || '')
        }
        title="Save milestone">
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
