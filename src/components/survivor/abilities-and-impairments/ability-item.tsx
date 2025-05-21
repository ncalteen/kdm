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
 * Ability Item Component Properties
 */
export interface AbilityItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
  /** Remove Ability Handler */
  handleRemoveAbility: (index: number) => void
  /** Ability ID */
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
 * New Ability Item Component Properties
 */
export interface NewAbilityItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
}

/**
 * Ability Item Component
 *
 * @param props Ability Item Component Props
 */
export function AbilityItem({
  index,
  form,
  handleRemoveAbility,
  id,
  isDisabled,
  onSave,
  onEdit
}: AbilityItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value =
        form.getValues(`abilitiesAndImpairments.${index}`) || ''
  }, [form, isDisabled, index])

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
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Ability or Impairment"
        defaultValue={form.getValues(`abilitiesAndImpairments.${index}`)}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
      />

      {/* Interaction Buttons */}
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit ability">
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
          title="Save ability">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => handleRemoveAbility(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Ability Item Component
 *
 * @param props New Ability Item Component Props
 */
export function NewAbilityItem({
  onSave,
  onCancel
}: NewAbilityItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it prevents the default action and calls the
   * onSave function with the current value. If the Escape key is pressed, it
   * calls the onCancel function.
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
      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Ability or Impairment"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />

      {/* Interaction Buttons */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          if (inputRef.current && inputRef.current.value)
            onSave(inputRef.current.value)
        }}
        title="Save ability">
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
