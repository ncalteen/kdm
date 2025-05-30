'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Quarry ID */
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
  onSave: (
    value?: string,
    node?: string,
    unlocked?: boolean,
    index?: number
  ) => void
  /** OnToggleUnlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** OnUpdateNode Handler */
  onUpdateNode: (index: number, node: string) => void
}

/**
 * New Quarry Item Component Properties
 */
export interface NewQuarryItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value?: string, node?: string, unlocked?: boolean) => void
}

/**
 * Quarry Item Component
 *
 * @param props Quarry Item Component Properties
 * @returns Quarry Item Component
 */
export function QuarryItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave,
  onToggleUnlocked,
  onUpdateNode
}: QuarryItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)
  const quarry = form.watch(`quarries.${index}`)

  useEffect(() => {
    if (inputRef.current && quarry) {
      inputRef.current.value = quarry.name || ''
    }

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [form, isDisabled, index, quarry])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current && quarry) {
      e.preventDefault()
      onSave(inputRef.current.value, quarry.node, quarry.unlocked, index)
    }
  }

  if (!quarry) return <></>

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

      {/* Unlocked Checkbox */}
      <Checkbox
        checked={quarry.unlocked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') onToggleUnlocked(index, checked)
        }}
      />

      {/* Input Field */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">{quarry.name}</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Quarry name"
          defaultValue={quarry.name}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      {/* Node Selection */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Badge variant="secondary" className="h-8 w-20">
            {quarry.node}
          </Badge>
        ) : (
          <Select
            value={quarry.node}
            onValueChange={(value) => onUpdateNode(index, value)}
            disabled={isDisabled}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder={quarry.node} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Node 1">Node 1</SelectItem>
              <SelectItem value="Node 2">Node 2</SelectItem>
              <SelectItem value="Node 3">Node 3</SelectItem>
              <SelectItem value="Node 4">Node 4</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Interaction Buttons */}
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit quarry">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onSave(
                inputRef.current?.value,
                quarry.node,
                quarry.unlocked,
                index
              )
            }
            title="Save quarry">
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
 * New Quarry Item Component
 *
 * @param props New Quarry Item Component Props
 */
export function NewQuarryItem({
  onCancel,
  onSave
}: NewQuarryItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const nodeRef = useRef<string>('Node 1')

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
      onSave(inputRef.current.value, nodeRef.current, false)
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

      {/* Unlocked Checkbox */}
      <Checkbox checked={false} disabled />

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Add a quarry..."
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Node Selection */}
        <Select
          defaultValue="Node 1"
          onValueChange={(value) => (nodeRef.current = value)}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="Node" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Node 1">Node 1</SelectItem>
            <SelectItem value="Node 2">Node 2</SelectItem>
            <SelectItem value="Node 3">Node 3</SelectItem>
            <SelectItem value="Node 4">Node 4</SelectItem>
          </SelectContent>
        </Select>

        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            onSave(inputRef.current?.value, nodeRef.current, false)
          }
          title="Save quarry">
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
