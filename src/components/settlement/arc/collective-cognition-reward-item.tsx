'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { CollectiveCognitionReward, Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Collective Cognition Reward Item Properties
 */
export interface RewardItemProps {
  /** Collective Cognition Reward ID */
  id: string
  /** Is Editing */
  isEditing: boolean
  /** Collective Cognition Reward */
  reward: CollectiveCognitionReward
  /** Handle Remove Reward */
  handleRemoveReward: (rewardName: string) => void
  /** Handle Toggle Unlocked */
  handleToggleUnlocked: (rewardName: string, unlocked: boolean) => void
  /** On Cancel Edit */
  onCancelEdit: () => void
  /** On Edit */
  onEdit: () => void
  /** On Save Edit */
  onSaveEdit: (name: string, cc: number) => void
}

/**
 * New Collective Cognition Reward Item Properties
 */
export interface NewRewardItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** On Add */
  onAdd: () => void
  /** On Cancel */
  onCancel: () => void
}

/**
 * Collective Cognition Reward Item
 */
export function RewardItem({
  id,
  isEditing,
  reward,
  handleRemoveReward,
  handleToggleUnlocked,
  onCancelEdit,
  onEdit,
  onSaveEdit
}: RewardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const [editName, setEditName] = useState<string | undefined>(reward.name)
  const [editCC, setEditCC] = useState<number>(reward.cc)

  useEffect(() => {
    setEditName(reward.name)
    setEditCC(reward.cc)
  }, [reward.name, reward.cc])

  const handleEditSave = () => {
    if (!editName || editName.trim() === '')
      return toast.warning('A nameless gift cannot be manifested.')

    onSaveEdit(editName.trim(), editCC)
    toast.success('The settlement eagerly awaits this reward.')
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
        name={`reward-unlocked-${id}`}
        id={`reward-unlocked-${id}`}
      />

      <div className="flex items-center">
        <FormLabel htmlFor={`reward-cc-${id}`} className="mr-2 text-sm">
          CC:
        </FormLabel>
        {isEditing ? (
          <Input
            type="number"
            className="w-12 h-8 text-sm no-spinners"
            value={editCC}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (!isNaN(value) && value >= 0) setEditCC(value)
            }}
            min={0}
            onKeyDown={handleEditKeyDown}
            autoFocus
            name={`reward-cc-${id}`}
            id={`reward-cc-${id}`}
          />
        ) : (
          <Input
            type="number"
            className="w-12 h-8 text-sm no-spinners"
            value={reward.cc}
            onChange={() => {}}
            min={0}
            disabled
            name={`reward-cc-${id}`}
            id={`reward-cc-${id}`}
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
            name={`reward-name-${id}`}
            id={`reward-name-${id}`}
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

/**
 * New Collective Cognition Reward Item
 *
 * @param opts Options
 * @returns New Collective Cognition Reward Item Component
 */
export function NewRewardItem({
  form,
  onAdd,
  onCancel
}: NewRewardItemProps): ReactElement {
  const [name, setName] = useState<string | undefined>()
  const [cc, setCc] = useState(1)

  const handleSubmit = () => {
    if (!name || name.trim() === '')
      return toast.warning('A nameless gift cannot be manifested.')

    const rewards = [...(form.watch('ccRewards') || [])]

    if (rewards.some((r) => r.name === name.trim()))
      return toast.warning('This dark gift already exists.')

    const newReward = {
      name: name.trim(),
      cc: cc,
      unlocked: false
    }

    const updatedRewards = [...rewards, newReward]
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
        toast.success('A new gift manifests from the darkness.')
      }
    } catch (error) {
      console.error('New Reward Submit Error:', error)
      toast.error('Failed to save the new reward. Please try again.')
    }

    // Reset form
    setName(undefined)
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

      <Checkbox disabled name="new-reward-unlocked" id="new-reward-unlocked" />

      <div className="flex items-center">
        <FormLabel htmlFor="new-reward-cc" className="mr-2 text-sm">
          CC:
        </FormLabel>
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
          name="new-reward-cc"
          id="new-reward-cc"
        />
      </div>

      <Input
        placeholder="Add a new reward..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
        onKeyDown={handleKeyDown}
        autoFocus
        name="new-reward-name"
        id="new-reward-name"
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
