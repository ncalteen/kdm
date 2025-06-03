'use client'

import {
  ArrivalBonusItem,
  NewArrivalBonusItem
} from '@/components/settlement/arrival-bonuses/arrival-bonus-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
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
import { MapPinPlusIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Arrival Bonuses Card Component
 */
export function ArrivalBonusesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedArrivalBonuses = form.watch('arrivalBonuses')
  const arrivalBonuses = useMemo(
    () => watchedArrivalBonuses || [],
    [watchedArrivalBonuses]
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
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      arrivalBonuses.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [arrivalBonuses])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addBonus = () => setIsAddingNew(true)

  /**
   * Save arrival bonuses to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedArrivalBonuses Updated Arrival Bonuses
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedArrivalBonuses: string[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        try {
          SettlementSchema.shape.arrivalBonuses.parse(updatedArrivalBonuses)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].arrivalBonuses =
          updatedArrivalBonuses
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Arrival Bonus Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a arrival bonus.
   *
   * @param index Arrival Bonus Index
   */
  const onRemove = (index: number) => {
    const currentArrivalBonuses = [...arrivalBonuses]

    currentArrivalBonuses.splice(index, 1)
    form.setValue('arrivalBonuses', currentArrivalBonuses)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentArrivalBonuses, 'A blessing fades into the void.')
  }

  /**
   * Handles saving arrival bonus.
   *
   * @param value Arrival Bonus Value
   * @param i Arrival Bonus Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless blessing cannot be recorded.')

    try {
      SettlementSchema.shape.arrivalBonuses.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedArrivalBonuses = [...arrivalBonuses]

    if (i !== undefined) {
      // Updating an existing value
      updatedArrivalBonuses[i] = value
      form.setValue(`arrivalBonuses.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedArrivalBonuses.push(value)

      form.setValue('arrivalBonuses', updatedArrivalBonuses)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedArrivalBonuses.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedArrivalBonuses,
      i !== undefined
        ? 'The blessing has been inscribed.'
        : 'A new blessing graces your settlement.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a arrival bonus.
   *
   * @param index Arrival Bonus Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering arrival bonuses.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(arrivalBonuses, oldIndex, newIndex)

      form.setValue('arrivalBonuses', newOrder)
      saveToLocalStorage(newOrder)

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
    <Card className="p-0 pb-1 border-1 w-full gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
          <MapPinPlusIcon className="h-4 w-4" />
          Arriving Survivor Bonuses
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addBonus}
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

      {/* Arrival Bonuses List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div className="flex-1 overflow-y-auto">
            {arrivalBonuses.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={arrivalBonuses.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {arrivalBonuses.map((bonus, index) => (
                    <ArrivalBonusItem
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
              <NewArrivalBonusItem
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
