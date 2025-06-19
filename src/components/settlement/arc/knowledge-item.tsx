'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Philosophy } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Knowledge Item Component Properties
 */
export interface KnowledgeItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Knowledge ID */
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
  onSave: (name?: string, philosophy?: string, index?: number) => void
  /** Available Philosophies */
  philosophies: Philosophy[]
}

/**
 * New Knowledge Item Component Properties
 */
export interface NewKnowledgeItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (name?: string, philosophy?: string) => void
  /** Available Philosophies */
  philosophies: Philosophy[]
}

/**
 * Knowledge Item Component
 *
 * @param props Knowledge Item Component Properties
 * @returns Knowledge Item Component
 */
export function KnowledgeItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave,
  philosophies
}: KnowledgeItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)

  const watchedKnowledgeItem = form.watch(`knowledges.${index}`)

  useEffect(() => {
    console.debug(
      '[KnowledgeItem] Changed',
      watchedKnowledgeItem,
      isDisabled,
      index
    )

    if (inputRef.current)
      inputRef.current.value = watchedKnowledgeItem?.name || ''

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [watchedKnowledgeItem, isDisabled, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()

      onSave(inputRef.current.value, watchedKnowledgeItem?.philosophy, index)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        isDisabled
          ? 'flex items-center gap-1'
          : 'flex flex-col gap-1 rounded-md'
      }>
      {isDisabled ? (
        // Display mode - single line
        <>
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Knowledge Name */}
          <div className="flex ml-1">
            <span className="text-xs">{watchedKnowledgeItem?.name || ''}</span>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Philosophy Badge */}
            <div className="flex ml-1">
              <span className="text-xs">
                <Badge variant="outline">
                  {watchedKnowledgeItem?.philosophy || 'None'}
                </Badge>
              </span>
            </div>

            {/* Interaction Buttons */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(index)}
              title="Edit knowledge">
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onRemove(index)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        // Edit mode - multi-line
        <div className="flex items-center gap-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-1">
            {/* Knowledge Name Input */}
            <Input
              ref={inputRef}
              placeholder="Add knowledge..."
              defaultValue={watchedKnowledgeItem?.name || ''}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            {/* Philosophy Selection */}
            <SelectPhilosophy
              ref={selectRef}
              options={philosophies}
              value={watchedKnowledgeItem?.philosophy ?? ''}
              onChange={(value) =>
                onSave(watchedKnowledgeItem?.name, value, index)
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                onSave(
                  inputRef.current!.value,
                  watchedKnowledgeItem?.philosophy,
                  index
                )
              }
              title="Save knowledge">
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onRemove(index)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * New Knowledge Item Component
 *
 * @param props New Knowledge Item Component Props
 */
export function NewKnowledgeItem({
  onCancel,
  onSave,
  philosophies
}: NewKnowledgeItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<
    Philosophy | undefined
  >(undefined)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * values. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, selectedPhilosophy)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex flex-col gap-1 rounded-md">
      <div className="flex items-center gap-1">
        {/* Drag Handle */}
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-1">
          {/* Knowledge Name Input */}
          <Input
            ref={inputRef}
            placeholder="Add knowledge..."
            defaultValue={''}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {/* Philosophy Selection */}
          <SelectPhilosophy
            ref={selectRef}
            options={philosophies}
            value={selectedPhilosophy}
            onChange={(value) => setSelectedPhilosophy(value as Philosophy)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current?.value, selectedPhilosophy)}
            title="Save knowledge">
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
