'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Button } from '@/components/ui/button'
import { Philosophy } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useRef, useState } from 'react'

/**
 * Philosophy Item Component Properties
 */
export interface PhilosophyItemProps {
  /** Philosophy ID */
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
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * New Philosophy Item Component Properties
 */
export interface NewPhilosophyItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value?: string) => void
}

/**
 * Philosophy Item Component
 *
 * @param props Philosophy Item Component Properties
 * @returns Philosophy Item Component
 */
export function PhilosophyItem({
  id,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave,
  selectedSettlement
}: PhilosophyItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const selectRef = useRef<HTMLButtonElement>(null)

  /**
   * Handles the key down event for the select field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      onSave(selectedSettlement?.philosophies?.[index], index)
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

      {/* Select Field */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">
            {selectedSettlement?.philosophies?.[index]}
          </span>
        </div>
      ) : (
        <SelectPhilosophy
          ref={selectRef}
          options={Object.values(Philosophy)}
          value={selectedSettlement?.philosophies?.[index]}
          onChange={(value) => {
            if (!isDisabled) onSave(value, index)
          }}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
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
            title="Edit philosophy">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onSave(selectedSettlement?.philosophies?.[index], index)
            }
            title="Save philosophy">
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
 * New Philosophy Item Component
 *
 * @param props New Philosophy Item Component Props
 */
export function NewPhilosophyItem({
  onCancel,
  onSave
}: NewPhilosophyItemProps): ReactElement {
  const selectRef = useRef<HTMLButtonElement>(null)
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  )

  /**
   * Handles the key down event for the select field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * value. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(selectedValue)
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

      {/* Select Field */}
      <SelectPhilosophy
        ref={selectRef}
        options={Object.values(Philosophy)}
        value={selectedValue as Philosophy}
        onChange={(value) => setSelectedValue(value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(selectedValue)}
          title="Save philosophy">
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
