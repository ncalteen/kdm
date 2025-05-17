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
import { BrainIcon, PlusCircleIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Collective Cognition Rewards Card
 */
export function CollectiveCognitionRewardsCard(
  form: UseFormReturn<Settlement>
): ReactElement {
  const rewards = form.watch('ccRewards') || []

  const [showNewRewardForm, setShowNewRewardForm] = useState<boolean>(false)
  const [editingReward, setEditingReward] = useState<string | undefined>(
    undefined
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the toggling of a reward's unlocked state.
   *
   * @param rewardName Reward Name
   * @param unlocked Unlocked State
   */
  const handleToggleUnlocked = (rewardName: string, unlocked: boolean) => {
    const updatedRewards = rewards.map((r) =>
      r.name === rewardName ? { ...r, unlocked } : r
    )

    form.setValue('ccRewards', updatedRewards)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].ccRewards = updatedRewards
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Reward transformed by the darkness.')
      }
    } catch (error) {
      console.error('CC Reward Lock/Unlock Error:', error)
      toast.error('Failed to save the reward. Please try again.')
    }
  }

  /**
   * Handles the removal of a reward.
   *
   * @param rewardName Reward Name
   */
  const handleRemoveReward = (rewardName: string) => {
    const updatedRewards = rewards.filter((r) => r.name !== rewardName)

    form.setValue('ccRewards', updatedRewards)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].ccRewards = updatedRewards
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('The dark gift recedes into shadow.')
      }
    } catch (error) {
      console.error('CC Reward Remove Error:', error)
      toast.error('Failed to remove the reward. Please try again.')
    }
  }

  /**
   * Handles the drag end event.
   *
   * @param event Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = rewards.findIndex((r) => r.name === active.id)
      const newIndex = rewards.findIndex((r) => r.name === over.id)

      const newOrder = arrayMove(rewards, oldIndex, newIndex)
      form.setValue('ccRewards', newOrder)

      // Save to localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (settlementIndex !== -1) {
          campaign.settlements[settlementIndex].ccRewards = newOrder
          localStorage.setItem('campaign', JSON.stringify(campaign))
        }
      } catch (error) {
        console.error('CC Reward Drag Error:', error)
      }
    }
  }

  const addNewReward = () => setShowNewRewardForm(false)

  const cancelNewReward = () => setShowNewRewardForm(false)

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <BrainIcon className="h-4 w-4" /> Collective Cognition Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {rewards.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={rewards.map((r) => r.name)}
                strategy={verticalListSortingStrategy}>
                {rewards.map((reward) => (
                  <RewardItem
                    key={reward.name}
                    id={reward.name}
                    reward={reward}
                    handleToggleUnlocked={handleToggleUnlocked}
                    handleRemoveReward={handleRemoveReward}
                    isEditing={editingReward === reward.name}
                    onEdit={() => setEditingReward(reward.name)}
                    onSaveEdit={(name, cc) => {
                      const updatedRewards = rewards.map((r) =>
                        r.name === reward.name ? { ...r, name, cc } : r
                      )
                      form.setValue('ccRewards', updatedRewards)
                      setEditingReward(undefined)

                      // Save to localStorage
                      try {
                        const formValues = form.getValues()
                        const campaign = getCampaign()
                        const settlementIndex = campaign.settlements.findIndex(
                          (s: { id: number }) => s.id === formValues.id
                        )

                        if (settlementIndex !== -1) {
                          campaign.settlements[settlementIndex].ccRewards =
                            updatedRewards
                          localStorage.setItem(
                            'campaign',
                            JSON.stringify(campaign)
                          )
                          toast.success('Reward updated!')
                        }
                      } catch (error) {
                        console.error('Error updating reward:', error)
                      }
                    }}
                    onCancelEdit={() => setEditingReward(undefined)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewRewardForm && (
            <NewRewardItem
              form={form}
              onAdd={addNewReward}
              onCancel={cancelNewReward}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewRewardForm(true)}
              disabled={showNewRewardForm || editingReward !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Reward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
