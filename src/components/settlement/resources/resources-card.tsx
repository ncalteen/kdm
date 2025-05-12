'use client'

import {
  NewResourceItem,
  ResourceItem
} from '@/components/settlement/resources/resource-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCategory, ResourceType } from '@/lib/enums'
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
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Resources Card Component
 */
export function ResourcesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const resources = useMemo(() => form.watch('resources') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      resources.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [resources])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addResource = () => setIsAddingNew(true)

  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources]
    updatedResources.splice(index, 1)

    form.setValue('resources', updatedResources)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].resources = updatedResources
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('Resource removed!')
    } catch (error) {
      console.error('Error saving resources to localStorage:', error)
    }
  }

  const saveResource = (
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot save a resource without a name')

    const newResource = { name, category, types, amount }
    const updatedResources = [...resources, newResource]

    form.setValue('resources', updatedResources)

    setDisabledInputs((prev) => ({
      ...prev,
      [updatedResources.length - 1]: true
    }))
    setIsAddingNew(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].resources = updatedResources
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('Resource saved!')
    } catch (error) {
      console.error('Error saving resources to localStorage:', error)
    }
  }

  const editResource = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(resources, oldIndex, newIndex)

      form.setValue('resources', newOrder)

      setDisabledInputs((prev) => {
        const next: { [key: number]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          const num = parseInt(k)
          if (num === oldIndex) next[newIndex] = prev[num]
          else if (num >= newIndex && num < oldIndex) next[num + 1] = prev[num]
          else if (num <= newIndex && num > oldIndex) next[num - 1] = prev[num]
          else next[num] = prev[num]
        })

        return next
      })

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].resources = newOrder
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Error saving resources to localStorage:', error)
      }
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-1">
          Resource Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {resources.length === 0 && !isAddingNew ? (
          <div className="text-center text-muted-foreground py-4">
            No resources added yet.
          </div>
        ) : (
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <div className="w-[30px]"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-[30%] pl-1">Name</div>
                <div className="w-[30%] pl-1">Category</div>
                <div className="w-[30%] pl-1">Types</div>
                <div className="w-[10%] pl-1">Amount</div>
                <div className="flex-shrink-0 w-9"></div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={resources.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {resources.map((_, index) => (
                <ResourceItem
                  key={index}
                  id={index.toString()}
                  index={index}
                  form={form}
                  handleRemoveResource={handleRemoveResource}
                  isDisabled={!!disabledInputs[index]}
                  onSave={(i, name, category, types, amount) => {
                    form.setValue(`resources.${i}`, {
                      name,
                      category,
                      types,
                      amount
                    })
                    setDisabledInputs((prev) => ({ ...prev, [i]: true }))

                    // Update localStorage
                    try {
                      const formValues = form.getValues()
                      const campaign = getCampaign()
                      const settlementIndex = campaign.settlements.findIndex(
                        (s) => s.id === formValues.id
                      )

                      campaign.settlements[settlementIndex].resources =
                        formValues.resources || []
                      localStorage.setItem('campaign', JSON.stringify(campaign))

                      toast.success('Resource saved!')
                    } catch (error) {
                      console.error(
                        'Error saving resources to localStorage:',
                        error
                      )
                    }
                  }}
                  onEdit={editResource}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewResourceItem
              onSave={saveResource}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addResource}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
