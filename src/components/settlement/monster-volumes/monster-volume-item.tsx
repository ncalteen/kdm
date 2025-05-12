import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Monster Volume Item Component
 */
export function MonsterVolumeItem({
  volume,
  handleRemoveVolume,
  id,
  isEditing,
  onEdit,
  onSaveEdit,
  onCancelEdit
}: {
  volume: string
  handleRemoveVolume: (volume: string) => void
  id: string
  isEditing: boolean
  onEdit: () => void
  onSaveEdit: (name: string) => void
  onCancelEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(volume)

  useEffect(() => {
    setValue(volume)
  }, [volume])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEditSave = () => {
    if (value.trim() === '')
      return toast.warning('Cannot save a monster volume without a name')

    onSaveEdit(value.trim())
    toast.success('Monster volume saved')
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
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
  existingNames: string[]
}) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim() === '')
      return toast.warning('Cannot save a monster volume without a name')

    if (existingNames.includes(name.trim()))
      return toast.warning('A monster volume with this name already exists')

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

        toast.success('New monster volume added!')
      } catch (error) {
        console.error('Error saving monster volumes to localStorage:', error)
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
        title="Save volume">
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
