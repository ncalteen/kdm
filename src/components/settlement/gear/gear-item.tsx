'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Gear Item Component Properties
 */
export interface GearItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Remove Gear Callback */
  handleRemoveGear: (index: number) => void
  /** Gear ID */
  id: string
  /** Gear Index */
  index: number
  /** Disabled Status */
  isDisabled: boolean
  /** OnEdit Callback */
  onEdit: (index: number) => void
  /** OnSave Callback */
  onSave: (index: number, value: string) => void
}

/**
 * New Gear Item Component Properties
 */
export interface NewGearItemProps {
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (value: string) => void
}

/**
 * Gear Item Component
 */
export function GearItem({
  index,
  form,
  handleRemoveGear,
  id,
  isDisabled,
  onSave,
  onEdit
}: GearItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState(form.getValues(`gear.${index}`) || '')

  useEffect(() => {
    setValue(form.getValues(`gear.${index}`) || '')
  }, [form, isDisabled, index])

  const style = { transform: CSS.Transform.toString(transform), transition }
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
        placeholder="Gear item"
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
          title="Edit gear">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title="Save gear">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ml-2"
        type="button"
        onClick={() => handleRemoveGear(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Gear Item Component
 */
export function NewGearItem({
  onSave,
  onCancel
}: NewGearItemProps): ReactElement {
  const [value, setValue] = useState('')

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
        placeholder="Gear item"
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
  )
}
