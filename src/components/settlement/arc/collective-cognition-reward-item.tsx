'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useRef, useState } from 'react'

/**
 * Reward Item Component Properties
 */
export interface RewardItemProps {
  /** Reward ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** Reward Data */
  reward: { name: string; cc: number; unlocked: boolean }
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (name?: string, cc?: number, index?: number) => void
  /** OnToggleUnlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
}

/**
 * New Reward Item Component Properties
 */
export interface NewRewardItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (name?: string, cc?: number) => void
}

/**
 * Reward Item Component
 *
 * @param props Reward Item Component Properties
 * @returns Reward Item Component
 */
export function RewardItem({
  id,
  index,
  isDisabled,
  reward,
  onEdit,
  onRemove,
  onSave,
  onToggleUnlocked
}: RewardItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const nameInputRef = useRef<HTMLInputElement>(null)
  const ccInputRef = useRef<HTMLInputElement>(null)

  // Track the current CC value for the NumericInput
  const [currentCcValue, setCurrentCcValue] = useState(reward?.cc ?? 1)

  /**
   * Handles the key down event for the input fields.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameInputRef.current && ccInputRef.current) {
      e.preventDefault()

      onSave(
        nameInputRef.current.value,
        parseInt(ccInputRef.current.value, 10),
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
        checked={reward?.unlocked ?? false}
        onCheckedChange={(checked) => {
          if (checked !== 'indeterminate') onToggleUnlocked(index, checked)
        }}
        disabled={!isDisabled}
      />

      {/* CC Value Input */}
      <NumericInput
        label="Collective Cognition"
        value={currentCcValue}
        onChange={(value) => {
          setCurrentCcValue(value)
          if (ccInputRef.current) ccInputRef.current.value = value.toString()
        }}
        min={0}
        className="w-12 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        ref={ccInputRef}
        disabled={isDisabled}
      />

      {/* Reward Name Input */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">{reward.name}</span>
        </div>
      ) : (
        <Input
          ref={nameInputRef}
          placeholder="Add a reward..."
          defaultValue={reward.name}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
        />
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit reward">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (nameInputRef.current && ccInputRef.current) {
                const ccValue = parseInt(ccInputRef.current.value, 10)
                onSave(nameInputRef.current.value, ccValue, index)
              }
            }}
            title="Save reward">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onRemove(index)}
          title="Remove reward">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Reward Item Component
 *
 * @param props New Reward Item Component Props
 */
export function NewRewardItem({
  onCancel,
  onSave
}: NewRewardItemProps): ReactElement {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const ccInputRef = useRef<HTMLInputElement>(null)

  // Track the current CC value for the NumericInput
  const [currentCcValue, setCurrentCcValue] = useState(1)

  /**
   * Handles the key down event for the input fields.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * values. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameInputRef.current && ccInputRef.current) {
      e.preventDefault()

      onSave(nameInputRef.current.value, parseInt(ccInputRef.current.value, 10))
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
      <Checkbox disabled />

      {/* CC Value Input */}
      <NumericInput
        label="Collective Cognition"
        value={currentCcValue}
        onChange={(value) => {
          setCurrentCcValue(value)
          if (ccInputRef.current) ccInputRef.current.value = value.toString()
        }}
        min={0}
        className="w-12 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        ref={ccInputRef}
      />

      {/* Reward Name Input */}
      <Input
        ref={nameInputRef}
        placeholder="Add a reward..."
        defaultValue={''}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Action Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (nameInputRef.current && ccInputRef.current)
              onSave(
                nameInputRef.current.value,
                parseInt(ccInputRef.current.value, 10)
              )
          }}
          title="Save reward">
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
