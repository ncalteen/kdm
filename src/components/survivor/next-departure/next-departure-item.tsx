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
 * Next Departure Item Component Properties
 */
export interface NextDepartureItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
  /** Remove Next Departure Handler */
  handleRemoveNextDeparture: (index: number) => void
  /** Next Departure ID */
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
 * New Next Departure Item Component Properties
 */
export interface NewNextDepartureItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
}

/**
 * Next Departure Item Component
 *
 * @param props Next Departure Item Component Props
 */
export function NextDepartureItem({
  index,
  form,
  handleRemoveNextDeparture,
  id,
  isDisabled,
  onSave,
  onEdit
}: NextDepartureItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value = form.getValues(`nextDeparture.${index}`) || ''
  }, [form, isDisabled, index])

  const style = { transform: CSS.Transform.toString(transform), transition }

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
    <div ref={setNodeRef} style={style} className="flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        placeholder="Next Departure"
        defaultValue={form.getValues(`nextDeparture.${index}`)}
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
          title="Edit next departure">
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
          title="Save next departure">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => handleRemoveNextDeparture(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Next Departure Item Component
 *
 * @param props New Next Departure Item Component Props
 */
export function NewNextDepartureItem({
  onSave,
  onCancel
}: NewNextDepartureItemProps): ReactElement {
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
      <Input
        ref={inputRef}
        placeholder="Next Departure"
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
        title="Save next departure">
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
