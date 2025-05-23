'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Departing Bonus Item Component Properties
 */
export interface DepartingBonusItemProps {
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnChange Callback */
  onChange: (index: number, value: string) => void
  /** OnEdit Callback */
  onEdit: (index: number) => void
  /** OnRemove Callback */
  onRemove: (index: number) => void
  /** OnSave Callback */
  onSave: (index: number) => void
  /** Value */
  value: string
}

/**
 * New Departing Bonus Item Component Properties
 */
export interface NewDepartingBonusItemProps {
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (bonus: string) => void
}

/**
 * Departing Bonus Item Component
 */
export function DepartingBonusItem({
  index,
  value,
  isDisabled,
  onSave,
  onEdit,
  onRemove,
  onChange
}: DepartingBonusItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() })
  const [inputValue, setInputValue] = useState<string>(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setInputValue(value), [value])

  useEffect(() => {
    if (!isDisabled && inputRef.current) inputRef.current.focus()
  }, [isDisabled])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange(index, e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index)
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
      {isDisabled ? (
        <Input value={inputValue} disabled className="flex-1" />
      ) : (
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
      )}
      <div className="flex items-center gap-2 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit bonus">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(index)}
            title="Save bonus">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          title="Remove bonus">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Departing Bonus Item Component
 */
export function NewDepartingBonusItem({
  onSave,
  onCancel
}: NewDepartingBonusItemProps) {
  const [value, setValue] = useState<string | undefined>(undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value)

  const handleSave = () => {
    if (value && value.trim() !== '') onSave(value.trim())
    else toast.warning('Cannot inscribe an empty blessing')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        placeholder="Inscribe a blessing..."
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
        title="Consecrate blessing">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
