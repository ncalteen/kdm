'use client'

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
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, PlusCircleIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormLabel } from '../form'
import { Input } from '../input'

interface RewardItemProps {
  reward: { name: string; cc: number; unlocked: boolean }
  handleToggleUnlocked: (rewardName: string, unlocked: boolean) => void
  handleRemoveReward: (rewardName: string) => void
  handleUpdateRewardCC: (rewardName: string, cc: number) => void
  id: string
}

function RewardItem({
  reward,
  handleToggleUnlocked,
  handleRemoveReward,
  handleUpdateRewardCC,
  id
}: RewardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-background p-2 rounded-md border">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <Checkbox
        checked={reward.unlocked}
        onCheckedChange={(checked) => {
          if (checked !== 'indeterminate') {
            handleToggleUnlocked(reward.name, checked)
          }
        }}
      />

      <div className="flex items-center">
        <FormLabel className="mr-2 text-sm">CC:</FormLabel>
        <Input
          type="number"
          className="w-16 h-8 text-sm no-spinners"
          value={reward.cc}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (!isNaN(value) && value >= 0) {
              handleUpdateRewardCC(reward.name, value)
            }
          }}
          min={0}
        />
      </div>

      <div className="flex-1 font-medium text-left">{reward.name}</div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleRemoveReward(reward.name)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function NewRewardItem({
  form,
  onAdd
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
}) {
  const [name, setName] = useState('')
  const [cc, setCc] = useState(1)

  const handleSubmit = () => {
    if (name.trim() === '') return

    const rewards = [...(form.watch('ccRewards') || [])]
    const newReward = {
      name: name.trim(),
      cc: cc,
      unlocked: false
    }

    form.setValue('ccRewards', [...rewards, newReward])

    // Reset form
    setName('')
    setCc(1)
    onAdd()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      <Checkbox disabled />

      <div className="flex items-center">
        <FormLabel className="mr-2 text-sm">CC:</FormLabel>
        <Input
          type="number"
          className="w-16 h-8 text-sm no-spinners"
          value={cc}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (!isNaN(value) && value >= 0) {
              setCc(value)
            }
          }}
          min={0}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Input
        placeholder="Add a new reward..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
        onKeyDown={handleKeyDown}
      />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleSubmit}>
        <PlusCircleIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function CcRewardsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewRewardForm, setShowNewRewardForm] = useState(false)
  const rewards = form.watch('ccRewards') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleToggleUnlocked = (rewardName: string, unlocked: boolean) => {
    const updatedRewards = rewards.map((r) => {
      if (r.name === rewardName) {
        return { ...r, unlocked }
      }
      return r
    })
    form.setValue('ccRewards', updatedRewards)
  }

  const handleRemoveReward = (rewardName: string) => {
    const updatedRewards = rewards.filter((r) => r.name !== rewardName)
    form.setValue('ccRewards', updatedRewards)
  }

  const handleUpdateRewardCC = (rewardName: string, cc: number) => {
    const updatedRewards = rewards.map((r) => {
      if (r.name === rewardName) {
        return { ...r, cc }
      }
      return r
    })
    form.setValue('ccRewards', updatedRewards)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = rewards.findIndex((r) => r.name === active.id)
      const newIndex = rewards.findIndex((r) => r.name === over.id)

      const newOrder = arrayMove(rewards, oldIndex, newIndex)
      form.setValue('ccRewards', newOrder)
    }
  }

  const addNewReward = () => {
    setShowNewRewardForm(false)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Collective Cognition Rewards
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
                    handleUpdateRewardCC={handleUpdateRewardCC}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewRewardForm ? (
            <NewRewardItem form={form} onAdd={addNewReward} />
          ) : (
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowNewRewardForm(true)}>
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                Add Reward
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
