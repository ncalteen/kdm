'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Innovation Item Component Properties
 */
export interface InnovationItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Remove Innovation Callback */
  handleRemoveInnovation: (index: number) => void
  /** Innovation ID */
  id: string
  /** Innovation Index */
  index: number
  /** Disabled Status */
  isDisabled: boolean
  /** OnEdit Callback */
  onEdit: (index: number) => void
  /** OnSave Callback */
  onSave: (index: number) => void
}

/**
 * New Innovation Item Component Properties
 */
export interface NewInnovationItemProps {
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (value: string) => void
}

/**
 * Innovation Item Component
 */
export function InnovationItem({
  index,
  form,
  handleRemoveInnovation,
  id,
  isDisabled,
  onSave,
  onEdit
}: InnovationItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <FormField
        control={form.control}
        name={`innovations.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Innovation"
                {...field}
                value={field.value || ''}
                disabled={isDisabled}
                onChange={(e) => {
                  form.setValue(`innovations.${index}`, e.target.value)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit innovation">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index)}
          title="Save innovation">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveInnovation(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Innovation Item Component
 */
export function NewInnovationItem({
  onSave,
  onCancel
}: NewInnovationItemProps): ReactElement {
  const [value, setValue] = useState<string | undefined>(undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSave = () => {
    if (value && value.trim() !== '') onSave(value.trim())
    else toast.warning('Cannot record an empty innovation.')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  useEffect(() => {
    const input = document.getElementById(
      'new-innovation-input'
    ) as HTMLInputElement

    if (input) input.focus()
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        id="new-innovation-input"
        placeholder="Add an innovation..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save innovation">
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
