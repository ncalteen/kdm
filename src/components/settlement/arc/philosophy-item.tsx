'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface PhilosophyItemProps {
  philosophy: string
  handleRemovePhilosophy: (philosophy: string) => void
  handleUpdatePhilosophy: (oldPhilosophy: string, newPhilosophy: string) => void
  id: string
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
}: PhilosophyItemProps & {
  isEditing: boolean
  onEdit: () => void
  onSaveEdit: (name: string) => void
  onCancelEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(philosophy)

  useEffect(() => {
    setValue(philosophy)
  }, [philosophy])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEditSave = () => {
    if (value.trim() === '')
      return toast.warning('Cannot save a philosophy without a name')

    onSaveEdit(value.trim())
    toast.success('Philosophy saved')
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEditSave()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-background p-2 rounded-md border">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {isEditing ? (
        <Input
          value={value}
          name={`philosophy-name-${id}`}
          id={`philosophy-name-${id}`}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          className="flex-1"
          autoFocus
        />
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
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
  existingNames: string[]
}) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim() === '')
      return toast.warning('Cannot save a philosophy without a name')

    if (existingNames.includes(name.trim()))
      return toast.warning('A philosophy with this name already exists')

    const philosophies = [...(form.watch('philosophies') || [])]
    const updatedPhilosophies = [...philosophies, name.trim()]

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
      console.error('Error saving new philosophy:', error)
    }

    setName('')
    onAdd()

    toast.success('New philosophy added')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <Input
        placeholder="Add a philosophy..."
        value={name}
        name="new-philosophy-name"
        id="new-philosophy-name"
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
        onKeyDown={handleKeyDown}
        autoFocus
      />
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
        title="Cancel add philosophy">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
