'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Pattern Item Component Properties
 */
export interface PatternItemProps {
  /** Form */
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  /** Remove Pattern Handler */
  handleRemovePattern: (index: number) => void
  /** Pattern ID */
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
 * New Pattern Item Component Properties
 */
export interface NewPatternItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
}

/**
 * Pattern Item Component
 *
 * @param props Pattern Item Component Props
 */
export function PatternItem({
  index,
  form,
  handleRemovePattern,
  id,
  isDisabled,
  onSave,
  onEdit
}: PatternItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState(form.getValues(`patterns.${index}`) || '')

  useEffect(
    () => setValue(form.getValues(`patterns.${index}`) || ''),
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
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, value)
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
      <Input
        placeholder="Pattern"
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
          title="Edit pattern">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title="Save pattern">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemovePattern(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Pattern Item Component
 */
export function NewPatternItem({ onSave, onCancel }: NewPatternItemProps) {
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
        placeholder="Pattern"
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
        title="Save pattern">
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
