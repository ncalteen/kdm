'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Nemesis Item Properties
 */
export interface NemesisItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Nemesis ID */
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
  onSave: (name?: string, unlocked?: boolean, index?: number) => void
  /** OnToggleLevel Handler */
  onToggleLevel: (
    index: number,
    level:
      | 'level1'
      | 'level2'
      | 'level3'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => void
  /** OnToggleUnlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
}

/**
 * New Nemesis Item Component Properties
 */
export interface NewNemesisItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (name?: string, unlocked?: boolean) => void
}

/**
 * Nemesis Item Component
 *
 * @param props Nemesis Item Component Properties
 * @returns Nemesis Item Component
 */
export function NemesisItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave,
  onToggleLevel,
  onToggleUnlocked
}: NemesisItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)
  const nemesis = form.watch(`nemeses.${index}`)

  useEffect(() => {
    console.debug('[NemesisItem] Changed', isDisabled, index)
    if (inputRef.current && nemesis) {
      inputRef.current.value = nemesis.name || ''
    }

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [form, isDisabled, index, nemesis])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, nemesis?.unlocked, index)
    }
  }

  if (!nemesis) return <></>

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
        checked={nemesis.unlocked}
        onCheckedChange={(checked) => {
          if (checked !== 'indeterminate') onToggleUnlocked(index, !!checked)
        }}
        id={`nemesis-${index}-unlocked`}
      />

      {/* Input Field */}
      {isDisabled ? (
        <div className="flex flex-1 ml-1">
          <span className="text-xs">{nemesis.name}</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Add a nemesis..."
          defaultValue={nemesis.name}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      {/* Level Checkboxes */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center space-x-1">
              <Checkbox
                checked={nemesis.level1}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level1', !!checked)
                }}
                id={`nemesis-${index}-level1`}
              />
              <label className="text-xs" htmlFor={`nemesis-${index}-level1`}>
                Lvl 1
              </label>
            </div>

            <div className="flex items-center space-x-1">
              <Checkbox
                checked={nemesis.level2}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level2', !!checked)
                }}
                id={`nemesis-${index}-level2`}
              />
              <label className="text-xs" htmlFor={`nemesis-${index}-level2`}>
                Lvl 2
              </label>
            </div>

            <div className="flex items-center space-x-1">
              <Checkbox
                checked={nemesis.level3}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level3', !!checked)
                }}
                id={`nemesis-${index}-level3`}
              />
              <label className="text-xs" htmlFor={`nemesis-${index}-level3`}>
                Lvl 3
              </label>
            </div>
          </div>
        )}

        {/* Interaction Buttons */}
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit nemesis">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onSave(inputRef.current!.value, nemesis.unlocked, index)
            }
            title="Save nemesis">
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
 * New Nemesis Item Component
 *
 * @param props New Nemesis Item Component Props
 */
export function NewNemesisItem({
  onCancel,
  onSave
}: NewNemesisItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

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
      if (!inputRef.current.value || inputRef.current.value.trim() === '') {
        toast.error('A nameless horror cannot be summoned.')
        return
      }
      onSave(inputRef.current.value, false)
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
      <Checkbox checked={false} disabled={true} id="nemesis-new-unlocked" />

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Add a nemesis..."
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      {/* Interaction Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (
              !inputRef.current?.value ||
              inputRef.current.value.trim() === ''
            ) {
              return toast.error('A nameless horror cannot be summoned.')
            }
            onSave(inputRef.current.value, false)
          }}
          title="Save nemesis">
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
