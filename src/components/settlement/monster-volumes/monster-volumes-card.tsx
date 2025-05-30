'use client'

import {
  MonsterVolumeItem,
  NewMonsterVolumeItem
} from '@/components/settlement/monster-volumes/monster-volume-item'
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
import { BookOpenIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Monster Volumes Card Component
 */
export function MonsterVolumesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const monsterVolumes = useMemo(
    () => form.watch('monsterVolumes') || [],
    [form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      monsterVolumes.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [monsterVolumes])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMonsterVolume = () => setIsAddingNew(true)

  /**
   * Save monster volumes to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedMonsterVolumes Updated Monster Volumes
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedMonsterVolumes: string[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          monsterVolumes: updatedMonsterVolumes
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].monsterVolumes =
          updatedMonsterVolumes
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Monster Volume Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a monster volume.
   *
   * @param index Monster Volume Index
   */
  const onRemove = (index: number) => {
    const currentMonsterVolumes = [...monsterVolumes]

    currentMonsterVolumes.splice(index, 1)
    form.setValue('monsterVolumes', currentMonsterVolumes)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(
      currentMonsterVolumes,
      'The monster volume has been consigned to darkness.'
    )
  }

  /**
   * Handles saving a new monster volume.
   *
   * @param value Monster Volume Value
   * @param i Monster Volume Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless monster volume cannot be recorded.')

    try {
      SettlementSchema.shape.monsterVolumes.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedMonsterVolumes = [...monsterVolumes]

    if (i !== undefined) {
      // Updating an existing value
      updatedMonsterVolumes[i] = value
      form.setValue(`monsterVolumes.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedMonsterVolumes.push(value)

      form.setValue('monsterVolumes', updatedMonsterVolumes)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedMonsterVolumes.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedMonsterVolumes,
      i !== undefined
        ? 'Monster volume inscribed in blood.'
        : 'New monster volume inscribed in blood.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Monster Volume Index
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
      const newOrder = arrayMove(monsterVolumes, oldIndex, newIndex)

      form.setValue('monsterVolumes', newOrder)
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
    <Card className="p-0 pb-1 mt-2 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <BookOpenIcon className="h-4 w-4" />
          Monster Volumes
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMonsterVolume}
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

      {/* Monster Volumes List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          {monsterVolumes.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={monsterVolumes.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {monsterVolumes.map((volume, index) => (
                  <MonsterVolumeItem
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
            <NewMonsterVolumeItem
              onSave={onSave}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
