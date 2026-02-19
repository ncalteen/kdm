'use client'

import {
  NewPrincipleItem,
  PrincipleItem
} from '@/components/settlement/principles/principle-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  PRINCIPLE_OPTION_SELECTED_MESSAGE,
  PRINCIPLE_REMOVED_MESSAGE,
  PRINCIPLE_UPDATED_MESSAGE
} from '@/lib/messages'
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
import { PlusIcon, StampIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Principles Card Properties
 */
interface PrinciplesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Principles Card Component
 *
 * Displays and manages an editable and draggable list of principles for the settlement.
 * Each principle has two options that can be selected, and principles can be reordered.
 *
 * @param props Principles Card Properties
 * @returns Principles Card Component
 */
export function PrinciplesCard({
  saveSelectedSettlement,
  selectedSettlement
}: PrinciplesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.principles ?? []).map((_, i) => [i, true])
    )
  )
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  if (settlementIdRef.current !== selectedSettlement?.id) {
    settlementIdRef.current = selectedSettlement?.id

    setDisabledInputs(
      Object.fromEntries(
        (selectedSettlement?.principles ?? []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Handle Principal Removal
   *
   * @param index Principle Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.principles ?? [])]
    current.splice(index, 1)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveSelectedSettlement({ principles: current }, PRINCIPLE_REMOVED_MESSAGE())
  }

  /**
   * Handle Principle Save
   *
   * @param index Principle Index
   * @param name Principle Name
   * @param option1Name Option 1 Name
   * @param option2Name Option 2 Name
   */
  const onSave = (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('principle'))

    const updated = [...(selectedSettlement?.principles ?? [])]

    if (index < updated.length) {
      // Updating an existing principle
      updated[index] = {
        ...updated[index],
        name,
        option1Name,
        option2Name
      }

      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))

      saveSelectedSettlement(
        {
          principles: updated
        },
        PRINCIPLE_UPDATED_MESSAGE(true)
      )
    }
    setIsAddingNew(false)
  }

  /**
   * Handle Option Selection
   *
   * @param index Principle Index
   * @param option Option Selected (1 or 2)
   */
  const handleOptionSelect = (index: number, option: 1 | 2) => {
    const updated = [...(selectedSettlement?.principles ?? [])]

    // Update the option selected, ensuring only one is selected at a time
    updated[index] = {
      ...updated[index],
      option1Selected: option === 1,
      option2Selected: option === 2
    }

    saveSelectedSettlement(
      {
        principles: updated
      },
      PRINCIPLE_OPTION_SELECTED_MESSAGE(
        option === 1 ? updated[index].option1Name : updated[index].option2Name
      )
    )
  }

  /**
   * Handle New Principle Save
   *
   * @param name Principle Name
   * @param option1Name Option 1 Name
   * @param option2Name Option 2 Name
   */
  const onSaveNew = (
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('principle'))

    const updated = [
      ...(selectedSettlement?.principles ?? []),
      {
        name,
        option1Name,
        option2Name,
        option1Selected: false,
        option2Selected: false
      }
    ]

    setDisabledInputs((prev) => ({
      ...prev,
      [updated.length - 1]: true
    }))

    saveSelectedSettlement(
      {
        principles: updated
      },
      PRINCIPLE_UPDATED_MESSAGE(false)
    )
    setIsAddingNew(false)
  }

  /**
   * Handle Drag End Event
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.principles ?? [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ principles: newOrder })

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
    <Card className="p-0 border-1 gap-0">
      <CardHeader className="px-2 pt-2 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <StampIcon className="h-4 w-4" />
          Principles
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddingNew(true)}
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

      {/* Principles List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.principles?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.principles ?? []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.principles ?? []).map(
                    (principle, index) => (
                      <div key={index}>
                        <PrincipleItem
                          id={index.toString()}
                          index={index}
                          principle={principle}
                          onRemove={onRemove}
                          isDisabled={!!disabledInputs[index]}
                          onSave={onSave}
                          onEdit={() =>
                            setDisabledInputs((prev) => ({
                              ...prev,
                              [index]: false
                            }))
                          }
                          handleOptionSelect={handleOptionSelect}
                        />

                        <Separator className="my-1" />
                      </div>
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewPrincipleItem
                onSave={onSaveNew}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
