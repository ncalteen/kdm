'use client'

import {
  InnovationItem,
  NewInnovationItem
} from '@/components/settlement/innovations/innovation-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { LightbulbIcon, PlusCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Innovations Card Component
 */
export function InnovationsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const innovations = useMemo(() => form.watch('innovations') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setIsAddingNew(false)
  }, [innovations])

  useEffect(() => {
    const initialDisabled: { [key: number]: boolean } = {}

    innovations.forEach((innovation, idx) => {
      if (innovation && innovation.trim() !== '') initialDisabled[idx] = true
    })

    setDisabledInputs(initialDisabled)
  }, [innovations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addInnovation = () => setIsAddingNew(true)

  const saveNewInnovation = (value: string) => {
    const currentInnovations = [...innovations, value]

    form.setValue('innovations', currentInnovations)
    setIsAddingNew(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].innovations = currentInnovations
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('A new understanding emerges from the void.')
    } catch (error) {
      console.error('New Innovation Save Error:', error)
      toast.error(
        'The shadows devour your words - your stories are lost. Please try again.'
      )
    }
  }

  const cancelNewInnovation = () => setIsAddingNew(false)

  const handleRemoveInnovation = (index: number) => {
    const currentInnovations = [...innovations]

    currentInnovations.splice(index, 1)
    form.setValue('innovations', currentInnovations)

    // Remove from disabled inputs
    const updatedDisabledInputs = { ...disabledInputs }
    delete updatedDisabledInputs[index]

    // Reindex the disabled inputs for the remaining items
    const newDisabledInputs: { [key: number]: boolean } = {}
    Object.keys(updatedDisabledInputs).forEach((key) => {
      const numKey = parseInt(key)

      if (numKey > index)
        newDisabledInputs[numKey - 1] = updatedDisabledInputs[numKey]
      else newDisabledInputs[numKey] = updatedDisabledInputs[numKey]
    })

    setDisabledInputs(newDisabledInputs)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].innovations = currentInnovations
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('The epiphany has been consumed by darkness.')
    } catch (error) {
      console.error('Remove Innovation Error:', error)
      toast.error(
        'The shadows devour your words - your stories are lost. Please try again.'
      )
    }
  }

  const saveInnovation = (index: number) => {
    const currentInnovation = form.getValues(`innovations.${index}`)

    if (!currentInnovation || currentInnovation.trim() === '')
      return toast.warning('Cannot record an empty innovation.')

    // Mark this input as disabled (saved)
    setDisabledInputs({
      ...disabledInputs,
      [index]: true
    })

    // Update localStorage
    try {
      const formValues = form.getValues()
      const currentInnovations = formValues.innovations
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].innovations = currentInnovations
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('Innovation has been recorded.')
    } catch (error) {
      console.error('Innovation Save Error:', error)
    }
  }

  const editInnovation = (index: number) => {
    // Mark this input as enabled (editable)
    const updatedDisabledInputs = { ...disabledInputs }

    updatedDisabledInputs[index] = false

    setDisabledInputs(updatedDisabledInputs)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(innovations, oldIndex, newIndex)
      form.setValue('innovations', newOrder)

      // Reorder the disabled inputs state
      const newDisabledInputs: { [key: number]: boolean } = {}

      Object.keys(disabledInputs).forEach((key) => {
        const numKey = parseInt(key)

        if (numKey === oldIndex)
          newDisabledInputs[newIndex] = disabledInputs[numKey]
        else if (numKey >= newIndex && numKey < oldIndex)
          newDisabledInputs[numKey + 1] = disabledInputs[numKey]
        else if (numKey <= newIndex && numKey > oldIndex)
          newDisabledInputs[numKey - 1] = disabledInputs[numKey]
        else newDisabledInputs[numKey] = disabledInputs[numKey]
      })

      setDisabledInputs(newDisabledInputs)

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].innovations = newOrder
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Innovation Drag Error:', error)
      }
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <LightbulbIcon className="h-5 w-5" /> Innovations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={innovations.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {innovations.map((Innovation, index) => (
                <InnovationItem
                  key={index}
                  id={index.toString()}
                  index={index}
                  form={form}
                  handleRemoveInnovation={handleRemoveInnovation}
                  isDisabled={!!disabledInputs[index]}
                  onSave={saveInnovation}
                  onEdit={editInnovation}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewInnovationItem
              onSave={saveNewInnovation}
              onCancel={cancelNewInnovation}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addInnovation}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Innovation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
