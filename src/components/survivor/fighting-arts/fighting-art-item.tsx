'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Fighting Art Item Component Properties
 */
export interface FightingArtItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
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
 *
 * @param props Fighting Art Item Component Props
 * @returns ReactElement
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
}: FightingArtItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value = form.getValues(`${arrayName}.${index}`) || ''
  }, [form, isDisabled, index, arrayName])

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current index and value.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(index, inputRef.current.value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={form.getValues(`${arrayName}.${index}`) || ''}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
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
          onClick={() => {
            if (inputRef.current && inputRef.current.value)
              onSave(index, inputRef.current.value)
          }}
          title={`Save ${placeholder.toLowerCase()}`}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => handleRemove(index)}
        title={`Remove ${placeholder.toLowerCase()}`}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Fighting Art Item Component
 *
 * @param props New Fighting Art Item Component Props
 * @returns ReactElement
 */
export function NewFightingArtItem({
  onSave,
  onCancel,
  placeholder
}: NewFightingArtItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current value. If the Escape key is pressed, it calls the onCancel
   * function.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
    } else if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex items-center">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          if (inputRef.current && inputRef.current.value)
            onSave(inputRef.current.value)
        }}
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
