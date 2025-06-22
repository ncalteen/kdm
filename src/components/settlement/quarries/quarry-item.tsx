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
import { NodeLevel } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Quarry ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (
    value?: string,
    node?: NodeLevel,
    unlocked?: boolean,
    index?: number
  ) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** On Update Node Handler */
  onUpdateNode: (index: number, node: NodeLevel) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * New Quarry Item Component Properties
 */
export interface NewQuarryItemProps {
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
  onSave: (value?: string, node?: NodeLevel, unlocked?: boolean) => void
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
  onEdit,
  onRemove,
  onSave,
  onToggleUnlocked,
  onUpdateNode,
  selectedSettlement
}: QuarryItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.debug(
      '[QuarryItem] Changed',
      selectedSettlement?.quarries?.[index],
      index
    )

    if (inputRef.current && selectedSettlement?.quarries?.[index])
      inputRef.current.value = selectedSettlement?.quarries?.[index].name || ''
  }, [selectedSettlement?.quarries, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      inputRef.current &&
      selectedSettlement?.quarries?.[index]
    ) {
      e.preventDefault()
      onSave(
        inputRef.current.value,
        selectedSettlement?.quarries?.[index].node,
        selectedSettlement?.quarries?.[index].unlocked,
        index
      )
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

      {/* Unlocked Checkbox */}
      <Checkbox
        checked={selectedSettlement?.quarries?.[index].unlocked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') onToggleUnlocked(index, checked)
        }}
      />

      {/* Input Field */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-xs">
            {selectedSettlement?.quarries?.[index].name}
          </span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Quarry name"
          defaultValue={selectedSettlement?.quarries?.[index].name}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      {/* Node Selection */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Badge variant="secondary" className="h-8 w-20">
            {selectedSettlement?.quarries?.[index].node}
          </Badge>
        ) : (
          <Select
            value={selectedSettlement?.quarries?.[index].node}
            onValueChange={(value) => onUpdateNode(index, value as NodeLevel)}
            disabled={isDisabled}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue
                placeholder={selectedSettlement?.quarries?.[index].node}
              />
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
                selectedSettlement?.quarries?.[index].node,
                selectedSettlement?.quarries?.[index].unlocked,
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, nodeRef.current as NodeLevel, false)
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
            onSave(inputRef.current?.value, nodeRef.current as NodeLevel, false)
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
