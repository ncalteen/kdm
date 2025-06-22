'use client'

import {
  NewResourceItem,
  ResourceItem
} from '@/components/settlement/resources/resource-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCategory, ResourceType } from '@/lib/enums'
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
import { BeefIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
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
  selectedSettlement: Partial<Settlement> | null
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
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[ResourcesCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      selectedSettlement?.resources?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [selectedSettlement?.resources])

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
      'The resource is destroyed.'
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
      return toast.error('A nameless resource cannot be recorded.')

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
      i !== undefined
        ? 'The resource has been updated.'
        : 'A resource has been added to settlement storage.'
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
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
      </CardHeader>

      {/* Resources List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="h-[200px] overflow-y-auto">
          <div className="space-y-1">
            {selectedSettlement?.resources?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.resources || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.resources || []).map((_, index) => (
                    <ResourceItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
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
