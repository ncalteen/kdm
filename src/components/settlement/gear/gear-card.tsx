'use client'

import { GearItem, NewGearItem } from '@/components/settlement/gear/gear-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PlusIcon, WrenchIcon } from 'lucide-react'
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
 * Gear Card Component
 */
export function GearCard({ ...form }: UseFormReturn<Settlement>): ReactElement {
  const watchedGear = form.watch('gear')
  const gear = useMemo(() => watchedGear || [], [watchedGear])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

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

      gear.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [gear])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addGear = () => setIsAddingNew(true)

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedGear Updated Gear
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (updatedGear: string[], successMsg?: string, immediate = false) => {
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
              SettlementSchema.shape.gear.parse(updatedGear)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].gear = updatedGear
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Gear Save Error:', error)
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
   * Handles the removal of gear.
   *
   * @param index Gear Index
   */
  const onRemove = (index: number) => {
    const currentGear = [...gear]

    currentGear.splice(index, 1)
    form.setValue('gear', currentGear)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorageDebounced(currentGear, 'Gear has been archived.', true)
  }

  /**
   * Handles saving gear.
   *
   * @param value Gear Value
   * @param i Gear Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('Nameless gear cannot be stored.')

    try {
      SettlementSchema.shape.gear.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedGear = [...gear]

    if (i !== undefined) {
      // Updating an existing value
      updatedGear[i] = value
      form.setValue(`gear.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedGear.push(value)

      form.setValue('gear', updatedGear)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedGear.length - 1]: true
      }))
    }

    saveToLocalStorageDebounced(
      updatedGear,
      i !== undefined
        ? 'Gear has been modified.'
        : 'New gear added to settlement storage.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing gear.
   *
   * @param index Gear Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering gear.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(gear, oldIndex, newIndex)

      form.setValue('gear', newOrder)
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
    <Card className="p-0 pb-1 mt-2 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <WrenchIcon className="h-4 w-4" />
          Gear Storage
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addGear}
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

      {/* Gear List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          {gear.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={gear.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {gear.map((gearItem, index) => (
                  <GearItem
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
            <NewGearItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
