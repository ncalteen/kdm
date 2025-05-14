'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Location Item Component Properties
 */
export interface LocationItemProps {
  /** Form */
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  /** Remove Location Callback */
  handleRemoveLocation: (index: number) => void
  /** Toggle Location Unlocked Callback */
  toggleLocationUnlocked: (index: number, unlocked: boolean) => void
  /** Location ID */
  id: string
  /** Location Index */
  index: number
  /** Disabled Status */
  isDisabled: boolean
  /** OnEdit Callback */
  onEdit: (index: number) => void
  /** OnSave Callback */
  onSave: (index: number, name: string, unlocked: boolean) => void
}

/**
 * New Location Item Component Properties
 */
export interface NewLocationItemProps {
  /** Index */
  index: number
  /** OnCancel Callback */
  onCancel: () => void
  /** OnSave Callback */
  onSave: (name: string, unlocked: boolean) => void
}

/**
 * Settlement Location Item Component
 */
export function LocationItem({
  index,
  form,
  handleRemoveLocation,
  toggleLocationUnlocked,
  id,
  isDisabled,
  onSave,
  onEdit
}: LocationItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [nameValue, setNameValue] = useState(
    form.getValues(`locations.${index}.name`) || ''
  )
  const [unlockedValue, setUnlockedValue] = useState(
    form.getValues(`locations.${index}.unlocked`) || false
  )

  useEffect(() => {
    setNameValue(form.getValues(`locations.${index}.name`) || '')
    setUnlockedValue(form.getValues(`locations.${index}.unlocked`) || false)
  }, [form, isDisabled, index])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, unlockedValue)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        checked={unlockedValue}
        disabled={!isDisabled}
        onCheckedChange={(checked) => {
          setUnlockedValue(!!checked);
          toggleLocationUnlocked(index, !!checked);
        }}
        id={`location-${index}-unlocked`}
        name={`locations[${index}].unlocked`}
      />
      <Input
        placeholder="Location Name"
        value={nameValue}
        disabled={isDisabled}
        onChange={(e) => {
          if (!isDisabled) setNameValue(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        className="flex-1"
        id={`location-${index}-name`}
        name={`locations[${index}].name`}
      />
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit location">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, nameValue, unlockedValue)}
          title="Save location">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveLocation(index)}
        title="Remove location">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Location Item Component
 */
export function NewLocationItem({
  index,
  onSave,
  onCancel
}: NewLocationItemProps) {
  const [name, setName] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const handleSave = () => {
    onSave(name.trim(), unlocked)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Checkbox
        checked={unlocked}
        onCheckedChange={(checked) => setUnlocked(checked === true)}
        id={`location-new-${index}-unlocked`}
        name={`locations[new-${index}].unlocked`}
      />
      <Input
        placeholder="Add a location..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`location-new-${index}-name`}
        name={`locations[new-${index}].name`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save location">
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
  )
}
