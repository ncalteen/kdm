'use client'

import {
  NewPhilosophyItem,
  PhilosophyItem
} from '@/components/settlement/arc/philosophy-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
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
import { PlusCircleIcon, SparkleIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Philosophies Card Component
 */
export function PhilosophiesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewPhilosophyForm, setShowNewPhilosophyForm] = useState(false)
  const [editingPhilosophy, setEditingPhilosophy] = useState<string | null>(
    null
  )

  const philosophies = form.watch('philosophies') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of a philosophy.
   *
   * @param philosophy Philosophy
   */
  const handleRemovePhilosophy = (philosophy: string) => {
    const updatedPhilosophies = philosophies.filter((p) => p !== philosophy)

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
        toast.success('Thoughts fade into the void.')
      }
    } catch (error) {
      console.error('Philosophy Remove Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the update of a philosophy.
   *
   * @param oldPhilosophy Old Philosophy
   * @param newPhilosophy New Philosophy
   */
  const handleUpdatePhilosophy = (
    oldPhilosophy: string,
    newPhilosophy: string
  ) => {
    if (newPhilosophy.trim() === '')
      return toast.warning('Cannot save nameless philosophies.')

    if (
      philosophies.some(
        (p) => p === newPhilosophy.trim() && p !== oldPhilosophy
      )
    )
      return toast.warning(
        'This philosophy already echoes throughout your settlement.'
      )

    const updatedPhilosophies = philosophies.map((p) => {
      return p === oldPhilosophy ? newPhilosophy.trim() : p
    })

    form.setValue('philosophies', updatedPhilosophies)
    setEditingPhilosophy(null)

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
        toast.success('Philosophy etched into memory.')
      }
    } catch (error) {
      console.error('Philosophy Update Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  const addNewPhilosophy = () => setShowNewPhilosophyForm(false)

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <SparkleIcon className="h-4 w-4" /> Philosophies
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {philosophies.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = philosophies.indexOf(active.id as string)
                  const newIndex = philosophies.indexOf(over.id as string)
                  const newOrder = arrayMove(philosophies, oldIndex, newIndex)

                  form.setValue('philosophies', newOrder)

                  // Save to localStorage
                  try {
                    const formValues = form.getValues()
                    const campaign = getCampaign()
                    const settlementIndex = campaign.settlements.findIndex(
                      (s: { id: number }) => s.id === formValues.id
                    )

                    if (settlementIndex !== -1) {
                      campaign.settlements[settlementIndex].philosophies =
                        newOrder
                      localStorage.setItem('campaign', JSON.stringify(campaign))
                    }
                  } catch (error) {
                    console.error('Philosophy Drag Error:', error)
                  }
                }
              }}>
              <SortableContext
                items={philosophies}
                strategy={verticalListSortingStrategy}>
                {philosophies.map((philosophy) => (
                  <PhilosophyItem
                    key={philosophy}
                    id={philosophy}
                    philosophy={philosophy}
                    handleRemovePhilosophy={handleRemovePhilosophy}
                    handleUpdatePhilosophy={handleUpdatePhilosophy}
                    isEditing={editingPhilosophy === philosophy}
                    onEdit={() => setEditingPhilosophy(philosophy)}
                    onSaveEdit={(name) =>
                      handleUpdatePhilosophy(philosophy, name)
                    }
                    onCancelEdit={() => setEditingPhilosophy(null)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewPhilosophyForm && (
            <NewPhilosophyItem
              form={form}
              onAdd={addNewPhilosophy}
              existingNames={philosophies}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewPhilosophyForm(true)}
              disabled={showNewPhilosophyForm || editingPhilosophy !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Philosophy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
