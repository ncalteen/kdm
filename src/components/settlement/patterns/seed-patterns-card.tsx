'use client'

import {
  NewSeedPatternItem,
  SeedPatternItem
} from '@/components/settlement/patterns/seed-pattern-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { BeanIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Seed Patterns Card Properties
 */
interface SeedPatternsCardProps {
  /** Settlement Form */
  form: UseFormReturn<Settlement>
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Seed Patterns Card Component
 *
 * @param props Seed Patterns Card Properties
 * @returns Seed Patterns Card Component
 */
export function SeedPatternsCard({
  form,
  saveSelectedSettlement,
  selectedSettlement
}: SeedPatternsCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[SeedPatternsCard] Initializing Disabled Inputs')
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.seedPatterns?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.seedPatterns])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addSeedPattern = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedSeedPatterns Updated Seed Patterns
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedSeedPatterns: string[],
    successMsg?: string
  ) => saveSelectedSettlement({ seedPatterns: updatedSeedPatterns }, successMsg)

  /**
   * Handles the removal of a seed pattern.
   *
   * @param index Seed Pattern Index
   */
  const onRemove = (index: number) => {
    const currentSeedPatterns = [...(selectedSettlement?.seedPatterns || [])]
    currentSeedPatterns.splice(index, 1)

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
      currentSeedPatterns,
      'The seed pattern has been consumed by darkness.'
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

    const updatedSeedPatterns = [...(selectedSettlement?.seedPatterns || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedSeedPatterns[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedSeedPatterns.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedSeedPatterns.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedSeedPatterns,
      i !== undefined
        ? 'The seed pattern is carved into memory.'
        : "A new seed pattern awakens in the survivors' minds."
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
      const newOrder = arrayMove(
        selectedSettlement?.seedPatterns || [],
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
            {selectedSettlement?.seedPatterns?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.seedPatterns || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.seedPatterns || []).map(
                    (seedPattern, index) => (
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
                    )
                  )}
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
