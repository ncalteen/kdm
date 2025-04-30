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
import { useEffect, useState } from 'react'
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
  updateQuarryNode: (quarryName: string, node: string) => void
  handleRemoveQuarry: (quarryName: string) => void
  isDisabled: boolean
  onSave: (quarryName: string) => void
  onEdit: (quarryName: string) => void
  updateQuarryName: (originalName: string, newName: string) => void
}

function QuarryItem({
  quarry,
  updateQuarryNode,
  handleRemoveQuarry,
  id,
  isDisabled,
  onSave,
  onEdit,
  updateQuarryName
}: QuarryItemProps & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [nameValue, setNameValue] = useState(quarry.name)

  // Keep nameValue in sync with quarry.name
  useEffect(() => {
    setNameValue(quarry.name)
  }, [quarry.name])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value)
  }

  const handleSave = () => {
    if (nameValue.trim() !== '') {
      updateQuarryName(quarry.name, nameValue)
      onSave(nameValue)
    } else {
      toast.warning('Cannot save a quarry without a name')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
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
        <FormField
          name="quarries"
          render={() => (
            <FormItem className="flex items-center space-x-2 flex-shrink-0">
              <FormControl>
                <Checkbox checked={false} className="mt-2" disabled={true} />
              </FormControl>
              <FormLabel className="text-sm font-medium">
                {quarry.name}
              </FormLabel>
            </FormItem>
          )}
        />
      ) : (
        <>
          <Checkbox checked={false} disabled={true} />
          <Input
            value={nameValue}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
        </>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <Select
          value={quarry.node}
          onValueChange={(value) => updateQuarryNode(quarry.name, value)}
          disabled={isDisabled}>
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

        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(quarry.name)}
            title="Edit quarry">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSave}
            title="Save quarry">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveQuarry(quarry.name)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewQuarryItem({
  index,
  handleRemoveQuarry,
  onSave
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveQuarry: (quarryName: string) => void
  onSave: (name: string, node: string, completed: boolean) => void
}) {
  const [name, setName] = useState('')
  const [node, setNode] = useState('Node 1')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleNodeChange = (value: string) => {
    setNode(value)
  }

  const handleSave = () => {
    if (name.trim() !== '') {
      onSave(name.trim(), node, false)
    } else {
      toast.warning('Cannot save a quarry without a name')
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

      <Checkbox checked={false} disabled={true} />

      <Input
        placeholder="Add a quarry..."
        value={name}
        onChange={handleNameChange}
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
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save quarry">
        <CheckIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveQuarry('new-quarry-' + index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function QuarryCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const quarries = form.watch('quarries') || []

  // Initialize disabledInputs based on current quarries
  // This ensures that after navigation, all saved quarries remain disabled
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>(() => {
    // Create an object with all existing quarries marked as disabled
    const initialDisabled: { [key: string]: boolean } = {}
    quarries.forEach((quarry) => {
      initialDisabled[quarry.name] = true
    })
    return initialDisabled
  })

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = () => {
    setIsAddingNew(true)
  }

  const handleRemoveQuarry = (quarryName: string) => {
    if (quarryName.startsWith('new-quarry-')) {
      setIsAddingNew(false)
    } else {
      // Remove by name for existing items
      const updatedQuarries = quarries.filter((q) => q.name !== quarryName)
      form.setValue('quarries', updatedQuarries)

      // Remove from disabled inputs
      const updatedDisabledInputs = { ...disabledInputs }
      delete updatedDisabledInputs[quarryName]
      setDisabledInputs(updatedDisabledInputs)
    }
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

  const updateQuarryName = (originalName: string, newName: string) => {
    const updatedQuarries = quarries.map((q) => {
      if (q.name === originalName) {
        return { ...q, name: newName }
      }
      return q
    })
    form.setValue('quarries', updatedQuarries)

    // Update the key in disabledInputs to match the new name
    const updatedDisabledInputs = { ...disabledInputs }
    delete updatedDisabledInputs[originalName]
    updatedDisabledInputs[newName] = true
    setDisabledInputs(updatedDisabledInputs)
  }

  const saveQuarry = (quarryName: string) => {
    if (!quarryName || quarryName.trim() === '') {
      toast.warning('Cannot save a quarry without a name')
      return
    }

    // Mark this quarry as disabled (saved)
    setDisabledInputs({
      ...disabledInputs,
      [quarryName]: true
    })

    toast.success('Quarry saved')
  }

  const saveNewQuarry = (name: string, node: string, completed: boolean) => {
    // Check if a quarry with this name already exists
    if (quarries.some((q) => q.name === name)) {
      toast.warning('A quarry with this name already exists')
      return
    }

    // Add the new quarry to the list
    const newQuarry = {
      name,
      completed,
      node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
    }
    const updatedQuarries = [...quarries, newQuarry]
    form.setValue('quarries', updatedQuarries)

    // Mark as saved/disabled
    setDisabledInputs({
      ...disabledInputs,
      [name]: true
    })

    setIsAddingNew(false)
    toast.success('New quarry added')
  }

  const editQuarry = (quarryName: string) => {
    // Mark this quarry as enabled (editable)
    const updatedDisabledInputs = { ...disabledInputs }
    updatedDisabledInputs[quarryName] = false
    setDisabledInputs(updatedDisabledInputs)

    toast.info('Editing quarry')
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
              {quarries.map((quarry) => (
                <QuarryItem
                  key={quarry.name}
                  id={quarry.name}
                  quarry={quarry}
                  updateQuarryNode={updateQuarryNode}
                  handleRemoveQuarry={handleRemoveQuarry}
                  isDisabled={!!disabledInputs[quarry.name]}
                  onSave={saveQuarry}
                  onEdit={editQuarry}
                  updateQuarryName={updateQuarryName}
                />
              ))}
            </SortableContext>
          </DndContext>

          {isAddingNew && (
            <NewQuarryItem
              index={quarries.length}
              form={form}
              handleRemoveQuarry={handleRemoveQuarry}
              onSave={saveNewQuarry}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addQuarry}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Quarry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
