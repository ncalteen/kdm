'use client'

import { GearItem, NewGearItem } from '@/components/settlement/gear/gear-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
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
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Gear Card Component
 */
export function GearCard(form: UseFormReturn<Settlement>): ReactElement {
  const gear = useMemo(() => form.watch('gear') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      gear.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [gear])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addGear = () => setIsAddingNew(true)

  /**
   * Handles removing gear from the list
   *
   * @param index Gear Index
   */
  const handleRemoveGear = (index: number) => {
    const currentGear = [...gear]
    currentGear.splice(index, 1)

    form.setValue('gear', currentGear)

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

      campaign.settlements[settlementIndex].gear = currentGear
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('The gear has been archived.')
    } catch (error) {
      console.error('Gear Remove Error:', error)
      toast.error('Failed to archive gear. Please try again.')
    }
  }

  /**
   * Handles saving a new gear item.
   *
   * @param value Gear Item
   */
  const saveGear = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('Cannot store nameless equipment.')

    const newGear = [...gear, value]

    form.setValue('gear', newGear)
    setDisabledInputs((prev) => ({ ...prev, [newGear.length - 1]: true }))
    setIsAddingNew(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].gear = newGear
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success('Gear saved in the settlement storage.')
    } catch (error) {
      console.error('Gear Save Error:', error)
      toast.error('Failed to save gear. Please try again.')
    }
  }

  const editGear = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event.
   *
   * @param event Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(gear, oldIndex, newIndex)

      form.setValue('gear', newOrder)

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

        campaign.settlements[settlementIndex].gear = newOrder
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Gear Drag Error:', error)
      }
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Gear Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {gear.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No gear obtained yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={gear.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {gear.map((gearItem, index) => (
                  <GearItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveGear={handleRemoveGear}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`gear.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))

                      // Update localStorage
                      try {
                        const formValues = form.getValues()
                        const campaign = getCampaign()
                        const settlementIndex = campaign.settlements.findIndex(
                          (s) => s.id === formValues.id
                        )

                        campaign.settlements[settlementIndex].gear =
                          formValues.gear || []
                        localStorage.setItem(
                          'campaign',
                          JSON.stringify(campaign)
                        )

                        toast.success('Gear saved!')
                      } catch (error) {
                        console.error(
                          'Error saving gear to localStorage:',
                          error
                        )
                      }
                    }}
                    onEdit={editGear}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewGearItem
              onSave={saveGear}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addGear}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Gear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
