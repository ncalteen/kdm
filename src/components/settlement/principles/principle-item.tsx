'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettlementPrinciple } from '@/schemas/settlement-principle'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useRef, useState } from 'react'

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
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => void
  /** Principle */
  principle: SettlementPrinciple
}

/**
 * New Principle Item Component Properties
 */
export interface NewPrincipleItemProps {
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
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

  const nameInputRef = useRef<HTMLInputElement>(null)
  const option1InputRef = useRef<HTMLInputElement>(null)
  const option2InputRef = useRef<HTMLInputElement>(null)

  /**
   * Handle Key Down
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const name = nameInputRef.current?.value ?? ''
      const option1 = option1InputRef.current?.value ?? ''
      const option2 = option2InputRef.current?.value ?? ''

      if (name && option1 && option2) {
        e.preventDefault()
        onSave(index, name, option1, option2)
      }
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
              <div className="col-span-4 text-sm text-left font-bold">
                {principle.name}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <Checkbox
                  id={`principle-${index}-option-1`}
                  checked={principle.option1Selected}
                  onCheckedChange={(checked) => {
                    if (checked) handleOptionSelect(index, 1)
                  }}
                />
                <Label
                  className="text-xs text-left"
                  htmlFor={`principle-${index}-option-1`}>
                  {principle.option1Name}
                </Label>
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <Checkbox
                  id={`principle-${index}-option-2`}
                  checked={principle.option2Selected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleOptionSelect(index, 2)
                    }
                  }}
                />
                <Label
                  className="text-xs text-left"
                  htmlFor={`principle-${index}-option-2`}>
                  {principle.option2Name}
                </Label>
              </div>
            </div>
          ) : (
            // Edit mode - multi-line with input fields
            <div className="flex flex-col gap-1">
              {/* Principle Name */}
              <Input
                ref={nameInputRef}
                placeholder="Principle Name"
                defaultValue={principle.name}
                onKeyDown={handleKeyDown}
              />

              {/* Options */}
              <div className="flex items-center gap-2">
                <Checkbox checked={principle.option1Selected} disabled />
                <Input
                  ref={option1InputRef}
                  placeholder="Option 1"
                  defaultValue={principle.option1Name}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Checkbox checked={principle.option2Selected} disabled />
                <Input
                  ref={option2InputRef}
                  placeholder="Option 2"
                  defaultValue={principle.option2Name}
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
                const name = nameInputRef.current?.value ?? ''
                const option1 = option1InputRef.current?.value ?? ''
                const option2 = option2InputRef.current?.value ?? ''

                if (name && option1 && option2)
                  onSave(index, name, option1, option2)
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
