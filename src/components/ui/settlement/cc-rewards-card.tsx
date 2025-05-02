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
import {
  BrainIcon,
  CheckIcon,
  GripVertical,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
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
  id: string
  isEditing: boolean
  onEdit: () => void
  onSaveEdit: (name: string, cc: number) => void
  onCancelEdit: () => void
}

function RewardItem({
  reward,
  handleToggleUnlocked,
  handleRemoveReward,
  id,
  isEditing,
  onEdit,
  onSaveEdit,
  onCancelEdit
}: RewardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const [editName, setEditName] = useState(reward.name)
  const [editCC, setEditCC] = useState(reward.cc)

  useEffect(() => {
    setEditName(reward.name)
    setEditCC(reward.cc)
  }, [reward.name, reward.cc])

  const handleEditSave = () => {
    if (editName.trim() === '') {
      toast.warning('Cannot save a reward without a name')
      return
    }
    onSaveEdit(editName.trim(), editCC)
    toast.success('Reward saved')
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEditSave()
    }
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
        disabled={isEditing}
      />

      <div className="flex items-center">
        <FormLabel className="mr-2 text-sm">CC:</FormLabel>
        {isEditing ? (
          <Input
            type="number"
            className="w-12 h-8 text-sm no-spinners"
            value={editCC}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (!isNaN(value) && value >= 0) {
                setEditCC(value)
              }
            }}
            min={0}
            onKeyDown={handleEditKeyDown}
            autoFocus
          />
        ) : (
          <Input
            type="number"
            className="w-12 h-8 text-sm no-spinners"
            value={reward.cc}
            onChange={() => {}}
            min={0}
            disabled
          />
        )}
      </div>

      <div className="flex-1 text-sm text-left">
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="flex-1"
            autoFocus
          />
        ) : (
          reward.name
        )}
      </div>

      {isEditing ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleEditSave}
            title="Save reward">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={onCancelEdit}
            title="Cancel edit">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={onEdit}
            title="Edit reward">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handleRemoveReward(reward.name)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

function NewRewardItem({
  form,
  onAdd,
  onCancel
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [cc, setCc] = useState(1)

  const handleSubmit = () => {
    if (name.trim() === '') {
      toast.warning('Cannot save a reward without a name')
      return
    }

    const rewards = [...(form.watch('ccRewards') || [])]
    if (rewards.some((r) => r.name === name.trim())) {
      toast.warning('A reward with this name already exists')
      return
    }

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
    toast.success('New reward added')
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
          className="w-12 h-8 text-sm no-spinners"
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
        autoFocus
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={handleSubmit}
        title="Save reward">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={onCancel}
        title="Cancel add reward">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function CcRewardsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewRewardForm, setShowNewRewardForm] = useState(false)
  const [editingReward, setEditingReward] = useState<string | null>(null)
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

  const cancelNewReward = () => {
    setShowNewRewardForm(false)
  }

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
                      setEditingReward(null)
                    }}
                    onCancelEdit={() => setEditingReward(null)}
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
