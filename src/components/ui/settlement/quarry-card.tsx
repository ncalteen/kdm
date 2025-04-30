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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '../form'
import { Input } from '../input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select'

interface QuarryItemProps {
  quarry: {
    name: string
    completed: boolean
    node: string
  }
  handleToggleCompleted: (quarryName: string, checked: boolean) => void
  updateQuarryNode: (quarryName: string, node: string) => void
  handleRemoveQuarry: (quarryName: string) => void
}

function QuarryItem({
  quarry,
  handleToggleCompleted,
  updateQuarryNode,
  handleRemoveQuarry,
  id
}: QuarryItemProps & { id: string }) {
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
        name="quarries"
        render={() => (
          <FormItem className="flex items-center space-x-2 flex-shrink-0">
            <FormControl>
              <Checkbox
                checked={quarry.completed}
                className="mt-2"
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate') {
                    handleToggleCompleted(quarry.name, checked)
                  }
                }}
              />
            </FormControl>
            <FormLabel className="text-sm font-medium">{quarry.name}</FormLabel>
          </FormItem>
        )}
      />

      <div className="flex items-center gap-2 ml-auto">
        <Select
          value={quarry.node}
          onValueChange={(value) => updateQuarryNode(quarry.name, value)}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder={quarry.node} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Node 1">Node 1</SelectItem>
            <SelectItem value="Node 2">Node 2</SelectItem>
            <SelectItem value="Node 3">Node 3</SelectItem>
            <SelectItem value="Node 4">Node 4</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleRemoveQuarry(quarry.name)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewQuarryItem({
  index,
  form,
  handleRemoveQuarry
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveQuarry: (quarryName: string) => void
}) {
  const [name, setName] = useState('')
  const [node, setNode] = useState('Node 1')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleNodeChange = (value: string) => {
    setNode(value)
  }

  const handleBlur = () => {
    if (name.trim() !== '') {
      const updatedQuarries = [...(form.watch('quarries') || [])]
      updatedQuarries[index] = {
        ...updatedQuarries[index],
        name: name.trim(),
        node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
      }
      form.setValue('quarries', updatedQuarries)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputElement = e.target as HTMLInputElement
      inputElement.blur()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      <Input
        placeholder="Add a quarry..."
        value={name}
        onChange={handleNameChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      <Select value={node} onValueChange={handleNodeChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Node" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Node 1">Node 1</SelectItem>
          <SelectItem value="Node 2">Node 2</SelectItem>
          <SelectItem value="Node 3">Node 3</SelectItem>
          <SelectItem value="Node 4">Node 4</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleRemoveQuarry('new-quarry-' + index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function QuarryCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const quarries = form.watch('quarries') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = () => {
    // Add a new empty quarry
    const newQuarry = {
      name: '',
      completed: false,
      node: 'Node 1' as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
    }
    const updatedQuarries = [...quarries, newQuarry]
    form.setValue('quarries', updatedQuarries)
  }

  const handleRemoveQuarry = (quarryName: string) => {
    if (quarryName.startsWith('new-quarry-')) {
      // Remove by index for new unsaved items
      const index = parseInt(quarryName.replace('new-quarry-', ''))
      const updatedQuarries = [...quarries]
      updatedQuarries.splice(index, 1)
      form.setValue('quarries', updatedQuarries)
    } else {
      // Remove by name for existing items
      const updatedQuarries = quarries.filter((q) => q.name !== quarryName)
      form.setValue('quarries', updatedQuarries)
    }
  }

  const handleToggleCompleted = (quarryName: string, completed: boolean) => {
    const updatedQuarries = quarries.map((q) => {
      if (q.name === quarryName) {
        return { ...q, completed }
      }
      return q
    })
    form.setValue('quarries', updatedQuarries)
  }

  const updateQuarryNode = (quarryName: string, node: string) => {
    const updatedQuarries = quarries.map((q) => {
      if (q.name === quarryName) {
        return {
          ...q,
          node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
        }
      }
      return q
    })
    form.setValue('quarries', updatedQuarries)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = quarries.findIndex((q) => q.name === active.id)
      const newIndex = quarries.findIndex((q) => q.name === over.id)

      const newOrder = arrayMove(quarries, oldIndex, newIndex)
      form.setValue('quarries', newOrder)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Quarries
        </CardTitle>
        <CardDescription className="text-left">
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={quarries.map((q) => q.name)}
              strategy={verticalListSortingStrategy}>
              {quarries.map((quarry, index) =>
                quarry.name ? (
                  <QuarryItem
                    key={quarry.name}
                    id={quarry.name}
                    quarry={quarry}
                    handleToggleCompleted={handleToggleCompleted}
                    updateQuarryNode={updateQuarryNode}
                    handleRemoveQuarry={handleRemoveQuarry}
                  />
                ) : (
                  <NewQuarryItem
                    key={`new-quarry-${index}`}
                    index={index}
                    form={form}
                    handleRemoveQuarry={handleRemoveQuarry}
                  />
                )
              )}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addQuarry}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Quarry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
