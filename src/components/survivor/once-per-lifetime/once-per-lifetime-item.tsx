'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Once Per Lifetime Item Component Properties
 */
export interface OncePerLifetimeItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
  /** Remove Once Per Lifetime Handler */
  handleRemoveOncePerLifetime: (index: number) => void
  /** Once Per Lifetime ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnSave Handler */
  onSave: (index: number, value: string) => void
}

/**
 * New Once Per Lifetime Item Component Properties
 */
export interface NewOncePerLifetimeItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
}

/**
 * Once Per Lifetime Item Component
 *
 * @param props Once Per Lifetime Item Component Props
 */
export function OncePerLifetimeItem({
  index,
  form,
  handleRemoveOncePerLifetime,
  id,
  isDisabled,
  onSave,
  onEdit
}: OncePerLifetimeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState<string | undefined>(
    form.getValues(`oncePerLifetime.${index}`)
  )

  useEffect(
    () => setValue(form.getValues(`oncePerLifetime.${index}`) || ''),
    [form, isDisabled, index]
  )

  const style = { transform: CSS.Transform.toString(transform), transition }

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current index and value.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      e.preventDefault()
      onSave(index, value)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder="Once Per Lifetime Event"
        value={value}
        disabled={isDisabled}
        onChange={(e) => !isDisabled && setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit event">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (value) onSave(index, value)
          }}
          title="Save event">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => handleRemoveOncePerLifetime(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Once Per Lifetime Item Component
 */
export function NewOncePerLifetimeItem({
  onSave,
  onCancel
}: NewOncePerLifetimeItemProps): ReactElement {
  const [value, setValue] = useState<string | undefined>(undefined)

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current value. If the Escape key is pressed, it calls the onCancel
   * function.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      e.preventDefault()
      onSave(value)
    } else if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex items-center">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        placeholder="Once Per Lifetime Event"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          if (value) onSave(value)
        }}
        title="Save event">
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
