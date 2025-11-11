'use client'

import {
  NewPrincipleItem,
  PrincipleItem
} from '@/components/settlement/principles/principle-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NAMELESS_PRINCIPLE_ERROR,
  PRINCIPLE_OPTION_SELECTED_MESSAGE,
  REMOVE_PRINCIPLE_MESSAGE,
  UPDATE_PRINCIPLE_MESSAGE
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
import { ReactElement, useEffect, useState } from 'react'
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
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Principles Card Component
 *
 * Displays and manages an editable and draggable list of principles for the settlement.
 * Each principle has two options that can be selected, and principles can be reordered.
 *
 * @param form Settlement form instance
 * @returns Principles Card Component
 */
export function PrinciplesCard({
  saveSelectedSettlement,
  selectedSettlement
}: PrinciplesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[PrinciplesCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.principles?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.principles])

  /**
   * Add Principle
   */
  const addPrinciple = () => setIsAddingNew(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the removal of a principle.
   *
   * @param index Principle Index
   */
  const onRemove = (index: number) => {
    const currentPrinciples = [...(selectedSettlement?.principles || [])]
    currentPrinciples.splice(index, 1)

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
      {
        principles: currentPrinciples
      },
      REMOVE_PRINCIPLE_MESSAGE()
    )
  }

  /**
   * Handles saving a principle.
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
      return toast.error(NAMELESS_PRINCIPLE_ERROR())

    const updatedPrinciples = [...(selectedSettlement?.principles || [])]

    if (index < updatedPrinciples.length) {
      // Updating an existing principle
      updatedPrinciples[index] = {
        ...updatedPrinciples[index],
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
          principles: updatedPrinciples
        },
        UPDATE_PRINCIPLE_MESSAGE(true)
      )
    }
    setIsAddingNew(false)
  }

  /**
   * Enables editing a principle.
   *
   * @param index Principle Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles selecting an option for a principle. Only one option can be selected at a time.
   *
   * @param index Principle Index
   * @param option Which option (1 or 2)
   */
  const handleOptionSelect = (index: number, option: 1 | 2) => {
    const updatedPrinciples = [...(selectedSettlement?.principles || [])]

    // Update the option selected, ensuring only one is selected at a time
    updatedPrinciples[index] = {
      ...updatedPrinciples[index],
      option1Selected: option === 1,
      option2Selected: option === 2
    }

    saveSelectedSettlement(
      {
        principles: updatedPrinciples
      },
      PRINCIPLE_OPTION_SELECTED_MESSAGE(
        option === 1
          ? updatedPrinciples[index].option1Name
          : updatedPrinciples[index].option2Name
      )
    )
  }

  /**
   * Handles saving a new principle.
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
      return toast.error(NAMELESS_PRINCIPLE_ERROR())

    const updatedPrinciples = [
      ...(selectedSettlement?.principles || []),
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
      [updatedPrinciples.length - 1]: true
    }))

    saveSelectedSettlement(
      {
        principles: updatedPrinciples
      },
      UPDATE_PRINCIPLE_MESSAGE(false)
    )

    setIsAddingNew(false)
  }

  /**
   * Handles the end of a drag event for reordering principles.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(
        selectedSettlement?.principles || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({
        principles: newOrder
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
          <StampIcon className="h-4 w-4" />
          Principles
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={addPrinciple}
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

      {/* Principles List */}
      <CardContent className="p-1 pb-2">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.principles?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.principles || []).map(
                    (_, index) => index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.principles || []).map(
                    (principle, index) => (
                      <PrincipleItem
                        key={index}
                        id={index.toString()}
                        index={index}
                        principle={principle}
                        onRemove={onRemove}
                        isDisabled={!!disabledInputs[index]}
                        onSave={onSave}
                        onEdit={onEdit}
                        handleOptionSelect={handleOptionSelect}
                      />
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
