'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'

/**
 * Disorder Item Component Properties
 */
export interface DisorderItemProps {
  /** Disorder ID */
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
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * New Disorder Item Component Properties
 */
export interface NewDisorderItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value?: string) => void
}

/**
 * Disorder Item Component
 *
 * @param props Disorder Item Component Properties
 * @returns Disorder Item Component
 */
export function DisorderItem({
  id,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave,
  selectedSurvivor
}: DisorderItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.debug(
      '[DisorderItem] Changed',
      selectedSurvivor?.disorders?.[index],
      index
    )

    if (inputRef.current)
      inputRef.current.value = selectedSurvivor?.disorders?.[index] || ''
  }, [selectedSurvivor?.disorders, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
          <span className="text-sm">
            {selectedSurvivor?.disorders?.[index]}
          </span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Disorder"
          defaultValue={selectedSurvivor?.disorders?.[index]}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit disorder">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current!.value, index)}
            title="Save disorder">
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
 * New Disorder Item Component
 *
 * @param props New Disorder Item Component Props
 * @returns New Disorder Item Component
 */
export function NewDisorderItem({
  onCancel,
  onSave
}: NewDisorderItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * value. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        placeholder="Disorder"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(inputRef.current?.value)}
          title="Save disorder">
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
