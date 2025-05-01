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
  ChevronsUpDown,
  GripVertical,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
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
import { FormControl, FormField, FormItem } from '../form'
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
}

function ResourceCategoryCombobox({
  selectedCategory,
  onChange
}: ResourceCategoryComboboxProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (category: ResourceCategory) => {
    onChange(category)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9">
          {selectedCategory || 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoryOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}>
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
}

function ResourceTypesCombobox({
  selectedTypes,
  onChange
}: ResourceTypesComboboxProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: ResourceType) => {
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
          className="w-full justify-between h-9">
          {selectedTypes.length > 0
            ? `${selectedTypes.length} selected`
            : 'Select types...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search types..." />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {typeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}>
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
}

// Component for a single resource item in the drag and drop list
function ResourceItem({
  index,
  form,
  handleRemoveResource,
  id
}: ResourceItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const resource = form.watch(`resources.${index}`)

  // Initialize state only once with the current resource values
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
    ResourceCategory.BASIC
  )

  // Initialize the local state with resource values once when component mounts
  // or when resource changes significantly (like when reordered)
  useEffect(() => {
    if (resource) {
      setSelectedTypes(resource.types || [])
      if (resource.category) {
        // Handle both array (old format) and string (new format)
        if (Array.isArray(resource.category)) {
          setSelectedCategory(resource.category[0] || ResourceCategory.BASIC)
        } else {
          setSelectedCategory(resource.category)
        }
      }
    }
  }, [resource]) // Only re-run if the resource name changes, which happens on reorder or new resource

  // Handle category selection changes
  const handleCategoryChange = (category: ResourceCategory) => {
    setSelectedCategory(category)
    form.setValue(`resources.${index}.category`, category)
  }

  // Handle types selection changes
  const handleTypesChange = (types: ResourceType[]) => {
    setSelectedTypes(types)
    form.setValue(`resources.${index}.types`, types)
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center mb-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 flex items-center gap-2">
        {/* Resource Name */}
        <div className="w-[30%]">
          <FormField
            control={form.control}
            name={`resources.${index}.name`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Resource Name"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      form.setValue(`resources.${index}.name`, e.target.value)
                    }}
                    className="h-9"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Resource Category - Using the Combobox */}
        <div className="w-[25%]">
          <ResourceCategoryCombobox
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Resource Types - Using the multi-select Combobox */}
        <div className="w-[30%]">
          <ResourceTypesCombobox
            selectedTypes={selectedTypes}
            onChange={handleTypesChange}
          />
        </div>

        {/* Resource Amount */}
        <div className="w-[10%] flex items-center">
          <FormField
            control={form.control}
            name={`resources.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="w-12 text-center no-spinners"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => {
                      form.setValue(
                        `resources.${index}.amount`,
                        parseInt(e.target.value)
                      )
                    }}
                    // className="h-9 w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => handleRemoveResource(index)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main ResourcesCard component
export function ResourcesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const resources = form.watch('resources') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Add a new empty resource
  const addResource = () => {
    const newResource = {
      name: '',
      category: ResourceCategory.BASIC,
      types: [ResourceType.BONE],
      amount: 0
    }
    const updatedResources = [...resources, newResource]
    form.setValue('resources', updatedResources)
  }

  // Remove a resource by index
  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources]
    updatedResources.splice(index, 1)
    form.setValue('resources', updatedResources)
  }

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(resources, oldIndex, newIndex)
      form.setValue('resources', newOrder)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-1">
          Resource Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {resources.length === 0 ? (
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
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addResource}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
