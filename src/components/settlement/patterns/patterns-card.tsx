'use client'

import {
  NewPatternItem,
  PatternItem
} from '@/components/settlement/patterns/pattern-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Patterns Card Component
 */
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
    if (!value || value.trim() === '')
      return toast.warning('Cannot save a pattern without a name')

    const newPatterns = [...patterns, value]

    form.setValue('patterns', newPatterns)
    setDisabledInputs((prev) => ({ ...prev, [newPatterns.length - 1]: true }))
    setIsAddingNew(false)

    toast.success('Pattern saved')
  }

  const editPattern = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

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
                    onSave={(i, value) => {
                      form.setValue(`patterns.${i}`, value)
                      setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                      toast.success('Pattern saved')
                    }}
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
