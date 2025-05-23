'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Button } from '@/components/ui/button'
import { Philosophy } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Philosophy Item Component Properties
 */
export interface PhilosophyItemProps {
  /** Remove Philosophy Handler */
  handleRemovePhilosophy: (philosophy: Philosophy) => void
  /** Update Philosophy Handler */
  handleUpdatePhilosophy: (
    oldPhilosophy: Philosophy,
    newPhilosophy: Philosophy
  ) => void
  /** Philosophy ID */
  id: string
  /** Editing Status */
  isEditing: boolean
  /** OnCancelEdit Callback */
  onCancelEdit: () => void
  /** OnEdit Callback */
  onEdit: () => void
  /** OnSaveEdit Callback */
  onSaveEdit: (name: string) => void
  /** Philosophy Name */
  philosophy: Philosophy
}

/**
 * New Philosophy Item Component Properties
 */
export interface NewPhilosophyItemProps {
  /** Existing Names */
  existingNames: Philosophy[]
  /** Form */
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  /** OnAdd Callback */
  onAdd: () => void
}

/**
 * Philosophy Item Component
 */
export function PhilosophyItem({
  philosophy,
  handleRemovePhilosophy,
  id,
  isEditing,
  onEdit,
  onSaveEdit,
  onCancelEdit
}: PhilosophyItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [value, setValue] = useState(philosophy)

  useEffect(() => setValue(philosophy), [philosophy])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEditSave = () => {
    if (!value || value.trim() === '')
      return toast.error('A nameless philosophy cannot be recorded.')

    onSaveEdit(value)
    toast.success('The philosophy echos throughout your settlement.')
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-background p-2 rounded-md border">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {isEditing ? (
        <div className="flex-1">
          <SelectPhilosophy
            options={Object.values(Philosophy)}
            value={value}
            onChange={(val) => setValue(val as Philosophy)}
          />
        </div>
      ) : (
        <div className="flex-1 text-sm text-left">{philosophy}</div>
      )}
      {isEditing ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleEditSave}
            title="Save philosophy">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={onCancelEdit}
            title="Cancel edit">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={onEdit}
            title="Edit philosophy">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handleRemovePhilosophy(philosophy)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

/**
 * New Philosophy Item Component
 */
export function NewPhilosophyItem({
  form,
  onAdd,
  existingNames
}: NewPhilosophyItemProps) {
  const [name, setName] = useState<Philosophy | undefined>()

  const handleSubmit = () => {
    if (!name) return toast.warning('Cannot save a nameless philosophy.')

    if (existingNames.includes(name))
      return toast.warning(
        'This philosophy already echoes throughout your settlement.'
      )

    const philosophies = [...(form.watch('philosophies') || [])]
    const updatedPhilosophies = [...philosophies, name]

    form.setValue('philosophies', updatedPhilosophies)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].philosophies = updatedPhilosophies
        localStorage.setItem('campaign', JSON.stringify(campaign))
      }
    } catch (error) {
      console.error('New Philosophy Save Error:', error)
    }

    setName(undefined)
    onAdd()

    toast.success('A new philosophy echos throughout your settlement.')
  }

  return (
    <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-md">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <div className="flex-1">
        <SelectPhilosophy
          options={Object.values(Philosophy).filter(
            (philosophy) => !existingNames.includes(philosophy)
          )}
          value={name}
          onChange={(val) => setName(val as Philosophy)}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={handleSubmit}
        title="Save philosophy">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={onAdd}
        title="Cancel adding philosophy">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
