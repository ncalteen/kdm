'use client'

import { Badge } from '@/components/ui/badge'
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
  /** Fighting Art ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: () => void
  /** OnRemove Handler */
  onRemove: () => void
  /** OnSave Handler */
  onSave: (value?: string) => void
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
  onSave: (value?: string) => void
  /** Placeholder Text */
  placeholder: string
  /** Art Type for badge */
  artType?: 'regular' | 'secret'
}

/**
 * Fighting Art Item Component
 *
 * @param props Fighting Art Item Component Properties
 * @returns Fighting Art Item Component
 */
export function FightingArtItem({
  arrayName,
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave,
  placeholder
}: FightingArtItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value = form.getValues(`${arrayName}.${index}`) || ''

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [form, isDisabled, index, arrayName])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
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

      {/* Type Badge */}
      <Badge
        variant={arrayName === 'fightingArts' ? 'default' : 'secondary'}
        className="mr-2 min-w-[70px] text-center">
        {arrayName === 'fightingArts' ? 'Fighting' : 'Secret'}
      </Badge>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={form.getValues(`${arrayName}.${index}`) || ''}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      {/* Interaction Buttons */}
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => onEdit()}
          title={`Edit ${placeholder.toLowerCase()}`}>
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => onSave(inputRef.current!.value)}
          title={`Save ${placeholder.toLowerCase()}`}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onRemove()}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Fighting Art Item Component
 *
 * @param props New Fighting Art Item Component Props
 * @returns New Fighting Art Item Component
 */
export function NewFightingArtItem({
  onCancel,
  onSave,
  placeholder,
  artType = 'regular'
}: NewFightingArtItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * value. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
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

      {/* Type Badge */}
      <Badge
        variant={artType === 'regular' ? 'default' : 'secondary'}
        className="mr-2 min-w-[70px] text-center">
        {artType === 'regular' ? 'Fighting' : 'Secret'}
      </Badge>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      {/* Interaction Buttons */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() => onSave(inputRef.current?.value)}
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
