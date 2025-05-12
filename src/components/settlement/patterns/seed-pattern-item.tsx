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

interface SeedPatternItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveSeedPattern: (index: number) => void
  id: string
}

/**
 * Seed Pattern Item Component
 */
export function SeedPatternItem({
  index,
  form,
  handleRemoveSeedPattern,
  id,
  isDisabled,
  onSave,
  onEdit
}: SeedPatternItemProps & {
  isDisabled: boolean
  onSave: (index: number, value: string) => void
  onEdit: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState(
    form.getValues(`seedPatterns.${index}`) || ''
  )

  const style = { transform: CSS.Transform.toString(transform), transition }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, value)
    }
  }

  useEffect(() => {
    setValue(form.getValues(`seedPatterns.${index}`) || '')
  }, [form, isDisabled, index])

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder="Seed Pattern"
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
          title="Edit seed pattern">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title="Save seed pattern">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemoveSeedPattern(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function NewSeedPatternItem({
  onSave,
  onCancel
}: {
  onSave: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(value)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }
  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        placeholder="Seed Pattern"
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
        title="Save seed pattern">
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
