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
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface BonusItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveBonus: (index: number) => void
  id: string
}

function BonusItem({ index, form, handleRemoveBonus, id }: BonusItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <FormField
        control={form.control}
        name={`departingBonuses.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Bonus"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue(`departingBonuses.${index}`, e.target.value)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ml-2"
        onClick={() => handleRemoveBonus(index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function DepartingBonusesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const bonuses = form.watch('departingBonuses') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addBonus = () => {
    const currentBonuses = [...bonuses]
    currentBonuses.push('')
    form.setValue('departingBonuses', currentBonuses)
  }

  const handleRemoveBonus = (index: number) => {
    const currentBonuses = [...bonuses]
    currentBonuses.splice(index, 1)
    form.setValue('departingBonuses', currentBonuses)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(bonuses, oldIndex, newIndex)
      form.setValue('departingBonuses', newOrder)
    }
  }

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
                  id={index.toString()}
                  index={index}
                  form={form}
                  handleRemoveBonus={handleRemoveBonus}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addBonus}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Bonus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
