'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Gear Item Component Properties
 */
export interface GearItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Gear ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (value?: string, index?: number) => void
}

/**
 * New Gear Item Component Properties
 */
export interface NewGearItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value?: string) => void
}

/**
 * Gear Item Component
 *
 * @param props Gear Item Component Properties
 * @returns Gear Item Component
 */
export function GearItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave
}: GearItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value = form.getValues(`gear.${index}`) || ''

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [form, isDisabled, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, index)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Input Field */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">{form.getValues(`gear.${index}`)}</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Gear item"
          defaultValue={form.getValues(`gear.${index}`)}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit gear">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current!.value, index)}
            title="Save gear">
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
    </div>
  )
}

/**
 * New Gear Item Component
 *
 * @param props New Gear Item Component Props
 */
export function NewGearItem({
  onCancel,
  onSave
}: NewGearItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * value. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Gear item"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(inputRef.current?.value)}
          title="Save gear">
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
    </div>
  )
}
