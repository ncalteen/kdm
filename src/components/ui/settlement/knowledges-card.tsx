'use client'

import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  CheckIcon,
  GripVertical,
  LandmarkIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '../badge'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Input } from '../input'
import { SelectPhilosophyCombobox } from '../menu/select-philosophy-combobox'

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

function KnowledgeItem({
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
    if (value.trim() === '') {
      toast.warning('Cannot save a knowledge without a name')
      return
    }
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
          <SelectPhilosophyCombobox
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

function NewKnowledgeItem({
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
    if (name.trim() === '') {
      toast.warning('Cannot save a knowledge without a name')
      return
    }
    if (existingNames.includes(name.trim())) {
      toast.warning('A knowledge with this name already exists')
      return
    }
    const knowledges = [...(form.watch('knowledges') || [])]
    const newKnowledge = {
      name: name.trim(),
      philosophy: philosophy && philosophy !== 'none' ? philosophy : undefined
    }
    form.setValue('knowledges', [...knowledges, newKnowledge])
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
        <SelectPhilosophyCombobox
          value={philosophy}
          onChange={setPhilosophy}
          options={philosophies}
        />
      </div>
    </div>
  )
}

export function KnowledgesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewKnowledgeForm, setShowNewKnowledgeForm] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<string | null>(null)
  const knowledges = form.watch('knowledges') || []
  const philosophies = form.watch('philosophies') || []
  const knowledgeIds = knowledges.map((k) => k.name)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleRemoveKnowledge = (knowledgeName: string) => {
    const updatedKnowledges = knowledges.filter((k) => k.name !== knowledgeName)
    form.setValue('knowledges', updatedKnowledges)
  }

  const handleUpdateKnowledge = (
    oldKnowledgeName: string,
    newValues: { name: string; philosophy?: string }
  ) => {
    const updatedKnowledges = knowledges.map((k) => {
      if (k.name === oldKnowledgeName) {
        return newValues
      }
      return k
    })
    form.setValue('knowledges', updatedKnowledges)
  }

  const handleSaveEdit = (
    oldName: string,
    newName: string,
    philosophy?: string
  ) => {
    if (newName.trim() === '') {
      toast.warning('Cannot save a knowledge without a name')
      return
    }
    if (
      knowledges.some((k) => k.name === newName.trim() && k.name !== oldName)
    ) {
      toast.warning('A knowledge with this name already exists')
      return
    }
    handleUpdateKnowledge(oldName, { name: newName.trim(), philosophy })
    setEditingKnowledge(null)
    toast.success('Knowledge saved')
  }

  const addNewKnowledge = () => {
    setShowNewKnowledgeForm(false)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <LandmarkIcon className="h-4 w-4" /> Knowledges
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {knowledges.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = knowledgeIds.indexOf(active.id as string)
                  const newIndex = knowledgeIds.indexOf(over.id as string)
                  const newOrder = arrayMove(knowledges, oldIndex, newIndex)
                  form.setValue('knowledges', newOrder)
                }
              }}>
              <SortableContext
                items={knowledgeIds}
                strategy={verticalListSortingStrategy}>
                {knowledges.map((knowledge) => (
                  <KnowledgeItem
                    key={knowledge.name}
                    id={knowledge.name}
                    knowledge={knowledge}
                    philosophies={philosophies}
                    handleRemoveKnowledge={handleRemoveKnowledge}
                    handleUpdateKnowledge={handleUpdateKnowledge}
                    isEditing={editingKnowledge === knowledge.name}
                    onEdit={() => setEditingKnowledge(knowledge.name)}
                    onSaveEdit={(name, philosophy) =>
                      handleSaveEdit(knowledge.name, name, philosophy)
                    }
                    onCancelEdit={() => setEditingKnowledge(null)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewKnowledgeForm && (
            <NewKnowledgeItem
              form={form}
              onAdd={addNewKnowledge}
              philosophies={philosophies}
              existingNames={knowledges.map((k) => k.name)}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewKnowledgeForm(true)}
              disabled={showNewKnowledgeForm || editingKnowledge !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Knowledge
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
