'use client'

import {
  NewSeedPatternItem,
  SeedPatternItem
} from '@/components/settlement/patterns/seed-pattern-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Seed Patterns Card Component
 *
 * @param form Form
 */
export function SeedPatternsCard(form: UseFormReturn<Settlement>) {
  const seedPatterns = useMemo(() => form.watch('seedPatterns') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      seedPatterns.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [seedPatterns])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addSeedPattern = () => setIsAddingNew(true)

  /**
   * Handles the removal of a seed pattern.
   *
   * @param index Seed Pattern Index
   */
  const handleRemoveSeedPattern = (index: number) => {
    const currentSeedPatterns = [...seedPatterns]

    currentSeedPatterns.splice(index, 1)
    form.setValue('seedPatterns', currentSeedPatterns)

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

      campaign.settlements[settlementIndex].seedPatterns = currentSeedPatterns
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success('The seed pattern has been consumed by darkness.')
    } catch (error) {
      console.error('Seed Pattern Remove Error:', error)
      toast.error('The seed pattern resists being forgotten. Please try again.')
    }
  }

  /**
   * Saves a seed pattern.
   *
   * @param value Seed Pattern Value
   */
  const saveSeedPattern = (value: string) => {
    if (!value || value.trim() === '')
      return toast.warning('Nameless seed patterns cannot be preserved.')

    const newSeedPatterns = [...seedPatterns, value]

    form.setValue('seedPatterns', newSeedPatterns)

    setDisabledInputs((prev) => ({
      ...prev,
      [newSeedPatterns.length - 1]: true
    }))

    setIsAddingNew(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].seedPatterns = newSeedPatterns
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success("A new revelation awakens in the survivors' minds.")
    } catch (error) {
      console.error('Seed Pattern Save Error:', error)
      toast.error(
        'The wisdom slips through your fingers like smoke. Please try again.'
      )
    }
  }

  const editSeedPattern = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the drag end event.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(seedPatterns, oldIndex, newIndex)

      form.setValue('seedPatterns', newOrder)

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

        campaign.settlements[settlementIndex].seedPatterns = newOrder
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Seed Pattern Drag Error:', error)
      }
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Seed Patterns
        </CardTitle>
        <CardDescription className="text-left">
          Patterns gained when survivors reach 3 understanding.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {seedPatterns.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No seed patterns added yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={seedPatterns.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {seedPatterns.map((seedPattern, index) => (
                  <SeedPatternItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveSeedPattern={handleRemoveSeedPattern}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`seedPatterns.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))

                      // Update localStorage
                      try {
                        const formValues = form.getValues()
                        const campaign = getCampaign()
                        const settlementIndex = campaign.settlements.findIndex(
                          (s) => s.id === formValues.id
                        )

                        campaign.settlements[settlementIndex].seedPatterns =
                          formValues.seedPatterns || []
                        localStorage.setItem(
                          'campaign',
                          JSON.stringify(campaign)
                        )
                        toast.success(
                          'The enlightened vision is carved into memory.'
                        )
                      } catch (error) {
                        console.error('New Seed Pattern Save Error:', error)
                        toast.error(
                          'This awakened insight proves elusive. Please try again.'
                        )
                      }
                    }}
                    onEdit={editSeedPattern}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewSeedPatternItem
              onSave={saveSeedPattern}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addSeedPattern}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Seed Pattern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
