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
  MapPinIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import {
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isDisabled])

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
          ref={inputRef}
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
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function NewBonusItem({
  onSave,
  onCancel
}: {
  onSave: (bonus: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSave = () => {
    if (value.trim() !== '') {
      onSave(value.trim())
    } else {
      toast.warning('Cannot save an empty bonus')
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
        placeholder="Add a bonus..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save bonus">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
        <TrashIcon className="h-4 w-4" />
      </Button>
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

  const [isAddingNew, setIsAddingNew] = useState(false)

  const addBonus = useCallback(() => setIsAddingNew(true), [])

  const handleRemoveBonus = useCallback(
    (index: number) => {
      startTransition(() => {
        const updatedBonuses = [...bonuses]
        updatedBonuses.splice(index, 1)
        form.setValue('departingBonuses', updatedBonuses)
        setDisabledInputs((prev) => {
          const next = { ...prev }
          delete next[index]
          // Reindex
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
      })
    },
    [bonuses, form]
  )

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

  const handleEdit = useCallback((index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }, [])

  const handleChange = useCallback(
    (index: number, value: string) => {
      const updatedBonuses = [...bonuses]
      updatedBonuses[index] = value
      form.setValue('departingBonuses', updatedBonuses)
    },
    [bonuses, form]
  )

  // Save new bonus
  const saveNewBonus = useCallback(
    (bonus: string) => {
      if (bonuses.includes(bonus)) {
        toast.warning('This bonus already exists')
        return
      }
      startTransition(() => {
        const updatedBonuses = [...bonuses, bonus]
        form.setValue('departingBonuses', updatedBonuses)
        setDisabledInputs((prev) => ({
          ...prev,
          [updatedBonuses.length - 1]: true
        }))
        setIsAddingNew(false)
        toast.success('Bonus added')
      })
    },
    [bonuses, form]
  )

  const cancelNewBonus = useCallback(() => setIsAddingNew(false), [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
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
        <CardTitle className="text-md flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          Departing Survivor Bonuses
        </CardTitle>
        <CardDescription className="text-left text-xs">
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
          {isAddingNew && (
            <NewBonusItem onSave={saveNewBonus} onCancel={cancelNewBonus} />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addBonus}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Bonus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
