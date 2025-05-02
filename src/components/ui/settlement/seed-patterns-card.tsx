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
  CheckIcon,
  GripVertical,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Input } from '../input'

interface SeedPatternItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveSeedPattern: (index: number) => void
  id: string
}

function SeedPatternItem({
  index,
  form,
  handleRemoveSeedPattern,
  id,
  isDisabled,
  onSave,
  onEdit
}: SeedPatternItemProps & {
  isDisabled: boolean
  onSave: (index: number, value: string) => void
  onEdit: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(
    form.getValues(`seedPatterns.${index}`) || ''
  )
  useEffect(() => {
    setValue(form.getValues(`seedPatterns.${index}`) || '')
  }, [form, isDisabled, index])
  const style = { transform: CSS.Transform.toString(transform), transition }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, value)
    }
  }
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder="Seed Pattern"
        value={value}
        disabled={isDisabled}
        onChange={(e) => !isDisabled && setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit seed pattern">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title="Save seed pattern">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemoveSeedPattern(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SeedPatternsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const seedPatterns = useMemo(() => form.watch('seedPatterns') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      seedPatterns.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [seedPatterns])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const addSeedPattern = () => setIsAddingNew(true)
  const handleRemoveSeedPattern = (index: number) => {
    const currentSeedPatterns = [...seedPatterns]
    currentSeedPatterns.splice(index, 1)
    form.setValue('seedPatterns', currentSeedPatterns)
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })
  }
  const saveSeedPattern = (value: string) => {
    if (!value || value.trim() === '') {
      toast.warning('Cannot save a seed pattern without a name')
      return
    }
    const newSeedPatterns = [...seedPatterns, value]
    form.setValue('seedPatterns', newSeedPatterns)
    setDisabledInputs((prev) => ({
      ...prev,
      [newSeedPatterns.length - 1]: true
    }))
    setIsAddingNew(false)
    toast.success('Seed pattern saved')
  }
  const editSeedPattern = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(seedPatterns, oldIndex, newIndex)
      form.setValue('seedPatterns', newOrder)
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
    }
  }
  // NewSeedPatternItem component for temporary input
  function NewSeedPatternItem({
    onSave,
    onCancel
  }: {
    onSave: (value: string) => void
    onCancel: () => void
  }) {
    const [value, setValue] = useState('')
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSave(value)
      } else if (e.key === 'Escape') {
        onCancel()
      }
    }
    return (
      <div className="flex items-center gap-2">
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <Input
          placeholder="Seed Pattern"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(value)}
          title="Save seed pattern">
          <CheckIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          title="Cancel">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }
  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Seed Patterns
        </CardTitle>
        <CardDescription className="text-left">
          Patterns gained when survivors reach 3 understanding.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {seedPatterns.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No seed patterns added yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={seedPatterns.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {seedPatterns.map((seedPattern, index) => (
                  <SeedPatternItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveSeedPattern={handleRemoveSeedPattern}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => {
                      form.setValue(`seedPatterns.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success('Seed pattern saved')
                    }}
                    onEdit={editSeedPattern}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewSeedPatternItem
              onSave={saveSeedPattern}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addSeedPattern}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Seed Pattern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
