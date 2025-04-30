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
import { GripVertical, PlusCircleIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
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
  handleUpdatePhilosophy,
  id
}: PhilosophyItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(philosophy)
  const [initialValue] = useState(philosophy)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleBlur = () => {
    if (value.trim() !== initialValue && value.trim() !== '') {
      handleUpdatePhilosophy(initialValue, value.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
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

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleRemovePhilosophy(philosophy)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function NewPhilosophyItem({
  form,
  onAdd
}: {
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  onAdd: () => void
}) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim() === '') return

    const philosophies = [...(form.watch('philosophies') || [])]
    form.setValue('philosophies', [...philosophies, name.trim()])

    // Reset form
    setName('')
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

      <Input
        placeholder="Add a philosophy..."
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

export function PhilosophiesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewPhilosophyForm, setShowNewPhilosophyForm] = useState(false)
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
    const updatedPhilosophies = philosophies.map((p) => {
      if (p === oldPhilosophy) {
        return newPhilosophy
      }
      return p
    })
    form.setValue('philosophies', updatedPhilosophies)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = philosophies.findIndex((p) => p === active.id)
      const newIndex = philosophies.findIndex((p) => p === over.id)

      const newOrder = arrayMove(philosophies, oldIndex, newIndex)
      form.setValue('philosophies', newOrder)
    }
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
              onDragEnd={handleDragEnd}>
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
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewPhilosophyForm ? (
            <NewPhilosophyItem form={form} onAdd={addNewPhilosophy} />
          ) : (
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowNewPhilosophyForm(true)}>
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                Add Philosophy
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
