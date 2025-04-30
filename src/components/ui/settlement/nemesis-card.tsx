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

interface NemesisItemProps {
  nemesis: {
    name: string
    level1: boolean
    level2: boolean
    level3: boolean
  }
  handleToggleLevel: (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => void
  handleRemoveNemesis: (nemesisName: string) => void
}

function NemesisItem({
  nemesis,
  handleToggleLevel,
  handleRemoveNemesis,
  id
}: NemesisItemProps & { id: string }) {
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
        name="nemesis"
        render={() => (
          <FormItem className="flex-shrink-0">
            <FormLabel className="text-sm font-medium mr-2">
              {nemesis.name}
            </FormLabel>
          </FormItem>
        )}
      />

      <div className="flex items-center gap-2 ml-auto">
        <FormField
          name="nemesis"
          render={() => (
            <FormItem className="flex items-center space-x-1">
              <FormControl>
                <Checkbox
                  checked={nemesis.level1}
                  className="mt-2"
                  onCheckedChange={(checked) => {
                    if (checked !== 'indeterminate') {
                      handleToggleLevel(nemesis.name, 'level1', checked)
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="text-xs">Lvl 1</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          name="nemesis"
          render={() => (
            <FormItem className="flex items-center space-x-1">
              <FormControl>
                <Checkbox
                  checked={nemesis.level2}
                  className="mt-2"
                  onCheckedChange={(checked) => {
                    if (checked !== 'indeterminate') {
                      handleToggleLevel(nemesis.name, 'level2', checked)
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="text-xs">Lvl 2</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          name="nemesis"
          render={() => (
            <FormItem className="flex items-center space-x-1">
              <FormControl>
                <Checkbox
                  checked={nemesis.level3}
                  className="mt-2"
                  onCheckedChange={(checked) => {
                    if (checked !== 'indeterminate') {
                      handleToggleLevel(nemesis.name, 'level3', checked)
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="text-xs">Lvl 3</FormLabel>
            </FormItem>
          )}
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleRemoveNemesis(nemesis.name)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewNemesisItem({
  index,
  form,
  handleRemoveNemesis
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveNemesis: (nemesisName: string) => void
}) {
  const [name, setName] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleBlur = () => {
    if (name.trim() !== '') {
      const updatedNemeses = [...(form.watch('nemesis') || [])]
      updatedNemeses[index] = {
        ...updatedNemeses[index],
        name: name.trim()
      }
      form.setValue('nemesis', updatedNemeses)
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
        placeholder="Add a nemesis..."
        value={name}
        onChange={handleNameChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleRemoveNemesis('new-nemesis-' + index)}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function NemesisCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const nemeses = form.watch('nemesis') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = () => {
    // Add a new empty nemesis with a temporary ID that will be replaced when saved
    const newNemesis = {
      name: '',
      level1: false,
      level2: false,
      level3: false
    }
    const updatedNemeses = [...nemeses, newNemesis]
    form.setValue('nemesis', updatedNemeses)
  }

  const handleRemoveNemesis = (nemesisName: string) => {
    if (nemesisName.startsWith('new-nemesis-')) {
      // Remove by index for new unsaved items
      const index = parseInt(nemesisName.replace('new-nemesis-', ''))
      const updatedNemeses = [...nemeses]
      updatedNemeses.splice(index, 1)
      form.setValue('nemesis', updatedNemeses)
    } else {
      // Remove by name for existing items
      const updatedNemeses = nemeses.filter((n) => n.name !== nemesisName)
      form.setValue('nemesis', updatedNemeses)
    }
  }

  const handleToggleLevel = (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => {
    const updatedNemeses = nemeses.map((n) => {
      if (n.name === nemesisName) {
        return { ...n, [level]: checked }
      }
      return n
    })
    form.setValue('nemesis', updatedNemeses)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = nemeses.findIndex((n) => n.name === active.id)
      const newIndex = nemeses.findIndex((n) => n.name === over.id)

      const newOrder = arrayMove(nemeses, oldIndex, newIndex)
      form.setValue('nemesis', newOrder)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Nemesis
        </CardTitle>
        <CardDescription className="text-left">
          The nemesis monsters your settlement can encounter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={nemeses.map((n) => n.name)}
              strategy={verticalListSortingStrategy}>
              {nemeses.map((nemesis, index) =>
                nemesis.name ? (
                  <NemesisItem
                    key={nemesis.name}
                    id={nemesis.name}
                    nemesis={nemesis}
                    handleToggleLevel={handleToggleLevel}
                    handleRemoveNemesis={handleRemoveNemesis}
                  />
                ) : (
                  <NewNemesisItem
                    key={`new-nemesis-${index}`}
                    index={index}
                    form={form}
                    handleRemoveNemesis={handleRemoveNemesis}
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
              onClick={addNemesis}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Nemesis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
