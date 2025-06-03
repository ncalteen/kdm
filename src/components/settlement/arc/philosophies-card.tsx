'use client'

import {
  NewPhilosophyItem,
  PhilosophyItem
} from '@/components/settlement/arc/philosophy-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Philosophy } from '@/lib/enums'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { BrainCogIcon, PlusIcon } from 'lucide-react'
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
 * Philosophies Card Component
 */
export function PhilosophiesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedPhilosophies = form.watch('philosophies')
  const philosophies = useMemo(
    () => watchedPhilosophies || [],
    [watchedPhilosophies]
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
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      philosophies.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [philosophies])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addPhilosophy = () => setIsAddingNew(true)

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedPhilosophies Updated Philosophies
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedPhilosophies: Philosophy[],
      successMsg?: string,
      immediate = false
    ) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.philosophies.parse(updatedPhilosophies)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].philosophies =
              updatedPhilosophies
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Philosophy Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) doSave()
      else saveTimeoutRef.current = setTimeout(doSave, 300)
    },
    [form]
  )

  /**
   * Handles the removal of a philosophy.
   *
   * @param index Philosophy Index
   */
  const onRemove = (index: number) => {
    const currentPhilosophies = [...philosophies]

    currentPhilosophies.splice(index, 1)
    form.setValue('philosophies', currentPhilosophies)

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
      currentPhilosophies,
      'The philosophy fade into the void.',
      true
    )
  }

  /**
   * Handles saving a new philosophy or updating an existing one.
   *
   * @param value Philosophy Value
   * @param i Philosophy Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless philosophy cannot be recorded.')

    const updatedPhilosophies = [...philosophies]

    if (i !== undefined) {
      // Updating an existing value
      updatedPhilosophies[i] = value as Philosophy
      form.setValue(`philosophies.${i}`, value as Philosophy)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedPhilosophies.push(value as Philosophy)

      form.setValue('philosophies', updatedPhilosophies)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedPhilosophies.length - 1]: true
      }))
    }

    saveToLocalStorageDebounced(
      updatedPhilosophies,
      i !== undefined
        ? 'Philosophy etched into memory.'
        : 'A new philosophy emerges.',
      true
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Philosophy Index
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
      const newOrder = arrayMove(philosophies, oldIndex, newIndex)

      form.setValue('philosophies', newOrder)
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
          <BrainCogIcon className="h-4 w-4" />
          Philosophies
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addPhilosophy}
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

      {/* Philosophies List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="h-[200px] overflow-y-auto">
          <div className="space-y-1">
            {philosophies.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={philosophies.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {philosophies.map((philosophy, index) => (
                    <PhilosophyItem
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
              <NewPhilosophyItem
                onSave={(value) => onSave(value)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
