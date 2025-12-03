'use client'

import {
  NewResourceItem,
  ResourceItem
} from '@/components/settlement/resources/resource-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { ResourceCategory, ResourceType } from '@/lib/enums'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  RESOURCE_REMOVED_MESSAGE,
  RESOURCE_UPDATED_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { BeefIcon, ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react'
import { ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Resources Card Properties
 */
interface ResourcesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Resources Card Component
 *
 * @param props Resources Card Properties
 * @returns Resources Card Component
 */
export function ResourcesCard({
  saveSelectedSettlement,
  selectedSettlement
}: ResourcesCardProps): ReactElement {
  const isMobile = useIsMobile()

  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Filter states
  const [filterCategories, setFilterCategories] = useState<ResourceCategory[]>(
    []
  )
  const [filterTypes, setFilterTypes] = useState<ResourceType[]>([])

  // Filter resources based on selected filters
  const filteredResources = useMemo(() => {
    if (!selectedSettlement?.resources) return []

    return selectedSettlement.resources
      .filter((resource) => {
        // Categories filter
        if (
          filterCategories.length > 0 &&
          !filterCategories.includes(resource.category)
        )
          return false

        // Types filter
        if (
          filterTypes.length > 0 &&
          !filterTypes.some((filterType) =>
            resource.types?.includes(filterType)
          )
        )
          return false

        return true
      })
      .map((resource, filteredIndex) => {
        // Find the original index for this resource
        const originalIndex = selectedSettlement.resources!.indexOf(resource)
        return { resource, originalIndex, filteredIndex }
      })
  }, [selectedSettlement, filterCategories, filterTypes])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilterCategories([])
    setFilterTypes([])
  }, [])

  const handleCategoryFilterChange = useCallback(
    (category: ResourceCategory, checked: boolean) => {
      if (checked) setFilterCategories((prev) => [...prev, category])
      else setFilterCategories((prev) => prev.filter((c) => c !== category))
    },
    []
  )

  const handleTypeFilterChange = useCallback(
    (type: ResourceType, checked: boolean) => {
      if (checked) setFilterTypes((prev) => [...prev, type])
      else setFilterTypes((prev) => prev.filter((t) => t !== type))
    },
    []
  )

  // Check if any filters are active
  const hasActiveFilters = filterCategories.length > 0 || filterTypes.length > 0

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.resources || []).map((_, i) => [i, true])
      )
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addResource = () => setIsAddingNew(true)

  /**
   * Handles the amount change for a resource.
   *
   * @param index Resource Index
   * @param amount New Amount
   */
  const onAmountChange = (index: number, amount: number) => {
    const currentResources = [...(selectedSettlement?.resources || [])]
    currentResources[index] = { ...currentResources[index], amount }

    saveSelectedSettlement({ resources: currentResources })
  }

  /**
   * Handles the removal of a resource.
   *
   * @param index Resource Index
   */
  const onRemove = (index: number) => {
    const currentResources = [...(selectedSettlement?.resources || [])]
    currentResources.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSettlement(
      { resources: currentResources },
      RESOURCE_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving a new resource.
   *
   * @param name Resource Name
   * @param category Resource Category
   * @param types Resource Types
   * @param amount Resource Amount
   * @param i Resource Index (When Updating Only)
   */
  const onSave = (
    name?: string,
    category?: ResourceCategory,
    types?: ResourceType[],
    amount?: number,
    i?: number
  ) => {
    if (!name || name.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('resource'))

    const updatedResources = [...(selectedSettlement?.resources || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedResources[i] = {
        name,
        category: category!,
        types: types!,
        amount: amount!
      }
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedResources.push({
        name,
        category: category!,
        types: types!,
        amount: amount!
      })
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedResources.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { resources: updatedResources },
      RESOURCE_UPDATED_MESSAGE(i)
    )

    setIsAddingNew(false)
  }

  /**
   * Enables editing a resource.
   *
   * @param index Resource Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering resources.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.resources || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ resources: newOrder })

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

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <BeefIcon className="h-4 w-4" />
          Resource Storage
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={addResource}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>

        {/* Filters */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs h-8">
                  {filterCategories.length > 0
                    ? `${filterCategories.length} categor${filterCategories.length === 1 ? 'y' : 'ies'}`
                    : 'Filter by Category'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Resource Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(ResourceCategory).map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={filterCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryFilterChange(category, !!checked)
                    }>
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs h-8">
                  {filterTypes.length > 0
                    ? `${filterTypes.length} type(s)`
                    : 'Filter by Types'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Resource Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(ResourceType).map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={filterTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleTypeFilterChange(type, !!checked)
                    }>
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {filterCategories.map((category) => (
                <Badge key={category} variant="default" className="text-xs">
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() =>
                      setFilterCategories((prev) =>
                        prev.filter((c) => c !== category)
                      )
                    }>
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {filterTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() =>
                      setFilterTypes((prev) => prev.filter((t) => t !== type))
                    }>
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-6 px-2">
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Resources List */}
      <CardContent className={`p-1 pb-2 pt-0 ${isMobile ? 'px-2' : ''}`}>
        <div
          className={`${isMobile ? 'h-auto max-h-[400px]' : 'h-[200px]'} overflow-y-auto`}>
          <div className={`${isMobile ? 'space-y-3' : 'space-y-1'}`}>
            {filteredResources.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={filteredResources.map((item) =>
                    item.originalIndex.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {filteredResources.map((item) => (
                    <ResourceItem
                      key={`${selectedSettlement?.id}-${item.originalIndex}-${selectedSettlement?.resources?.[item.originalIndex]?.name}`}
                      id={item.originalIndex.toString()}
                      index={item.originalIndex}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[item.originalIndex]}
                      onSave={(i, name, category, types, amount) =>
                        onSave(name, category, types, amount, i)
                      }
                      onEdit={onEdit}
                      onAmountChange={onAmountChange}
                      selectedSettlement={selectedSettlement}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {selectedSettlement?.resources?.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No resources in storage. Add one to begin.
              </div>
            )}
            {selectedSettlement?.resources &&
              selectedSettlement.resources.length > 0 &&
              filteredResources.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No resources match the current filters.
                </div>
              )}
            {isAddingNew && (
              <NewResourceItem
                onSave={(name, category, types, amount) =>
                  onSave(name, category, types, amount)
                }
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
