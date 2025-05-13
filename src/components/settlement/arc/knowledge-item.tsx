'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Badge } from '@/components/ui/badge'
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

interface KnowledgeItemProps {
  knowledge: { name: string; philosophy?: string }
  handleRemoveKnowledge: (knowledgeName: string) => void
  handleUpdateKnowledge: (
    oldKnowledgeName: string,
    newValues: { name: string; philosophy?: string }
  ) => void
  philosophies: string[]
  id: string
}

/**
 * Knowledge Item Component
 */
export function KnowledgeItem({
  knowledge,
  handleRemoveKnowledge,
  handleUpdateKnowledge,
  philosophies,
  id,
  isEditing,
  onEdit,
  onSaveEdit,
  onCancelEdit
}: KnowledgeItemProps & {
  isEditing: boolean
  onEdit: () => void
  onSaveEdit: (name: string, philosophy?: string) => void
  onCancelEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(knowledge.name)
  const [philosophyValue, setPhilosophyValue] = useState<string | undefined>(
    knowledge.philosophy
  )

  useEffect(() => {
    setValue(knowledge.name)
    setPhilosophyValue(knowledge.philosophy)
  }, [knowledge.name, knowledge.philosophy])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEditSave = () => {
    if (value.trim() === '')
      return toast.warning('Cannot save a knowledge without a name')

    onSaveEdit(value.trim(), philosophyValue)
    toast.success('Knowledge saved')
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
      className="flex flex-col gap-2 bg-background p-3 rounded-md border">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="flex-1"
            autoFocus
          />
        ) : (
          <div className="flex-1 text-sm text-left">{knowledge.name}</div>
        )}
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={handleEditSave}
              title="Save knowledge">
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
              title="Edit knowledge">
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => handleRemoveKnowledge(knowledge.name)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center pl-8 gap-2">
        {isEditing ? (
          <SelectPhilosophy
            value={philosophyValue || ''}
            onChange={(newPhilosophy) => {
              setPhilosophyValue(
                newPhilosophy === 'none' ? undefined : newPhilosophy
              )
              if (isEditing) return
              handleUpdateKnowledge(knowledge.name, {
                name: knowledge.name,
                philosophy: newPhilosophy === 'none' ? undefined : newPhilosophy
              })
            }}
            options={philosophies}
            disabled={!isEditing}
          />
        ) : (
          <Badge variant="secondary">
            {philosophyValue ? philosophyValue : 'None'}
          </Badge>
        )}
      </div>
    </div>
  )
}

/**
 * New Knowledge Item Component
 */
export function NewKnowledgeItem({
  form,
  onAdd,
  philosophies,
  existingNames
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
  philosophies: string[]
  existingNames: string[]
}) {
  const [name, setName] = useState('')
  const [philosophy, setPhilosophy] = useState<string>('')

  const handleSubmit = () => {
    if (name.trim() === '')
      return toast.warning('Cannot save a knowledge without a name')

    if (existingNames.includes(name.trim()))
      return toast.warning('A knowledge with this name already exists')

    const knowledges = [...(form.watch('knowledges') || [])]
    const newKnowledge = {
      name: name.trim(),
      philosophy: philosophy && philosophy !== 'none' ? philosophy : undefined
    }
    const updatedKnowledges = [...knowledges, newKnowledge]

    form.setValue('knowledges', updatedKnowledges)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].knowledges = updatedKnowledges
        localStorage.setItem('campaign', JSON.stringify(campaign))
      }
    } catch (error) {
      console.error('Error saving new knowledge:', error)
    }

    setName('')
    setPhilosophy('')
    onAdd()

    toast.success('New knowledge added')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-muted/40 p-3 rounded-md">
      <div className="flex items-center gap-2">
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <Input
          placeholder="Add a new knowledge..."
          value={name}
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
          title="Save knowledge">
          <CheckIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={onAdd}
          title="Cancel add knowledge">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center pl-8 gap-2">
        <SelectPhilosophy
          value={philosophy}
          onChange={setPhilosophy}
          options={philosophies}
        />
      </div>
    </div>
  )
}
