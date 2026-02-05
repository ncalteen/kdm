'use client'

import {
  KnowledgeItem,
  NewKnowledgeItem
} from '@/components/settlement/arc/knowledge-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  KNOWLEDGE_CREATED_MESSAGE,
  KNOWLEDGE_REMOVED_MESSAGE,
  KNOWLEDGE_UPDATED_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { SettlementKnowledge } from '@/schemas/settlement-knowledge'
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
import { GraduationCapIcon, PlusIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Knowledges Card Properties
 */
interface KnowledgesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Knowledges Card Component
 */
export function KnowledgesCard({
  saveSelectedSettlement,
  selectedSettlement
}: KnowledgesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.knowledges ?? []).map((_, i) => [i, true])
    )
  )
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.knowledges ?? []).map((_, i) => [i, true])
      )
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addKnowledge = () => setIsAddingNew(true)

  /**
   * Handles the removal of a knowledge.
   *
   * @param index Knowledge Index
   */
  const onRemove = (index: number) => {
    const currentKnowledges = [...(selectedSettlement?.knowledges ?? [])]
    currentKnowledges.splice(index, 1)

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
      { knowledges: currentKnowledges },
      KNOWLEDGE_REMOVED_MESSAGE()
    )
  }

  /**
   * Handles saving a new knowledge.
   *
   * @param name Knowledge Name
   * @param philosophy Philosophy
   * @param i Knowledge Index (When Updating Only)
   */
  const onSave = (name?: string, philosophy?: string, i?: number) => {
    if (!name || name.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('knowledge'))

    // Convert empty string to undefined for optional philosophy
    const processedPhilosophy =
      philosophy && philosophy.trim() !== '' ? philosophy : undefined

    const updatedKnowledges = [...(selectedSettlement?.knowledges ?? [])]
    const knowledgeData: SettlementKnowledge = {
      name: name.trim(),
      philosophy: processedPhilosophy as SettlementKnowledge['philosophy']
    }

    if (i !== undefined) {
      // Updating an existing value
      updatedKnowledges[i] = knowledgeData
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedKnowledges.push(knowledgeData)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedKnowledges.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { knowledges: updatedKnowledges },
      i !== undefined
        ? KNOWLEDGE_UPDATED_MESSAGE()
        : KNOWLEDGE_CREATED_MESSAGE()
    )

    setIsAddingNew(false)
  }

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
        selectedSettlement?.knowledges ?? [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({
        knowledges: newOrder
      })

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
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <GraduationCapIcon className="h-4 w-4" />
          Knowledges
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addKnowledge}
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

      {/* Knowledges List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="h-[200px] overflow-y-auto space-y-1">
          {selectedSettlement?.knowledges?.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={(selectedSettlement?.knowledges ?? []).map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {(selectedSettlement?.knowledges ?? []).map(
                  (knowledge, index) => (
                    <KnowledgeItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(name, philosophy, i) =>
                        onSave(name, philosophy, i)
                      }
                      onEdit={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }
                      selectedSettlement={selectedSettlement}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewKnowledgeItem
              onSave={(name, philosophy) => onSave(name, philosophy)}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
