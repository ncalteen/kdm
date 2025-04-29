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
import { BookOpen, GripVertical, PlusCircleIcon, XIcon } from 'lucide-react'
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
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

interface MilestoneItemProps {
  milestone: {
    name: string
    complete: boolean
    event: string
  }
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveMilestone: (index: number) => void
}

function MilestoneItem({
  index,
  form,
  handleRemoveMilestone,
  id
}: MilestoneItemProps & { id: string }) {
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
        name={`milestones.${index}.complete`}
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                className="mt-2"
                onCheckedChange={(checked) => {
                  form.setValue(`milestones.${index}.complete`, !!checked)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`milestones.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Milestone"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue(`milestones.${index}.name`, e.target.value)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <BookOpen />

      <FormField
        control={form.control}
        name={`milestones.${index}.event`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                placeholder="Event"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue(`milestones.${index}.event`, e.target.value)
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
        onClick={() => handleRemoveMilestone(index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function MilestonesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const milestones = form.watch('milestones') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMilestone = () => {
    const currentMilestones = [...milestones]
    currentMilestones.push({ name: '', complete: false, event: '' })
    form.setValue('milestones', currentMilestones)
  }

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = [...milestones]
    currentMilestones.splice(index, 1)
    form.setValue('milestones', currentMilestones)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(milestones, oldIndex, newIndex)
      form.setValue('milestones', newOrder)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Settlement Milestones
        </CardTitle>
        <CardDescription className="text-left">
          Trigger these effects when the milestone condition is met.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={milestones.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {milestones.map((milestone, index) => (
                <MilestoneItem
                  key={index}
                  id={index.toString()}
                  milestone={milestone}
                  index={index}
                  form={form}
                  handleRemoveMilestone={handleRemoveMilestone}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMilestone}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
