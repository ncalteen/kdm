'use client'

import {
  NewResourceItem,
  ResourceItem
} from '@/components/settlement/resources/resource-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCategory, ResourceType } from '@/lib/enums'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
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
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Resources Card Component
 */
export function ResourcesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedResources = form.watch('resources')
  const resources = useMemo(() => watchedResources || [], [watchedResources])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [])

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

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedResources Updated Resources
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedResources: {
        name: string
        category: ResourceCategory
        types: ResourceType[]
        amount: number
      }[],
      successMsg?: string,
      immediate = false
    ) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.resources.parse(updatedResources)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].resources = updatedResources
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Resource Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        doSave()
      } else {
        saveTimeoutRef.current = setTimeout(doSave, 300)
      }
    },
    [form]
  )

  /**
   * Handles the amount change for a resource.
   *
   * @param index Resource Index
   * @param amount New Amount
   */
  const onAmountChange = (index: number, amount: number) => {
    const currentResources = [...resources]
    currentResources[index] = { ...currentResources[index], amount }
    form.setValue(`resources.${index}.amount`, amount)

    saveToLocalStorageDebounced(
      currentResources,
      undefined, // No success message for amount changes
      false // Use debouncing for amount changes
    )
  }

  /**
   * Handles the removal of a resource.
   *
   * @param index Resource Index
   */
  const onRemove = (index: number) => {
    const currentResources = [...resources]

    currentResources.splice(index, 1)
    form.setValue('resources', currentResources)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorageDebounced(
      currentResources,
      'The resource is destroyed.',
      true
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

    try {
      SettlementSchema.shape.resources.parse([
        { name, category, types, amount }
      ])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedResources = [...resources]

    if (i !== undefined) {
      // Updating an existing value
      updatedResources[i] = {
        name,
        category: category!,
        types: types!,
        amount: amount!
      }
      form.setValue(`resources.${i}`, updatedResources[i])

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      const newResource = {
        name,
        category: category!,
        types: types!,
        amount: amount!
      }
      updatedResources.push(newResource)

      form.setValue('resources', updatedResources)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedResources.length - 1]: true
      }))
    }

    saveToLocalStorageDebounced(
      updatedResources,
      i !== undefined
        ? 'The resource has been updated.'
        : 'A resource has been added to settlement storage.',
      true
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
      const newOrder = arrayMove(resources, oldIndex, newIndex)

      form.setValue('resources', newOrder)
      saveToLocalStorageDebounced(newOrder)

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
            {resources.length !== 0 && (
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
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(i, name, category, types, amount) =>
                        onSave(name, category, types, amount, i)
                      }
                      onEdit={onEdit}
                      onAmountChange={onAmountChange}
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
