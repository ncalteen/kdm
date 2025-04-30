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
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface GearItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveGear: (index: number) => void
  id: string
}

function GearItem({ index, form, handleRemoveGear, id }: GearItemProps) {
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
        name={`gear.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Gear item"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue(`gear.${index}`, e.target.value)
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
        onClick={() => handleRemoveGear(index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function GearCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const gear = form.watch('gear') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addGear = () => {
    const currentGear = [...gear]
    currentGear.push('')
    form.setValue('gear', currentGear)
  }

  const handleRemoveGear = (index: number) => {
    const currentGear = [...gear]
    currentGear.splice(index, 1)
    form.setValue('gear', currentGear)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(gear, oldIndex, newIndex)
      form.setValue('gear', newOrder)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Gear Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {gear.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No gear obtained yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={gear.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {gear.map((gearItem, index) => (
                  <GearItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveGear={handleRemoveGear}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          <div className="pt-2 flex justify-center">
            <Button type="button" size="sm" variant="outline" onClick={addGear}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Gear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
