'use client'

import {
  MonsterVolumeItem,
  NewMonsterVolumeItem
} from '@/components/settlement/monster-volumes/monster-volume-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settlement } from '@/schemas/settlement'
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
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Monster Volumes Card Props
 */
interface MonsterVolumesCardProps extends Partial<Settlement> {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Save settlement function */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Monster Volumes Card Component
 */
export function MonsterVolumesCard({
  form,
  saveSettlement,
  ...settlement
}: MonsterVolumesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      settlement.monsterVolumes?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [settlement.monsterVolumes])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMonsterVolume = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedMonsterVolumes Updated Monster Volumes
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedMonsterVolumes: string[],
    successMsg?: string
  ) =>
    saveSettlement(
      {
        monsterVolumes: updatedMonsterVolumes
      },
      successMsg
    )

  /**
   * Handles the removal of a monster volume.
   *
   * @param index Monster Volume Index
   */
  const onRemove = (index: number) => {
    const currentMonsterVolumes = [...(settlement.monsterVolumes || [])]
    currentMonsterVolumes.splice(index, 1)

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

    const updatedMonsterVolumes = [...(settlement.monsterVolumes || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedMonsterVolumes[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedMonsterVolumes.push(value)
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
      const newOrder = arrayMove(
        settlement.monsterVolumes || [],
        oldIndex,
        newIndex
      )

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
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {settlement.monsterVolumes?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(settlement.monsterVolumes || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(settlement.monsterVolumes || []).map((volume, index) => (
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
        </div>
      </CardContent>
    </Card>
  )
}
