'use client'

import {
  KnowledgeItem,
  NewKnowledgeItem
} from '@/components/settlement/arc/knowledge-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Knowledge, SettlementSchema } from '@/schemas/settlement'
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
import { ReactElement, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Knowledges Card Component
 */
export function KnowledgesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
): ReactElement {
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

  /**
   * Handles the removal of a knowledge.
   *
   * @param knowledgeName Knowledge Name
   */
  const handleRemoveKnowledge = (knowledgeName: string) => {
    const updatedKnowledges = knowledges.filter((k) => k.name !== knowledgeName)
    form.setValue('knowledges', updatedKnowledges)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].knowledges =
          updatedKnowledges as Knowledge[]
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Forbidden insight banished to the void.')
      }
    } catch (error) {
      console.error('Knowledge Remove Error:', error)
    }
  }

  /**
   * Handles the update of a knowledge.
   *
   * @param oldKnowledgeName Old Knowledge Name
   * @param newValues New Values
   */
  const handleUpdateKnowledge = (
    oldKnowledgeName: string,
    newValues: { name: string; philosophy?: string }
  ) => {
    const updatedKnowledges = knowledges.map((k) =>
      k.name === oldKnowledgeName ? newValues : k
    ) as Knowledge[]

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
        toast.success('Knowledge carved into memory.')
      }
    } catch (error) {
      console.error('Knowledge Update Error:', error)
    }
  }

  /**
   * Handles the save of an edited knowledge.
   *
   * @param oldName Old Name
   * @param newName New Name
   * @param philosophy Philosophy
   */
  const handleSaveEdit = (
    oldName: string,
    newName: string,
    philosophy?: string
  ) => {
    if (newName.trim() === '')
      return toast.warning('Knowledge cannot be nameless.')

    if (knowledges.some((k) => k.name === newName.trim() && k.name !== oldName))
      return toast.warning('This knowledge already haunts your settlement.')

    handleUpdateKnowledge(oldName, { name: newName.trim(), philosophy })
    setEditingKnowledge(null)
    toast.success('Knowledge reshaped successfully.')
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

                  // Save to localStorage
                  try {
                    const formValues = form.getValues()
                    const campaign = getCampaign()
                    const settlementIndex = campaign.settlements.findIndex(
                      (s: { id: number }) => s.id === formValues.id
                    )

                    if (settlementIndex !== -1) {
                      campaign.settlements[settlementIndex].knowledges =
                        newOrder
                      localStorage.setItem('campaign', JSON.stringify(campaign))
                    }
                  } catch (error) {
                    console.error('Error reordering knowledges:', error)
                  }
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
