'use client'

import {
  NewRewardItem,
  RewardItem
} from '@/components/settlement/arc/collective-cognition-reward-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Collective Cognition Rewards Card Properties
 */
interface CollectiveCognitionRewardsCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Collective Cognition Rewards Card Component
 *
 * Displays and manages the collective cognition rewards for the settlement.
 * Allows adding, editing, removing, and reordering rewards with drag-and-drop functionality.
 *
 * @param form Settlement form instance
 * @returns Collective Cognition Rewards Card Component
 */
export function CollectiveCognitionRewardsCard({
  saveSelectedSettlement,
  selectedSettlement
}: CollectiveCognitionRewardsCardProps): ReactElement {
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})

  useEffect(() => {
    console.debug('[CollectiveCognitionRewardsCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      ;(selectedSettlement?.ccRewards || []).forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.ccRewards])

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
    const currentRewards = [...(selectedSettlement?.ccRewards || [])]
    currentRewards[index] = { ...currentRewards[index], unlocked }

    saveSelectedSettlement(
      {
        ccRewards: currentRewards
      },
      'Reward transformed by the darkness.'
    )
  }

  /**
   * Handles the removal of a reward.
   *
   * @param index Reward Index
   */
  const onRemove = (index: number) => {
    const currentRewards = [...(selectedSettlement?.ccRewards || [])]
    currentRewards.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSettlement(
      {
        ccRewards: currentRewards
      },
      'The dark gift recedes into shadow.'
    )
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

    const updatedRewards = [...(selectedSettlement?.ccRewards || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedRewards[i] = { ...updatedRewards[i], name: name.trim(), cc }
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      const newReward = { name: name.trim(), cc, unlocked: false }
      updatedRewards.push(newReward)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedRewards.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      {
        ccRewards: updatedRewards
      },
      "The settlement's culinary knowledge expands."
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

      const newOrder = arrayMove(
        selectedSettlement?.ccRewards || [],
        oldIndex,
        newIndex
      )

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

      saveSelectedSettlement({
        ccRewards: newOrder
      })
    }
  }

  const addReward = () => setIsAddingNew(true)

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
      </CardHeader>

      {/* Rewards List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="h-full">
          <div className="space-y-1">
            {(selectedSettlement?.ccRewards || []).length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.ccRewards || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.ccRewards || []).map(
                    (reward, index) => (
                      <RewardItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        reward={reward}
                        isDisabled={!!disabledInputs[index]}
                        onToggleUnlocked={handleToggleUnlocked}
                        onRemove={onRemove}
                        onSave={(name, cc, i) => onSave(name, cc, i)}
                        onEdit={onEdit}
                      />
                    )
                  )}
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
        </div>
      </CardContent>
    </Card>
  )
}
