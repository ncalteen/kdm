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
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Input } from '../input'

interface PatternItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemovePattern: (index: number) => void
  id: string
}

function PatternItem({
  index,
  form,
  handleRemovePattern,
  id,
  isDisabled,
  onSave,
  onEdit
}: PatternItemProps & {
  isDisabled: boolean
  onSave: (index: number, value: string) => void
  onEdit: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [value, setValue] = useState(form.getValues(`patterns.${index}`) || '')
  useEffect(() => {
    setValue(form.getValues(`patterns.${index}`) || '')
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
        placeholder="Pattern"
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
          title="Edit pattern">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(index, value)}
          title="Save pattern">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemovePattern(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function PatternsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const patterns = useMemo(() => form.watch('patterns') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      patterns.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [patterns])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const addPattern = () => setIsAddingNew(true)
  const handleRemovePattern = (index: number) => {
    const currentPatterns = [...patterns]
    currentPatterns.splice(index, 1)
    form.setValue('patterns', currentPatterns)
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
  const savePattern = (value: string) => {
    if (!value || value.trim() === '') {
      toast.warning('Cannot save a pattern without a name')
      return
    }
    const newPatterns = [...patterns, value]
    form.setValue('patterns', newPatterns)
    setDisabledInputs((prev) => ({ ...prev, [newPatterns.length - 1]: true }))
    setIsAddingNew(false)
    toast.success('Pattern saved')
  }
  const editPattern = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(patterns, oldIndex, newIndex)
      form.setValue('patterns', newOrder)
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
  // NewPatternItem component for temporary input
  function NewPatternItem({
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
          placeholder="Pattern"
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
          title="Save pattern">
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
          Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {patterns.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No patterns added yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={patterns.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {patterns.map((pattern, index) => (
                  <PatternItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemovePattern={handleRemovePattern}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => form.setValue(`patterns.${i}`, value)}
                    onEdit={editPattern}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewPatternItem
              onSave={savePattern}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addPattern}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Pattern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
