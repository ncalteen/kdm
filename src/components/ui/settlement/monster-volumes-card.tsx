import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
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
  BookOpenIcon,
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
import { Input } from '../input'

function MonsterVolumeItem({
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
    if (value.trim() === '') {
      toast.warning('Cannot save a monster volume without a name')
      return
    }
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

function NewMonsterVolumeItem({
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
    if (name.trim() === '') {
      toast.warning('Cannot save a monster volume without a name')
      return
    }
    if (existingNames.includes(name.trim())) {
      toast.warning('A monster volume with this name already exists')
      return
    }
    const monsterVolumes = [...(form.watch('monsterVolumes') || [])]
    form.setValue('monsterVolumes', [...monsterVolumes, name.trim()])
    setName('')
    onAdd()
    toast.success('New monster volume added')
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

export function MonsterVolumesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewVolumeForm, setShowNewVolumeForm] = useState(false)
  const [editingVolume, setEditingVolume] = useState<string | null>(null)
  const monsterVolumes = form.watch('monsterVolumes') || []
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleRemoveVolume = (volume: string) => {
    const updatedVolumes = monsterVolumes.filter((v) => v !== volume)
    form.setValue('monsterVolumes', updatedVolumes)
  }

  const handleUpdateVolume = (oldVolume: string, newVolume: string) => {
    if (newVolume.trim() === '') {
      toast.warning('Cannot save a monster volume without a name')
      return
    }
    if (monsterVolumes.some((v) => v === newVolume.trim() && v !== oldVolume)) {
      toast.warning('A monster volume with this name already exists')
      return
    }
    const updatedVolumes = monsterVolumes.map((v) => {
      if (v === oldVolume) {
        return newVolume.trim()
      }
      return v
    })
    form.setValue('monsterVolumes', updatedVolumes)
    setEditingVolume(null)
    toast.success('Monster volume saved')
  }

  const addNewVolume = () => {
    setShowNewVolumeForm(false)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <BookOpenIcon className="h-4 w-4" /> Monster Volumes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {monsterVolumes.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = monsterVolumes.indexOf(active.id as string)
                  const newIndex = monsterVolumes.indexOf(over.id as string)
                  const newOrder = arrayMove(monsterVolumes, oldIndex, newIndex)
                  form.setValue('monsterVolumes', newOrder)
                }
              }}>
              <SortableContext
                items={monsterVolumes}
                strategy={verticalListSortingStrategy}>
                {monsterVolumes.map((volume) => (
                  <MonsterVolumeItem
                    key={volume}
                    id={volume}
                    volume={volume}
                    handleRemoveVolume={handleRemoveVolume}
                    isEditing={editingVolume === volume}
                    onEdit={() => setEditingVolume(volume)}
                    onSaveEdit={(name) => handleUpdateVolume(volume, name)}
                    onCancelEdit={() => setEditingVolume(null)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewVolumeForm && (
            <NewMonsterVolumeItem
              form={form}
              onAdd={addNewVolume}
              existingNames={monsterVolumes}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewVolumeForm(true)}
              disabled={showNewVolumeForm || editingVolume !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Monster Volume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
