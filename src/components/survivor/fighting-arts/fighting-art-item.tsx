'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SurvivorSchema } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Fighting Art Item Component Properties
 */
export interface FightingArtItemProps {
  /** Form */
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
  /** Array Name */
  arrayName: 'fightingArts' | 'secretFightingArts'
  /** Remove Art Handler */
  handleRemove: (index: number) => void
  /** Art ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnSave Handler */
  onSave: (index: number, value: string) => void
  /** Placeholder Text */
  placeholder: string
}

/**
 * New Fighting Art Item Component Properties
 */
export interface NewFightingArtItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
  /** Placeholder Text */
  placeholder: string
}

/**
 * Fighting Art Item Component
 */
export function FightingArtItem({
  form,
  arrayName,
  handleRemove,
  id,
  index,
  isDisabled,
  onEdit,
  onSave,
  placeholder
}: FightingArtItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState(
    form.getValues(`${arrayName}.${index}`) || ''
  )

  useEffect(
    () => setValue(form.getValues(`${arrayName}.${index}`) || ''),
    [form, isDisabled, index, arrayName]
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
    if (e.key === 'Enter') {
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
        placeholder={placeholder}
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
          title={`Edit ${placeholder.toLowerCase()}`}>
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title={`Save ${placeholder.toLowerCase()}`}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemove(index)}
        title={`Remove ${placeholder.toLowerCase()}`}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Fighting Art Item Component
 */
export function NewFightingArtItem({
  onSave,
  onCancel,
  placeholder
}: NewFightingArtItemProps) {
  const [value, setValue] = useState('')

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current value. If the Escape key is pressed, it calls the onCancel
   * function.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(value)
    } else if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        placeholder={placeholder}
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
        onClick={() => onSave(value)}
        title={`Save ${placeholder.toLowerCase()}`}>
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
