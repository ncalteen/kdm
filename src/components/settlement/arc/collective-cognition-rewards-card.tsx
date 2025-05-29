'use client'

import {
  NewRewardItem,
  RewardItem
} from '@/components/settlement/arc/collective-cognition-reward-item'
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
import { BrainIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Collective Cognition Rewards Card Component
 *
 * Displays and manages the collective cognition rewards for the settlement.
 * Allows adding, editing, removing, and reordering rewards with drag-and-drop functionality.
 *
 * @param form Settlement form instance
 * @returns Collective Cognition Rewards Card Component
 */
export function CollectiveCognitionRewardsCard(
  form: UseFormReturn<Settlement>
): ReactElement {
  const ccRewards = useMemo(() => form.watch('ccRewards') || [], [form])

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      ccRewards.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [ccRewards])

  /**
   * Save collective cognition rewards to localStorage for the current settlement.
   *
   * @param updatedRewards Updated Rewards
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedRewards: typeof ccRewards,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].ccRewards = updatedRewards
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('CC Reward Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the toggling of a reward's unlocked state.
   *
   * @param index Reward Index
   * @param unlocked Unlocked State
   */
  const handleToggleUnlocked = (index: number, unlocked: boolean) => {
    const currentRewards = [...ccRewards]
    currentRewards[index] = { ...currentRewards[index], unlocked }
    form.setValue('ccRewards', currentRewards)

    saveToLocalStorage(currentRewards, 'Reward transformed by the darkness.')
  }

  /**
   * Handles the removal of a reward.
   *
   * @param index Reward Index
   */
  const onRemove = (index: number) => {
    const currentRewards = [...ccRewards]
    currentRewards.splice(index, 1)
    form.setValue('ccRewards', currentRewards)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentRewards, 'The dark gift recedes into shadow.')
  }

  /**
   * Handles saving a new reward or updating an existing one.
   *
   * @param name Reward Name
   * @param cc Collective Cognition Value
   * @param i Reward Index (When Updating Only)
   */
  const onSave = (name?: string, cc?: number, i?: number) => {
    if (!name || name.trim() === '')
      return toast.error('A nameless reward cannot be recorded.')

    if (cc === undefined || cc < 0)
      return toast.error('A reward must have a collective cognition target.')

    const updatedRewards = [...ccRewards]

    if (i !== undefined) {
      // Updating an existing value
      updatedRewards[i] = { ...updatedRewards[i], name: name.trim(), cc }
      form.setValue(`ccRewards.${i}`, updatedRewards[i])

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      const newReward = { name: name.trim(), cc, unlocked: false }
      updatedRewards.push(newReward)

      form.setValue('ccRewards', updatedRewards)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedRewards.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedRewards,
      i !== undefined
        ? 'The settlement eagerly awaits this reward.'
        : 'A new gift manifests from the darkness.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a reward.
   *
   * @param index Reward Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the drag end event.
   *
   * @param event Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(ccRewards, oldIndex, newIndex)
      form.setValue('ccRewards', newOrder)

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

      saveToLocalStorage(newOrder)
    }
  }

  const addReward = () => setIsAddingNew(true)

  return (
    <Card className="mt-1 border-0">
      <CardHeader className="px-3 py-2 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            <BrainIcon className="h-4 w-4" /> Collective Cognition Rewards{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addReward}
                  className="border-0 h-8 w-8"
                  disabled={
                    isAddingNew ||
                    Object.values(disabledInputs).some((v) => v === false)
                  }>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {ccRewards.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={ccRewards.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {ccRewards.map((reward, index) => (
                  <RewardItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    isDisabled={!!disabledInputs[index]}
                    onToggleUnlocked={handleToggleUnlocked}
                    onRemove={onRemove}
                    onSave={(name, cc, i) => onSave(name, cc, i)}
                    onEdit={onEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewRewardItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
