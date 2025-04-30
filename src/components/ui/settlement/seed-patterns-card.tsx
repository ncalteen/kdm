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
  id
}: SeedPatternItemProps) {
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
        name={`seedPatterns.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Seed Pattern"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue(`seedPatterns.${index}`, e.target.value)
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
        onClick={() => handleRemoveSeedPattern(index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SeedPatternsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const seedPatterns = form.watch('seedPatterns') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addSeedPattern = () => {
    const currentSeedPatterns = [...seedPatterns]
    currentSeedPatterns.push('')
    form.setValue('seedPatterns', currentSeedPatterns)
  }

  const handleRemoveSeedPattern = (index: number) => {
    const currentSeedPatterns = [...seedPatterns]
    currentSeedPatterns.splice(index, 1)
    form.setValue('seedPatterns', currentSeedPatterns)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(seedPatterns, oldIndex, newIndex)
      form.setValue('seedPatterns', newOrder)
    }
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
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addSeedPattern}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Seed Pattern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
