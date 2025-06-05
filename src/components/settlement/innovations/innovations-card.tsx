'use client'

import {
  InnovationItem,
  NewInnovationItem
} from '@/components/settlement/innovations/innovation-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettlement } from '@/contexts/settlement-context'
import { useSettlementSave } from '@/hooks/use-settlement-save'
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
import { LightbulbIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Innovations Card Component
 */
export function InnovationsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const { saveSettlement } = useSettlementSave(form)
  const { selectedSettlement } = useSettlement()

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.innovations.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.innovations])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addInnovation = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedInnovations Updated Innovations
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedInnovations: string[],
    successMsg?: string
  ) => saveSettlement({ innovations: updatedInnovations }, successMsg)

  /**
   * Handles the removal of an innovation.
   *
   * @param index Innovation Index
   */
  const onRemove = (index: number) => {
    const currentInnovations = [...(selectedSettlement?.innovations || [])]
    currentInnovations.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(currentInnovations, 'The innovation has been lost.')
  }

  /**
   * Handles saving a new innovation.
   *
   * @param value Innovation Value
   * @param i Innovation Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless innovation cannot be recorded.')

    const updatedInnovations = [...(selectedSettlement?.innovations || [])]

    if (i !== undefined) {
      // Updating an existing value
      updatedInnovations[i] = value
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedInnovations.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedInnovations.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedInnovations,
      i !== undefined
        ? 'The innovation has been updated.'
        : 'The settlement has innovated.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Innovation Index
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
        selectedSettlement?.innovations || [],
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
          <LightbulbIcon className="h-4 w-4" />
          Innovations
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addInnovation}
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

      {/* Innovations List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.innovations.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.innovations || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.innovations || []).map(
                    (innovation, index) => (
                      <InnovationItem
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
              <NewInnovationItem
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
