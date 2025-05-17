import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, startTransition, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Monster Volume Item Component Properties
 */
export interface MonsterVolumeItemProps {
  /** Remove Volume Callback */
  handleRemoveVolume: (volume: string) => void
  /** Volume ID */
  id: string
  /** Editing Status */
  isEditing: boolean
  /** OnCancelEdit Callback */
  onCancelEdit: () => void
  /** OnEdit Callback */
  onEdit: () => void
  /** OnSaveEdit Callback */
  onSaveEdit: (name: string) => void
  /** Volume Name */
  volume: string
}

/**
 * New Monster Volume Item Component Properties
 */
export interface NewMonsterVolumeItemProps {
  /** Existing Names */
  existingNames: string[]
  /** Form */
  form: UseFormReturn<Settlement>
  /** OnAdd Callback */
  onAdd: () => void
}

/**
 * Monster Volume Item Component
 */
export function MonsterVolumeItem({
  handleRemoveVolume,
  id,
  isEditing,
  onCancelEdit,
  onEdit,
  onSaveEdit,
  volume
}: MonsterVolumeItemProps): ReactElement {
  const [value, setValue] = useState<string | undefined>(volume)

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  useEffect(() => setValue(volume), [volume])

  /**
   * Handles the save action for the edited volume.
   */
  const handleEditSave = () => {
    if (!value || value.trim() === '')
      return toast.warning('Cannot inscribe an unnamed monster volume.')

    onSaveEdit(value.trim())
    toast.success('Monster volume preserved in blood.')
  }

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it saves the edited volume.
   */
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

      {/* Volume Name */}
      {isEditing ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          className="flex-1"
          autoFocus
        />
      ) : (
        <div className="flex-1 text-sm text-left">{volume}</div>
      )}

      {/* Save/Edit/Delete Buttons */}
      {isEditing ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleEditSave}
            title="Save volume">
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
            title="Edit volume">
            <PencilIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handleRemoveVolume(volume)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

/**
 * New Monster Volume Item Component
 */
export function NewMonsterVolumeItem({
  form,
  onAdd,
  existingNames
}: NewMonsterVolumeItemProps): ReactElement {
  const [name, setName] = useState<string | undefined>(undefined)

  const handleSubmit = () => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot inscribe an unnamed monster volume.')

    if (existingNames.includes(name.trim()))
      return toast.warning('This monster volume has already been inscribed.')

    startTransition(() => {
      const monsterVolumes = [...(form.watch('monsterVolumes') || [])]
      const updatedVolumes = [...monsterVolumes, name.trim()]

      form.setValue('monsterVolumes', updatedVolumes)

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].monsterVolumes = updatedVolumes
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success('New monster volume inscribed.')
      } catch (error) {
        console.error('New Monster Volume Save Error:', error)
        toast.error('Failed to save new monster volume. Please try again.')
      }

      setName('')
      onAdd()
    })
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
      <Input
        placeholder="Add a monster volume..."
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
        title="Save monster volume">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={onAdd}
        title="Cancel add volume">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
