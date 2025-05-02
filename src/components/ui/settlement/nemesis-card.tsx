'use client'

import { Nemesis } from '@/lib/types'
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
  SkullIcon,
  TrashIcon
} from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

// Interface definitions
interface NemesisItemProps {
  nemesis: {
    name: string
    unlocked: boolean
    level1: boolean
    level2: boolean
    level3: boolean
  }
  handleToggleLevel: (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => void
  toggleUnlocked: (nemesisName: string, checked: boolean) => void
  handleRemoveNemesis: (nemesisName: string) => void
  isDisabled: boolean
  onSave: (nemesisName: string) => void
  onEdit: (nemesisName: string) => void
  updateNemesisName: (originalName: string, newName: string) => void
}

// Memoized NemesisItem component
const MemoizedNemesisItem = memo(
  ({
    nemesis,
    handleToggleLevel,
    toggleUnlocked,
    handleRemoveNemesis,
    id,
    isDisabled,
    onSave,
    onEdit,
    updateNemesisName
  }: NemesisItemProps & {
    id: string
    updateNemesisName: (originalName: string, newName: string) => void
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })
    const [nameValue, setNameValue] = useState(nemesis.name)

    useEffect(() => {
      setNameValue(nemesis.name)
    }, [nemesis.name])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNameValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (nameValue !== nemesis.name) {
          updateNemesisName(nemesis.name, nameValue)
        } else {
          onSave(nameValue)
        }
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
            name="nemesis.unlocked"
            render={() => (
              <FormItem className="flex items-center space-x-2 flex-shrink-0">
                <FormControl>
                  <Checkbox
                    checked={nemesis.unlocked}
                    className="mt-2"
                    disabled={true}
                    id={`nemesis-${nemesis.name}-unlocked`}
                    name={`nemesis[${nemesis.name}].unlocked`}
                  />
                </FormControl>
                <FormLabel
                  className="text-sm font-medium mr-2"
                  htmlFor={`nemesis-${nemesis.name}-unlocked`}>
                  {nemesis.name}
                </FormLabel>
              </FormItem>
            )}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={nemesis.unlocked}
              className="mt-2"
              disabled={false}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  toggleUnlocked(nemesis.name, !!checked)
                }
              }}
              id={`nemesis-${nemesis.name}-unlocked`}
              name={`nemesis[${nemesis.name}].unlocked`}
            />
            <Input
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="w-[180px]"
              autoFocus
              id={`nemesis-${nemesis.name}-name`}
              name={`nemesis[${nemesis.name}].name`}
            />
          </div>
        )}

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
                    id={`nemesis-${nemesis.name}-level1`}
                    name={`nemesis[${nemesis.name}].level1`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level1`}>
                  Lvl 1
                </FormLabel>
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
                    id={`nemesis-${nemesis.name}-level2`}
                    name={`nemesis[${nemesis.name}].level2`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level2`}>
                  Lvl 2
                </FormLabel>
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
                    id={`nemesis-${nemesis.name}-level3`}
                    name={`nemesis[${nemesis.name}].level3`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level3`}>
                  Lvl 3
                </FormLabel>
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
              onClick={() => {
                if (nameValue !== nemesis.name) {
                  // Update the name if changed
                  updateNemesisName(nemesis.name, nameValue)
                } else {
                  // Just save with the current name
                  onSave(nameValue)
                }
              }}
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
)

MemoizedNemesisItem.displayName = 'MemoizedNemesisItem'

// Memoized content component
const NemesisContent = memo(
  ({
    nemeses,
    disabledInputs,
    isAddingNew,
    sensors,
    handleToggleLevel,
    handleRemoveNemesis,
    saveNemesis,
    editNemesis,
    addNemesis,
    handleDragEnd,
    form,
    toggleUnlocked,
    setDisabledInputs,
    setIsAddingNew,
    updateNemesisName
  }: {
    nemeses: Nemesis[]
    disabledInputs: { [key: string]: boolean }
    isAddingNew: boolean
    sensors: SensorDescriptor<object>[]
    handleToggleLevel: (
      nemesisName: string,
      level: 'level1' | 'level2' | 'level3',
      checked: boolean
    ) => void
    handleRemoveNemesis: (nemesisName: string) => void
    saveNemesis: (nemesisName: string) => void
    editNemesis: (nemesisName: string) => void
    addNemesis: () => void
    handleDragEnd: (event: DragEndEvent) => void
    form: UseFormReturn<z.infer<typeof SettlementSchema>>
    toggleUnlocked: (nemesisName: string, checked: boolean) => void
    setDisabledInputs: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
    updateNemesisName: (originalName: string, newName: string) => void
  }) => {
    const saveNewNemesis = useCallback(
      (name: string) => {
        // Check if a nemesis with this name already exists
        if (nemeses.some((n) => n.name === name)) {
          toast.warning('A nemesis with this name already exists')
          return false
        }

        // Add the new nemesis to the list with deferred execution
        requestAnimationFrame(() => {
          const newNemesis = {
            name,
            unlocked: false,
            level1: false,
            level2: false,
            level3: false,
            ccLevel1: false,
            ccLevel2: false,
            ccLevel3: false
          }
          const updatedNemeses = [...nemeses, newNemesis]
          form.setValue('nemesis', updatedNemeses)

          // Mark the new nemesis as disabled immediately to prevent duplicates
          setDisabledInputs((prev) => ({
            ...prev,
            [name]: true
          }))

          // Close the "add new" form
          setIsAddingNew(false)

          toast.success('New nemesis added')
        })

        return true
      },
      [nemeses, form, setDisabledInputs, setIsAddingNew]
    )

    return (
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
                <MemoizedNemesisItem
                  key={nemesis.name}
                  id={nemesis.name}
                  nemesis={nemesis}
                  handleToggleLevel={handleToggleLevel}
                  toggleUnlocked={toggleUnlocked}
                  handleRemoveNemesis={handleRemoveNemesis}
                  isDisabled={!!disabledInputs[nemesis.name]}
                  onSave={saveNemesis}
                  onEdit={editNemesis}
                  updateNemesisName={updateNemesisName}
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
    )
  }
)

NemesisContent.displayName = 'NemesisContent'

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

      <Checkbox
        checked={false}
        disabled={true}
        id={`nemesis-new-${index}-unlocked`}
        name={`nemesis[new-${index}].unlocked`}
      />

      <Input
        placeholder="Add a nemesis..."
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`nemesis-new-${index}-name`}
        name={`nemesis[new-${index}].name`}
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
  const nemeses = useMemo(() => form.watch('nemesis') || [], [form])

  // Add visibility state for progressive loading
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

    const currentRef = cardRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  // Sync disabledInputs with nemeses
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}
      nemeses.forEach((nemesis) => {
        next[nemesis.name] = prev[nemesis.name] ?? true
      })
      return next
    })
  }, [nemeses])

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = useCallback(() => setIsAddingNew(true), [])

  const handleRemoveNemesis = useCallback(
    (nemesisName: string) => {
      if (nemesisName.startsWith('new-nemesis-')) {
        setIsAddingNew(false)
      } else {
        const updatedNemeses = nemeses.filter((n) => n.name !== nemesisName)
        form.setValue('nemesis', updatedNemeses)
        setDisabledInputs((prev) => {
          const updated = { ...prev }
          delete updated[nemesisName]
          return updated
        })
      }
    },
    [nemeses, form]
  )

  const handleToggleLevel = useCallback(
    (
      nemesisName: string,
      level: 'level1' | 'level2' | 'level3',
      checked: boolean
    ) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === nemesisName ? { ...n, [level]: checked } : n
      )
      form.setValue('nemesis', updatedNemeses)
    },
    [nemeses, form]
  )

  const toggleUnlocked = useCallback(
    (nemesisName: string, checked: boolean) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === nemesisName ? { ...n, unlocked: checked } : n
      )
      form.setValue('nemesis', updatedNemeses)
    },
    [nemeses, form]
  )

  const saveNemesis = useCallback((nemesisName: string) => {
    if (!nemesisName || nemesisName.trim() === '') {
      toast.warning('Cannot save a nemesis without a name')
      return
    }

    setDisabledInputs((prev) => ({
      ...prev,
      [nemesisName]: true
    }))

    toast.success('Nemesis saved')
  }, [])

  const updateNemesisName = useCallback(
    (originalName: string, newName: string) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === originalName ? { ...n, name: newName } : n
      )
      form.setValue('nemesis', updatedNemeses)
      setDisabledInputs((prev) => {
        const updated = { ...prev }
        delete updated[originalName]
        updated[newName] = true
        return updated
      })
    },
    [nemeses, form]
  )

  const editNemesis = useCallback((nemesisName: string) => {
    setDisabledInputs((prev) => ({
      ...prev,
      [nemesisName]: false
    }))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = nemeses.findIndex((n) => n.name === active.id)
          const newIndex = nemeses.findIndex((n) => n.name === over.id)

          const newOrder = arrayMove(nemeses, oldIndex, newIndex)
          form.setValue('nemesis', newOrder)
        })
      }
    },
    [nemeses, form]
  )

  // Cache values to prevent unnecessary re-renders
  const cachedNemeses = useMemo(() => nemeses, [nemeses])

  // Prepare props for NemesisContent component
  const contentProps = useMemo(
    () => ({
      nemeses: cachedNemeses,
      disabledInputs,
      isAddingNew,
      sensors,
      handleToggleLevel,
      handleRemoveNemesis,
      saveNemesis,
      editNemesis,
      addNemesis,
      handleDragEnd,
      form,
      toggleUnlocked,
      setDisabledInputs,
      setIsAddingNew,
      updateNemesisName
    }),
    [
      cachedNemeses,
      disabledInputs,
      isAddingNew,
      sensors,
      handleToggleLevel,
      handleRemoveNemesis,
      saveNemesis,
      editNemesis,
      addNemesis,
      handleDragEnd,
      form,
      toggleUnlocked,
      setDisabledInputs,
      setIsAddingNew,
      updateNemesisName
    ]
  )

  return (
    <Card className="mt-2" ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <SkullIcon className="h-4 w-4" /> Nemesis Monsters
        </CardTitle>
        <CardDescription className="text-left text-xs">
          The nemesis monsters your settlement can encounter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <NemesisContent {...contentProps} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Loading nemesis monsters...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
