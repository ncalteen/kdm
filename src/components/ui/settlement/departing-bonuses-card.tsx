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
  XIcon
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

function BonusItem({
  index,
  value,
  isDisabled,
  onSave,
  onEdit,
  onRemove,
  onChange
}: {
  index: number
  value: string
  isDisabled: boolean
  onSave: (index: number) => void
  onEdit: (index: number) => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() })
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange(index, e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index)
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
      {isDisabled ? (
        <Input value={inputValue} disabled className="flex-1" />
      ) : (
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
      )}
      <div className="flex items-center gap-2 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit bonus">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(index)}
            title="Save bonus">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          title="Remove bonus">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function DepartingBonusesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const bonuses = useMemo(() => form.watch('departingBonuses') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      bonuses.forEach((_, i) => {
        next[i] = prev[i] ?? true
      })
      return next
    })
  }, [bonuses])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addBonus = useCallback(() => {
    form.setValue('departingBonuses', [...bonuses, ''])
    setDisabledInputs((prev) => ({ ...prev, [bonuses.length]: false }))
  }, [bonuses, form])

  const handleRemoveBonus = useCallback(
    (index: number) => {
      const updatedBonuses = [...bonuses]
      updatedBonuses.splice(index, 1)
      form.setValue('departingBonuses', updatedBonuses)
      setDisabledInputs((prev) => {
        const next = { ...prev }
        delete next[index]
        const reindexed: { [key: number]: boolean } = {}
        Object.keys(next).forEach((k) => {
          const num = parseInt(k)
          if (num > index) {
            reindexed[num - 1] = next[num]
          } else if (num < index) {
            reindexed[num] = next[num]
          }
        })
        return reindexed
      })
    },
    [bonuses, form]
  )

  const handleEdit = useCallback((index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }, [])

  const handleSave = useCallback(
    (index: number) => {
      if (!bonuses[index] || bonuses[index].trim() === '') {
        toast.warning('Cannot save an empty bonus')
        return
      }
      setDisabledInputs((prev) => ({ ...prev, [index]: true }))
      toast.success('Bonus saved')
    },
    [bonuses]
  )

  const handleChange = useCallback(
    (index: number, value: string) => {
      const updatedBonuses = [...bonuses]
      updatedBonuses[index] = value
      form.setValue('departingBonuses', updatedBonuses)
    },
    [bonuses, form]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = parseInt(active.id.toString())
          const newIndex = parseInt(over.id.toString())
          const newOrder = arrayMove(bonuses, oldIndex, newIndex)
          form.setValue('departingBonuses', newOrder)
        })
      }
    },
    [bonuses, form]
  )

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Departing Survivor Bonuses
        </CardTitle>
        <CardDescription className="text-left">
          Departing survivors gain these bonuses.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={bonuses.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {bonuses.map((bonus, index) => (
                <BonusItem
                  key={index}
                  index={index}
                  value={bonus}
                  isDisabled={!!disabledInputs[index]}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onRemove={handleRemoveBonus}
                  onChange={handleChange}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addBonus}
              disabled={Object.values(disabledInputs).some((v) => v === false)}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Bonus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
