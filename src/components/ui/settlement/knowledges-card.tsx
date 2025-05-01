'use client'

import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import { GripVertical, PlusCircleIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Input } from '../input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select'

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
  id
}: KnowledgeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(knowledge.name)
  const [initialValue] = useState(knowledge.name)
  const [philosophyValue, setPhilosophyValue] = useState<string | undefined>(
    knowledge.philosophy
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleBlur = () => {
    if (value.trim() !== initialValue && value.trim() !== '') {
      handleUpdateKnowledge(initialValue, {
        name: value.trim(),
        philosophy: philosophyValue
      })
    }
  }

  const handlePhilosophyChange = (newPhilosophy: string) => {
    setPhilosophyValue(newPhilosophy === 'none' ? undefined : newPhilosophy)
    handleUpdateKnowledge(knowledge.name, {
      name: knowledge.name,
      philosophy: newPhilosophy === 'none' ? undefined : newPhilosophy
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
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

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleRemoveKnowledge(knowledge.name)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center pl-8 gap-2">
        <div className="text-sm text-muted-foreground">Philosophy:</div>
        <Select
          value={philosophyValue || undefined}
          onValueChange={handlePhilosophyChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select philosophy" />
          </SelectTrigger>
          <SelectContent>
            {philosophies.length > 0 ? (
              <>
                <SelectItem value="none">None</SelectItem>
                {philosophies.map((philosophy) => (
                  <SelectItem key={philosophy} value={philosophy}>
                    {philosophy}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem value="none">No philosophies available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function NewKnowledgeItem({
  form,
  onAdd,
  philosophies
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
  philosophies: string[]
}) {
  const [name, setName] = useState('')
  const [philosophy, setPhilosophy] = useState<string>('')

  const handleSubmit = () => {
    if (name.trim() === '') return

    const knowledges = [...(form.watch('knowledges') || [])]
    const newKnowledge = {
      name: name.trim(),
      philosophy: philosophy && philosophy !== 'none' ? philosophy : undefined
    }

    form.setValue('knowledges', [...knowledges, newKnowledge])

    // Reset form
    setName('')
    setPhilosophy('')
    onAdd()
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
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleSubmit}>
          <PlusCircleIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center pl-8 gap-2">
        <div className="text-sm text-muted-foreground">Philosophy:</div>
        <Select value={philosophy} onValueChange={setPhilosophy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select philosophy" />
          </SelectTrigger>
          <SelectContent>
            {philosophies.length > 0 ? (
              <>
                <SelectItem value="none">None</SelectItem>
                {philosophies.map((philosophy) => (
                  <SelectItem key={philosophy} value={philosophy}>
                    {philosophy}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem value="none">No philosophies available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function KnowledgesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewKnowledgeForm, setShowNewKnowledgeForm] = useState(false)
  const knowledges = form.watch('knowledges') || []
  const philosophies = form.watch('philosophies') || []

  // This will ensure that we generate unique IDs for the sortable context
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = knowledgeIds.indexOf(active.id as string)
      const newIndex = knowledgeIds.indexOf(over.id as string)

      const newOrder = arrayMove(knowledges, oldIndex, newIndex)
      form.setValue('knowledges', newOrder)
    }
  }

  const addNewKnowledge = () => {
    setShowNewKnowledgeForm(false)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Knowledges
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {knowledges.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
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
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewKnowledgeForm ? (
            <NewKnowledgeItem
              form={form}
              onAdd={addNewKnowledge}
              philosophies={philosophies}
            />
          ) : (
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowNewKnowledgeForm(true)}>
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                Add Knowledge
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
