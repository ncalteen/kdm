'use client'

import {
  NewSeedPatternItem,
  SeedPatternItem
} from '@/components/settlement/patterns/seed-pattern-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { BeanIcon, PlusIcon } from 'lucide-react'
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
 * Seed Patterns Card Component
 *
 * @param form Settlement form instance
 * @returns Seed Patterns Card Component
 */
export function SeedPatternsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedSeedPatterns = form.watch('seedPatterns')
  const seedPatterns = useMemo(
    () => watchedSeedPatterns || [],
    [watchedSeedPatterns]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = saveTimeoutRef.current
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      seedPatterns.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [seedPatterns])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addSeedPattern = () => setIsAddingNew(true)

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedSeedPatterns Updated Seed Patterns
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (updatedSeedPatterns: string[], successMsg?: string, immediate = false) => {
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
              SettlementSchema.shape.seedPatterns.parse(updatedSeedPatterns)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].seedPatterns =
              updatedSeedPatterns
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Seed Pattern Save Error:', error)
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
   * Handles the removal of a seed pattern.
   *
   * @param index Seed Pattern Index
   */
  const onRemove = (index: number) => {
    const currentSeedPatterns = [...seedPatterns]

    currentSeedPatterns.splice(index, 1)
    form.setValue('seedPatterns', currentSeedPatterns)

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
      currentSeedPatterns,
      'The seed pattern has been consumed by darkness.',
      true
    )
  }

  /**
   * Handles saving a new seed pattern.
   *
   * @param value Seed Pattern Value
   * @param i Seed Pattern Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless seed pattern cannot be preserved.')

    try {
      SettlementSchema.shape.seedPatterns.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedSeedPatterns = [...seedPatterns]

    if (i !== undefined) {
      // Updating an existing value
      updatedSeedPatterns[i] = value
      form.setValue(`seedPatterns.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedSeedPatterns.push(value)

      form.setValue('seedPatterns', updatedSeedPatterns)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedSeedPatterns.length - 1]: true
      }))
    }

    saveToLocalStorageDebounced(
      updatedSeedPatterns,
      i !== undefined
        ? 'The seed pattern is carved into memory.'
        : "A new seed pattern awakens in the survivors' minds.",
      true
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Seed Pattern Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(seedPatterns, oldIndex, newIndex)

      form.setValue('seedPatterns', newOrder)
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
          <BeanIcon className="h-4 w-4" />
          Seed Patterns
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addSeedPattern}
              className="border-0 h-8 w-8"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Seed Patterns List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {seedPatterns.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={seedPatterns.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {seedPatterns.map((seedPattern, index) => (
                    <SeedPatternItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(value, i) => onSave(value, i)}
                      onEdit={onEdit}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewSeedPatternItem
                onSave={onSave}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
