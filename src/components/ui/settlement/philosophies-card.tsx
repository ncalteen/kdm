'use client'

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

interface PhilosophyItemProps {
  philosophy: string
  handleRemovePhilosophy: (philosophy: string) => void
  handleUpdatePhilosophy: (oldPhilosophy: string, newPhilosophy: string) => void
  id: string
}

function PhilosophyItem({
  philosophy,
  handleRemovePhilosophy,
  id,
  isEditing,
  onEdit,
  onSaveEdit,
  onCancelEdit
}: PhilosophyItemProps & {
  isEditing: boolean
  onEdit: () => void
  onSaveEdit: (name: string) => void
  onCancelEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(philosophy)

  useEffect(() => {
    setValue(philosophy)
  }, [philosophy])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEditSave = () => {
    if (value.trim() === '') {
      toast.warning('Cannot save a philosophy without a name')
      return
    }
    onSaveEdit(value.trim())
    toast.success('Philosophy saved')
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
        <div className="flex-1 font-medium text-left">{philosophy}</div>
      )}
      {isEditing ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleEditSave}
            title="Save philosophy">
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
            title="Edit philosophy">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handleRemovePhilosophy(philosophy)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

function NewPhilosophyItem({
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
      toast.warning('Cannot save a philosophy without a name')
      return
    }
    if (existingNames.includes(name.trim())) {
      toast.warning('A philosophy with this name already exists')
      return
    }
    const philosophies = [...(form.watch('philosophies') || [])]
    form.setValue('philosophies', [...philosophies, name.trim()])
    setName('')
    onAdd()
    toast.success('New philosophy added')
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
        placeholder="Add a philosophy..."
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
        title="Save philosophy">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={onAdd}
        title="Cancel add philosophy">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function PhilosophiesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewPhilosophyForm, setShowNewPhilosophyForm] = useState(false)
  const [editingPhilosophy, setEditingPhilosophy] = useState<string | null>(
    null
  )
  const philosophies = form.watch('philosophies') || []
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleRemovePhilosophy = (philosophy: string) => {
    const updatedPhilosophies = philosophies.filter((p) => p !== philosophy)
    form.setValue('philosophies', updatedPhilosophies)
  }

  const handleUpdatePhilosophy = (
    oldPhilosophy: string,
    newPhilosophy: string
  ) => {
    if (newPhilosophy.trim() === '') {
      toast.warning('Cannot save a philosophy without a name')
      return
    }
    if (
      philosophies.some(
        (p) => p === newPhilosophy.trim() && p !== oldPhilosophy
      )
    ) {
      toast.warning('A philosophy with this name already exists')
      return
    }
    const updatedPhilosophies = philosophies.map((p) => {
      if (p === oldPhilosophy) {
        return newPhilosophy.trim()
      }
      return p
    })
    form.setValue('philosophies', updatedPhilosophies)
    setEditingPhilosophy(null)
    toast.success('Philosophy saved')
  }

  const addNewPhilosophy = () => {
    setShowNewPhilosophyForm(false)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Philosophies
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {philosophies.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = philosophies.indexOf(active.id as string)
                  const newIndex = philosophies.indexOf(over.id as string)
                  const newOrder = arrayMove(philosophies, oldIndex, newIndex)
                  form.setValue('philosophies', newOrder)
                }
              }}>
              <SortableContext
                items={philosophies}
                strategy={verticalListSortingStrategy}>
                {philosophies.map((philosophy) => (
                  <PhilosophyItem
                    key={philosophy}
                    id={philosophy}
                    philosophy={philosophy}
                    handleRemovePhilosophy={handleRemovePhilosophy}
                    handleUpdatePhilosophy={handleUpdatePhilosophy}
                    isEditing={editingPhilosophy === philosophy}
                    onEdit={() => setEditingPhilosophy(philosophy)}
                    onSaveEdit={(name) =>
                      handleUpdatePhilosophy(philosophy, name)
                    }
                    onCancelEdit={() => setEditingPhilosophy(null)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewPhilosophyForm && (
            <NewPhilosophyItem
              form={form}
              onAdd={addNewPhilosophy}
              existingNames={philosophies}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewPhilosophyForm(true)}
              disabled={showNewPhilosophyForm || editingPhilosophy !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Philosophy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
