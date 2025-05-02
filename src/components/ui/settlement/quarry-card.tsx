'use client'

import { Quarry } from '@/lib/types'
import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  SensorDescriptor,
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
  SwordIcon,
  TrashIcon
} from 'lucide-react'
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '../badge'
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
    unlocked: boolean
    node: string
  }
  updateQuarryNode: (quarryName: string, node: string) => void
  handleRemoveQuarry: (quarryName: string) => void
  isDisabled: boolean
  onSave: (quarryName: string) => void
  onEdit: (quarryName: string) => void
  updateQuarryName: (originalName: string, newName: string) => void
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
}

const MemoizedQuarryItem = memo(
  ({
    quarry,
    updateQuarryNode,
    handleRemoveQuarry,
    id,
    isDisabled,
    onSave,
    onEdit,
    updateQuarryName
  }: QuarryItemProps & { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })
    const [nameValue, setNameValue] = useState(quarry.name)

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
                  <Checkbox
                    checked={quarry.unlocked}
                    className="mt-2"
                    disabled={true}
                    id={`quarry-${quarry.name}-unlocked`}
                    name={`quarries[${quarry.name}].unlocked`}
                  />
                </FormControl>
                <FormLabel
                  className="text-sm font-medium"
                  htmlFor={`quarry-${quarry.name}-unlocked`}>
                  {quarry.name}
                </FormLabel>
              </FormItem>
            )}
          />
        ) : (
          <>
            <Checkbox
              checked={quarry.unlocked}
              disabled={true}
              id={`quarry-${quarry.name}-unlocked`}
              name={`quarries[${quarry.name}].unlocked`}
            />
            <Input
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
              autoFocus
              id={`quarry-${quarry.name}-name`}
              name={`quarries[${quarry.name}].name`}
            />
          </>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isDisabled ? (
            <Badge
              variant="secondary"
              className="h-8 px-3 flex items-center justify-center">
              {quarry.node}
            </Badge>
          ) : (
            <Select
              value={quarry.node}
              onValueChange={(value) => updateQuarryNode(quarry.name, value)}
              disabled={isDisabled}
              name={`quarries[${quarry.name}].node`}>
              <SelectTrigger
                className="h-8 w-24"
                id={`quarry-${quarry.name}-node-trigger`}
                name={`quarries[${quarry.name}].node`}>
                <SelectValue placeholder={quarry.node} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Node 1">Node 1</SelectItem>
                <SelectItem value="Node 2">Node 2</SelectItem>
                <SelectItem value="Node 3">Node 3</SelectItem>
                <SelectItem value="Node 4">Node 4</SelectItem>
              </SelectContent>
            </Select>
          )}

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
)

MemoizedQuarryItem.displayName = 'MemoizedQuarryItem'

function NewQuarryItem({
  index,
  handleRemoveQuarry,
  onSave
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveQuarry: (quarryName: string) => void
  onSave: (name: string, node: string, unlocked: boolean) => void
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

      <Checkbox
        checked={false}
        disabled={true}
        id={`quarry-new-${index}-unlocked`}
        name={`quarries[new-${index}].unlocked`}
      />

      <Input
        placeholder="Add a quarry..."
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`quarry-new-${index}-name`}
        name={`quarries[new-${index}].name`}
      />

      <Select
        value={node}
        onValueChange={handleNodeChange}
        name={`quarries[new-${index}].node`}>
        <SelectTrigger
          className="w-24"
          id={`quarry-new-${index}-node-trigger`}
          name={`quarries[new-${index}].node`}>
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

const QuarryContent = memo(
  ({
    quarries,
    disabledInputs,
    isAddingNew,
    sensors,
    updateQuarryNode,
    handleRemoveQuarry,
    saveQuarry,
    editQuarry,
    updateQuarryName,
    addQuarry,
    handleDragEnd,
    form,
    setDisabledInputs,
    setIsAddingNew
  }: {
    quarries: Quarry[]
    disabledInputs: { [key: string]: boolean }
    isAddingNew: boolean
    sensors: SensorDescriptor<object>[]
    updateQuarryNode: (quarryName: string, node: string) => void
    handleRemoveQuarry: (quarryName: string) => void
    saveQuarry: (quarryName: string) => void
    editQuarry: (quarryName: string) => void
    updateQuarryName: (originalName: string, newName: string) => void
    addQuarry: () => void
    handleDragEnd: (event: DragEndEvent) => void
    form: UseFormReturn<z.infer<typeof SettlementSchema>>
    setDisabledInputs: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const saveNewQuarry = useCallback(
      (name: string, node: string, unlocked: boolean) => {
        if (quarries.some((q) => q.name === name)) {
          toast.warning('A quarry with this name already exists')
          return false
        }

        startTransition(() => {
          const newQuarry = {
            name,
            unlocked,
            node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
          }
          const updatedQuarries = [...quarries, newQuarry]
          form.setValue('quarries', updatedQuarries)

          // Mark the new quarry as disabled immediately to prevent duplicates
          setDisabledInputs((prev) => ({
            ...prev,
            [name]: true
          }))

          // Close the "add new" form
          setIsAddingNew(false)

          toast.success('New quarry added')
        })

        return true
      },
      [quarries, form, setDisabledInputs, setIsAddingNew]
    )

    return (
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={quarries.map((q) => q.name)}
            strategy={verticalListSortingStrategy}>
            {quarries.map((quarry) => (
              <MemoizedQuarryItem
                key={quarry.name}
                id={quarry.name}
                quarry={quarry}
                updateQuarryNode={updateQuarryNode}
                handleRemoveQuarry={handleRemoveQuarry}
                isDisabled={!!disabledInputs[quarry.name]}
                onSave={saveQuarry}
                onEdit={editQuarry}
                updateQuarryName={updateQuarryName}
                form={form}
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
    )
  }
)

QuarryContent.displayName = 'QuarryContent'

export function QuarryCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const quarries = useMemo(() => form.watch('quarries') || [], [form])

  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentCardRef = cardRef.current
    if (currentCardRef) {
      observer.observe(currentCardRef)
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef)
      }
    }
  }, [])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}
      quarries.forEach((quarry) => {
        next[quarry.name] = prev[quarry.name] ?? true
      })
      return next
    })
  }, [quarries])

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = useCallback(() => setIsAddingNew(true), [])

  const handleRemoveQuarry = useCallback(
    (quarryName: string) => {
      if (quarryName.startsWith('new-quarry-')) {
        setIsAddingNew(false)
      } else {
        startTransition(() => {
          const updatedQuarries = quarries.filter((q) => q.name !== quarryName)
          form.setValue('quarries', updatedQuarries)
          setDisabledInputs((prev) => {
            const updated = { ...prev }
            delete updated[quarryName]
            return updated
          })
        })
      }
    },
    [quarries, form]
  )

  const updateQuarryNode = useCallback(
    (quarryName: string, node: string) => {
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === quarryName
            ? { ...q, node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4' }
            : q
        )
        form.setValue('quarries', updatedQuarries)
      })
    },
    [quarries, form]
  )

  const updateQuarryName = useCallback(
    (originalName: string, newName: string) => {
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === originalName ? { ...q, name: newName } : q
        )
        form.setValue('quarries', updatedQuarries)
        setDisabledInputs((prev) => {
          const updated = { ...prev }
          delete updated[originalName]
          updated[newName] = true
          return updated
        })
      })
    },
    [quarries, form]
  )

  const saveQuarry = useCallback((quarryName: string) => {
    if (!quarryName || quarryName.trim() === '') {
      toast.warning('Cannot save a quarry without a name')
      return
    }
    setDisabledInputs((prev) => ({ ...prev, [quarryName]: true }))
    toast.success('Quarry saved')
  }, [])

  const editQuarry = useCallback((quarryName: string) => {
    setDisabledInputs((prev) => ({ ...prev, [quarryName]: false }))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = quarries.findIndex((q) => q.name === active.id)
          const newIndex = quarries.findIndex((q) => q.name === over.id)

          const newOrder = arrayMove(quarries, oldIndex, newIndex)
          form.setValue('quarries', newOrder)
        })
      }
    },
    [quarries, form]
  )

  const cachedQuarries = useMemo(() => quarries, [quarries])
  const contentProps = useMemo(
    () => ({
      quarries: cachedQuarries,
      disabledInputs,
      isAddingNew,
      sensors,
      updateQuarryNode,
      handleRemoveQuarry,
      saveQuarry,
      editQuarry,
      updateQuarryName,
      addQuarry,
      handleDragEnd,
      form,
      setDisabledInputs,
      setIsAddingNew
    }),
    [
      cachedQuarries,
      disabledInputs,
      isAddingNew,
      sensors,
      updateQuarryNode,
      handleRemoveQuarry,
      saveQuarry,
      editQuarry,
      updateQuarryName,
      addQuarry,
      handleDragEnd,
      form
    ]
  )

  return (
    <Card className="mt-2" ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <SwordIcon className="h-5 w-5" /> Quarries
        </CardTitle>
        <CardDescription className="text-left">
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <QuarryContent {...contentProps} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Loading quarries...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
