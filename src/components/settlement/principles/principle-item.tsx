'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Principle } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef, useState } from 'react'

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
    console.debug('[PrincipleItem] Changed', principle)

    setNameValue(principle.name || '')
    setOption1Value(principle.option1Name || '')
    setOption2Value(principle.option2Name || '')
  }, [principle])

  /**
   * Handles the key down event for the input fields.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameValue && option1Value && option2Value) {
      e.preventDefault()
      onSave(index, nameValue, option1Value, option2Value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Form Fields */}
        <div className="flex-1">
          {isDisabled ? (
            // Display mode - principle name left, options in columns
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-4 text-xs text-left font-bold">
                {principle.name}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <Checkbox
                  checked={principle.option1Selected}
                  onCheckedChange={(checked) => {
                    if (checked) handleOptionSelect(index, 1)
                  }}
                />
                <span className="text-xs text-left">
                  {principle.option1Name}
                </span>
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <Checkbox
                  checked={principle.option2Selected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleOptionSelect(index, 2)
                    }
                  }}
                />
                <span className="text-xs text-left">
                  {principle.option2Name}
                </span>
              </div>
            </div>
          ) : (
            // Edit mode - multi-line with input fields
            <div className="flex flex-col gap-1">
              {/* Principle Name */}
              <Input
                ref={nameInputRef}
                placeholder="Principle Name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />

              {/* Options */}
              <div className="flex items-center gap-2">
                <Checkbox checked={principle.option1Selected} disabled />
                <Input
                  placeholder="Option 1"
                  value={option1Value}
                  onChange={(e) => setOption1Value(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Checkbox checked={principle.option2Selected} disabled />
                <Input
                  placeholder="Option 2"
                  value={option2Value}
                  onChange={(e) => setOption2Value(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name && option1 && option2) {
      e.preventDefault()
      onSave(name, option1, option2)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const handleSave = () => {
    if (name && option1 && option2) onSave(name, option1, option2)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-1">
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
        <div className="flex items-center gap-1 ml-auto">
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
