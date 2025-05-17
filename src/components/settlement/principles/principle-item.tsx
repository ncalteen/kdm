'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Principle, Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Principle Item Component Properties
 */
export interface PrincipleItemProps {
  /** Auto Focus */
  autoFocus?: boolean
  /** Form */
  form: UseFormReturn<Settlement>
  /** Remove Principle Handler */
  handleRemovePrinciple: (index: number) => void
  /** Update Principle Handler */
  handleUpdatePrinciple: (index: number, field: string, value: string) => void
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
 * Principle Item Component
 */
export function PrincipleItem({
  id,
  index,
  principle,
  isDisabled,
  onEdit,
  onSave,
  handleRemovePrinciple,
  handleOptionSelect,
  autoFocus
}: PrincipleItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [nameValue, setNameValue] = useState<string | undefined>(principle.name)
  const [option1Value, setOption1Value] = useState<string | undefined>(
    principle.option1Name
  )
  const [option2Value, setOption2Value] = useState<string | undefined>(
    principle.option2Name
  )

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNameValue(principle.name)
    setOption1Value(principle.option1Name)
    setOption2Value(principle.option2Name)
  }, [principle.name, principle.option1Name, principle.option2Name])

  useEffect(() => {
    if (autoFocus && nameInputRef.current) nameInputRef.current.focus()
  }, [autoFocus])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameValue(e.target.value)

  const handleOption1Change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOption1Value(e.target.value)

  const handleOption2Change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOption2Value(e.target.value)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameValue && option1Value && option2Value) {
      e.preventDefault()
      onSave(index, nameValue, option1Value, option2Value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 border rounded-md p-3">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {isDisabled ? (
            <Input
              value={nameValue}
              disabled
              className="w-full"
              id={`principle-${index}-name`}
              name={`principles[${index}].name`}
            />
          ) : (
            <Input
              placeholder="Name"
              className="w-full"
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              autoFocus={!!autoFocus}
              id={`principle-${index}-name`}
              name={`principles[${index}].name`}
              ref={nameInputRef}
            />
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={principle.option1Selected}
              disabled={!isDisabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleOptionSelect(index, 1)
                }
              }}
              id={`principle-${index}-option1-selected`}
              name={`principles[${index}].option1Selected`}
            />
            {isDisabled ? (
              <Input
                value={option1Value}
                disabled
                className="flex-1"
                id={`principle-${index}-option1-name`}
                name={`principles[${index}].option1Name`}
              />
            ) : (
              <Input
                placeholder="Option 1"
                value={option1Value}
                className="flex-1"
                onChange={handleOption1Change}
                onKeyDown={handleKeyDown}
                id={`principle-${index}-option1-name`}
                name={`principles[${index}].option1Name`}
              />
            )}
            <strong>or</strong>
            <Checkbox
              checked={principle.option2Selected}
              disabled={!isDisabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleOptionSelect(index, 2)
                }
              }}
              id={`principle-${index}-option2-selected`}
              name={`principles[${index}].option2Selected`}
            />
            {isDisabled ? (
              <Input
                value={option2Value}
                disabled
                className="flex-1"
                id={`principle-${index}-option2-name`}
                name={`principles[${index}].option2Name`}
              />
            ) : (
              <Input
                placeholder="Option 2"
                value={option2Value}
                className="flex-1"
                onChange={handleOption2Change}
                onKeyDown={handleKeyDown}
                id={`principle-${index}-option2-name`}
                name={`principles[${index}].option2Name`}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 self-stretch">
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
            size="sm"
            className="h-8 w-8"
            type="button"
            onClick={() => handleRemovePrinciple(index)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
