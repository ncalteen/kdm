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
import { useState } from 'react'
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
  isDisabled: boolean
  onSave: (nemesisName: string) => void
  onEdit: (nemesisName: string) => void
}

function NemesisItem({
  nemesis,
  handleToggleLevel,
  handleRemoveNemesis,
  id,
  isDisabled,
  onSave,
  onEdit
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
                  disabled={isDisabled}
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
                  disabled={isDisabled}
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
                  disabled={isDisabled}
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

        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(nemesis.name)}
            title="Edit nemesis">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(nemesis.name)}
            title="Save nemesis">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveNemesis(nemesis.name)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewNemesisItem({
  index,
  handleRemoveNemesis,
  onSave
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveNemesis: (nemesisName: string) => void
  onSave: (name: string) => void
}) {
  const [name, setName] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSave = () => {
    if (name.trim() !== '') {
      onSave(name.trim())
    } else {
      toast.warning('Cannot save a nemesis without a name')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
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
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save nemesis">
        <CheckIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveNemesis('new-nemesis-' + index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function NemesisCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const nemeses = form.watch('nemesis') || []

  // Track which inputs are disabled (saved)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = () => {
    setIsAddingNew(true)
  }

  const handleRemoveNemesis = (nemesisName: string) => {
    if (nemesisName.startsWith('new-nemesis-')) {
      setIsAddingNew(false)
    } else {
      // Remove by name for existing items
      const updatedNemeses = nemeses.filter((n) => n.name !== nemesisName)
      form.setValue('nemesis', updatedNemeses)

      // Remove from disabled inputs
      const updatedDisabledInputs = { ...disabledInputs }
      delete updatedDisabledInputs[nemesisName]
      setDisabledInputs(updatedDisabledInputs)
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

  const saveNemesis = (nemesisName: string) => {
    if (!nemesisName || nemesisName.trim() === '') {
      toast.warning('Cannot save a nemesis without a name')
      return
    }

    // Mark this nemesis as disabled (saved)
    setDisabledInputs({
      ...disabledInputs,
      [nemesisName]: true
    })

    toast.success('Nemesis saved')
  }

  const saveNewNemesis = (name: string) => {
    // Check if a nemesis with this name already exists
    if (nemeses.some((n) => n.name === name)) {
      toast.warning('A nemesis with this name already exists')
      return
    }

    // Add the new nemesis to the list
    const newNemesis = {
      name,
      level1: false,
      level2: false,
      level3: false
    }
    const updatedNemeses = [...nemeses, newNemesis]
    form.setValue('nemesis', updatedNemeses)

    // Mark as saved/disabled
    setDisabledInputs({
      ...disabledInputs,
      [name]: true
    })

    setIsAddingNew(false)
    toast.success('New nemesis added')
  }

  const editNemesis = (nemesisName: string) => {
    // Mark this nemesis as enabled (editable)
    const updatedDisabledInputs = { ...disabledInputs }
    updatedDisabledInputs[nemesisName] = false
    setDisabledInputs(updatedDisabledInputs)

    toast.info('Editing nemesis')
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
              {nemeses.map((nemesis) =>
                nemesis.name ? (
                  <NemesisItem
                    key={nemesis.name}
                    id={nemesis.name}
                    nemesis={nemesis}
                    handleToggleLevel={handleToggleLevel}
                    handleRemoveNemesis={handleRemoveNemesis}
                    isDisabled={!!disabledInputs[nemesis.name]}
                    onSave={saveNemesis}
                    onEdit={editNemesis}
                  />
                ) : null
              )}
            </SortableContext>
          </DndContext>

          {isAddingNew && (
            <NewNemesisItem
              index={nemeses.length}
              form={form}
              handleRemoveNemesis={handleRemoveNemesis}
              onSave={saveNewNemesis}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addNemesis}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Nemesis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
