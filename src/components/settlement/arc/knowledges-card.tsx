'use client'

import {
  KnowledgeItem,
  NewKnowledgeItem
} from '@/components/settlement/arc/knowledge-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { LandmarkIcon, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Knowledges Card Component
 */
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
    const updatedKnowledges = knowledges.map((k) =>
      k.name === oldKnowledgeName ? newValues : k
    )

    form.setValue('knowledges', updatedKnowledges)
  }

  const handleSaveEdit = (
    oldName: string,
    newName: string,
    philosophy?: string
  ) => {
    if (newName.trim() === '')
      return toast.warning('Cannot save a knowledge without a name')

    if (knowledges.some((k) => k.name === newName.trim() && k.name !== oldName))
      return toast.warning('A knowledge with this name already exists')

    handleUpdateKnowledge(oldName, { name: newName.trim(), philosophy })
    setEditingKnowledge(null)

    toast.success('Knowledge saved')
  }

  const addNewKnowledge = () => setShowNewKnowledgeForm(false)

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
