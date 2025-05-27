'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Principle } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'

/**
 * Principle Item Component Properties
 */
export interface PrincipleItemProps {
  /** Option Selection Handler */
  handleOptionSelect: (index: number, option: 1 | 2) => void
  /** Principle ID */
  id: string
  /** Principle Index */
  index: number
  /** Disabled State */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => void
  /** Principle */
  principle: Principle
}

/**
 * New Principle Item Component Properties
 */
export interface NewPrincipleItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (name: string, option1Name: string, option2Name: string) => void
}

/**
 * Principle Item Component
 *
 * @param props Principle Item Component Properties
 * @returns Principle Item Component
 */
export function PrincipleItem({
  id,
  index,
  principle,
  isDisabled,
  onEdit,
  onSave,
  onRemove,
  handleOptionSelect
}: PrincipleItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [nameValue, setNameValue] = useState<string>(principle.name || '')
  const [option1Value, setOption1Value] = useState<string>(
    principle.option1Name || ''
  )
  const [option2Value, setOption2Value] = useState<string>(
    principle.option2Name || ''
  )

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNameValue(principle.name || '')
    setOption1Value(principle.option1Name || '')
    setOption2Value(principle.option2Name || '')
  }, [principle.name, principle.option1Name, principle.option2Name])

  useEffect(() => {
    if (!isDisabled && nameInputRef.current) {
      nameInputRef.current.focus()

      const val = nameInputRef.current.value
      nameInputRef.current.value = ''
      nameInputRef.current.value = val
    }
  }, [isDisabled])

  /**
   * Handles the key down event for the input fields.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && nameValue && option1Value && option2Value) {
      e.preventDefault()
      onSave(index, nameValue, option1Value, option2Value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex flex-col gap-2 rounded-md p-1">
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Principle Name */}
          <Input
            ref={nameInputRef}
            placeholder="Principle Name"
            value={nameValue}
            disabled={isDisabled}
            onChange={(e) => setNameValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            autoFocus={!isDisabled}
          />

          {/* Options */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={principle.option1Selected}
              disabled={!isDisabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleOptionSelect(index, 1)
                }
              }}
            />
            <Input
              placeholder="Option 1"
              value={option1Value}
              disabled={isDisabled}
              onChange={(e) => setOption1Value(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <strong>or</strong>
            <Checkbox
              checked={principle.option2Selected}
              disabled={!isDisabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleOptionSelect(index, 2)
                }
              }}
            />
            <Input
              placeholder="Option 2"
              value={option2Value}
              disabled={isDisabled}
              onChange={(e) => setOption2Value(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          {isDisabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(index)}
              title="Edit principle">
              <PencilIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (nameValue && option1Value && option2Value)
                  onSave(index, nameValue, option1Value, option2Value)
              }}
              title="Save principle">
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onRemove(index)}
            title="Remove principle">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * New Principle Item Component
 *
 * @param props New Principle Item Component Props
 */
export function NewPrincipleItem({
  onCancel,
  onSave
}: NewPrincipleItemProps): ReactElement {
  const [name, setName] = useState<string>('')
  const [option1, setOption1] = useState<string>('')
  const [option2, setOption2] = useState<string>('')

  const nameInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input fields.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * values. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && name && option1 && option2) {
      e.preventDefault()
      onSave(name, option1, option2)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const handleSave = () => {
    if (name && option1 && option2) {
      onSave(name, option1, option2)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md p-1">
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Principle Name */}
          <Input
            ref={nameInputRef}
            placeholder="Principle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            autoFocus
          />

          {/* Options */}
          <div className="flex items-center gap-2">
            <Checkbox checked={false} disabled />
            <Input
              placeholder="Option 1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <strong>or</strong>
            <Checkbox checked={false} disabled />
            <Input
              placeholder="Option 2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSave}
            title="Save principle">
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
    </div>
  )
}
