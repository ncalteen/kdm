'use client'

import { ResourceCategory, ResourceType } from '@/lib/enums'
import { cn } from '@/lib/utils'
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
  Check,
  CheckIcon,
  ChevronsUpDown,
  GripVertical,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '../badge'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../command'
import { Input } from '../input'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

// Create category options from the ResourceCategory enum
const categoryOptions = Object.values(ResourceCategory).map((category) => ({
  value: category,
  label: category
}))

// Create type options from the ResourceType enum
const typeOptions = Object.values(ResourceType).map((type) => ({
  value: type,
  label: type
}))

interface ResourceCategoryComboboxProps {
  selectedCategory: ResourceCategory
  onChange: (category: ResourceCategory) => void
  disabled?: boolean
}

function ResourceCategoryCombobox({
  selectedCategory,
  onChange,
  disabled
}: ResourceCategoryComboboxProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (category: ResourceCategory) => {
    if (!disabled) {
      onChange(category)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled}>
          {selectedCategory || 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search categories..."
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoryOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={disabled}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCategory === option.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ResourceTypesComboboxProps {
  selectedTypes: ResourceType[]
  onChange: (types: ResourceType[]) => void
  disabled?: boolean
}

function ResourceTypesCombobox({
  selectedTypes,
  onChange,
  disabled
}: ResourceTypesComboboxProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: ResourceType) => {
    if (disabled) return
    // Toggle selection
    const newSelection = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    // Ensure at least one type is selected
    if (newSelection.length === 0) {
      onChange([ResourceType.BONE])
    } else {
      onChange(newSelection)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled}>
          {selectedTypes.length > 0
            ? `${selectedTypes.length} selected`
            : 'Select types...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search types..." disabled={disabled} />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {typeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={disabled}>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedTypes.includes(option.value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}>
                      {selectedTypes.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {option.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ResourceItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveResource: (index: number) => void
  id: string
  isDisabled: boolean
  onSave: (
    index: number,
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => void
  onEdit: (index: number) => void
}

// Component for a single resource item in the drag and drop list
function ResourceItem({
  index,
  form,
  handleRemoveResource,
  id,
  isDisabled,
  onSave,
  onEdit
}: ResourceItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  // Local state for editing
  const resource = form.watch(`resources.${index}`)
  const [nameValue, setNameValue] = useState(resource?.name || '')
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
    resource?.category || ResourceCategory.BASIC
  )
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(
    resource?.types || [ResourceType.BONE]
  )
  const [amountValue, setAmountValue] = useState(resource?.amount || 0)

  useEffect(() => {
    setNameValue(resource?.name || '')
    setSelectedCategory(resource?.category || ResourceCategory.BASIC)
    setSelectedTypes(resource?.types || [ResourceType.BONE])
    setAmountValue(resource?.amount || 0)
  }, [resource, isDisabled, index])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, selectedCategory, selectedTypes, amountValue)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center mb-3 gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="w-[30%]">
          <Input
            placeholder="Resource Name"
            value={nameValue}
            disabled={isDisabled}
            onChange={(e) => !isDisabled && setNameValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>
        <div className="w-[25%]">
          <ResourceCategoryCombobox
            selectedCategory={selectedCategory}
            onChange={(cat) => !isDisabled && setSelectedCategory(cat)}
            disabled={isDisabled}
          />
        </div>
        <div className="w-[30%]">
          {isDisabled ? (
            <div className="flex flex-wrap gap-1">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <ResourceTypesCombobox
              selectedTypes={selectedTypes}
              onChange={(types) => !isDisabled && setSelectedTypes(types)}
              disabled={isDisabled}
            />
          )}
        </div>
        <div className="w-[10%] flex items-center">
          <Input
            type="number"
            min={0}
            placeholder="0"
            className="w-12 text-center no-spinners"
            value={amountValue}
            disabled={isDisabled}
            onChange={(e) =>
              !isDisabled && setAmountValue(Number(e.target.value))
            }
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit resource">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            onSave(
              index,
              nameValue,
              selectedCategory,
              selectedTypes,
              amountValue
            )
          }
          title="Save resource">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-9 w-9 p-0"
        onClick={() => handleRemoveResource(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Main ResourcesCard component
export function ResourcesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const resources = useMemo(() => form.watch('resources') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      resources.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [resources])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addResource = () => setIsAddingNew(true)

  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources]
    updatedResources.splice(index, 1)
    form.setValue('resources', updatedResources)
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })
  }

  const saveResource = (
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => {
    if (!name || name.trim() === '') {
      toast.warning('Cannot save a resource without a name')
      return
    }
    const newResource = { name, category, types, amount }
    const updatedResources = [...resources, newResource]
    form.setValue('resources', updatedResources)
    setDisabledInputs((prev) => ({
      ...prev,
      [updatedResources.length - 1]: true
    }))
    setIsAddingNew(false)
    toast.success('Resource saved')
  }

  const editResource = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(resources, oldIndex, newIndex)
      form.setValue('resources', newOrder)
      setDisabledInputs((prev) => {
        const next: { [key: number]: boolean } = {}
        Object.keys(prev).forEach((k) => {
          const num = parseInt(k)
          if (num === oldIndex) next[newIndex] = prev[num]
          else if (num >= newIndex && num < oldIndex) next[num + 1] = prev[num]
          else if (num <= newIndex && num > oldIndex) next[num - 1] = prev[num]
          else next[num] = prev[num]
        })
        return next
      })
    }
  }

  // NewResourceItem component for temporary input
  function NewResourceItem({
    onSave,
    onCancel
  }: {
    onSave: (
      name: string,
      category: ResourceCategory,
      types: ResourceType[],
      amount: number
    ) => void
    onCancel: () => void
  }) {
    const [name, setName] = useState('')
    const [category, setCategory] = useState(ResourceCategory.BASIC)
    const [types, setTypes] = useState<ResourceType[]>([ResourceType.BONE])
    const [amount, setAmount] = useState(0)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSave(name, category, types, amount)
      } else if (e.key === 'Escape') {
        onCancel()
      }
    }

    return (
      <div className="flex items-center mb-2 gap-2">
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div className="w-[30%]">
            <Input
              placeholder="Resource Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9"
              autoFocus
            />
          </div>
          <div className="w-[25%]">
            <ResourceCategoryCombobox
              selectedCategory={category}
              onChange={setCategory}
            />
          </div>
          <div className="w-[30%]">
            <ResourceTypesCombobox selectedTypes={types} onChange={setTypes} />
          </div>
          <div className="w-[10%] flex items-center">
            <Input
              type="number"
              min={0}
              placeholder="0"
              className="w-12 text-center no-spinners"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(name, category, types, amount)}
          title="Save resource">
          <CheckIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          title="Cancel">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-1">
          Resource Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {resources.length === 0 && !isAddingNew ? (
          <div className="text-center text-muted-foreground py-4">
            No resources added yet.
          </div>
        ) : (
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <div className="w-[30px]"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-[30%] pl-1">Name</div>
                <div className="w-[30%] pl-1">Category</div>
                <div className="w-[30%] pl-1">Types</div>
                <div className="w-[10%] pl-1">Amount</div>
                <div className="flex-shrink-0 w-9"></div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={resources.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {resources.map((_, index) => (
                <ResourceItem
                  key={index}
                  id={index.toString()}
                  index={index}
                  form={form}
                  handleRemoveResource={handleRemoveResource}
                  isDisabled={!!disabledInputs[index]}
                  onSave={(i, name, category, types, amount) => {
                    form.setValue(`resources.${i}`, {
                      name,
                      category,
                      types,
                      amount
                    })
                    setDisabledInputs((prev) => ({ ...prev, [i]: true }))
                    toast.success('Resource saved')
                  }}
                  onEdit={editResource}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewResourceItem
              onSave={saveResource}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addResource}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
