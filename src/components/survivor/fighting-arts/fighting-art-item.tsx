'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'

/**
 * Fighting Art Item Component Properties
 */
export interface FightingArtItemProps {
  /** Array Name */
  arrayName: 'fightingArts' | 'secretFightingArts'
  /** Fighting Art ID */
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
  /** Placeholder Text */
  placeholder: string
  /** Selected Survivor  */
  selectedSurvivor: Survivor | null
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
  onEdit,
  onRemove,
  onSave,
  placeholder,
  selectedSurvivor
}: FightingArtItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.debug('[FightingArtItem] Changed', index)

    if (inputRef.current)
      inputRef.current.value = selectedSurvivor?.[arrayName]?.[index] ?? ''
  }, [selectedSurvivor, index, arrayName])

  /**
   * Handle Key Down Event
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * value.
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

      {/* Type Badge */}
      <Badge
        variant={arrayName === 'fightingArts' ? 'default' : 'secondary'}
        className="w-[70px]">
        {arrayName === 'fightingArts' ? 'Fighting' : 'Secret'}
      </Badge>

      {/* Input Field */}
      {isDisabled ? (
        <span className="text-sm ml-1">
          {selectedSurvivor?.[arrayName]?.[index]}
        </span>
      ) : (
        <Input
          ref={inputRef}
          placeholder={placeholder}
          defaultValue={selectedSurvivor?.[arrayName]?.[index]}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
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
            title={`Edit ${placeholder.toLowerCase()}`}>
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current!.value, index)}
            title={`Save ${placeholder.toLowerCase()}`}>
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
 * New Fighting Art Item Component
 *
 * @param props New Fighting Art Item Component Properties
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
   * Handle Key Down Event
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

      {/* Type Badge */}
      <Badge
        variant={artType === 'regular' ? 'default' : 'secondary'}
        className="w-[70px]">
        {artType === 'regular' ? 'Fighting' : 'Secret'}
      </Badge>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={''}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
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
    </div>
  )
}
