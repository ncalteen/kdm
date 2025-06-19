'use client'

import {
  NewQuarryItem,
  QuarryItem
} from '@/components/settlement/quarries/quarry-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { NodeLevel } from '@/lib/enums'
import { Quarry, Settlement } from '@/schemas/settlement'
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
import { PlusIcon, SwordIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Quarries Card Properties
 */
interface QuarriesCardProps {
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
 * Quarries Card Component
 *
 * @param props Quarries Card Properties
 * @returns Quarries Card Component
 */
export function QuarriesCard({
  form,
  saveSelectedSettlement,
  selectedSettlement
}: QuarriesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[QuarriesCard]: Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.quarries?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.quarries])

  /**
   * Add Quarry
   */
  const addQuarry = () => setIsAddingNew(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Remove a Quarry
   *
   * @param index Quarry Index
   */
  const onRemove = (index: number) => {
    const currentQuarries = [...(selectedSettlement?.quarries || [])]
    currentQuarries.splice(index, 1)

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
      { quarries: currentQuarries },
      'The beast retreats back into the void.'
    )
  }

  /**
   * Save a Quarry
   *
   * @param value Quarry Name
   * @param node Quarry Node
   * @param unlocked Quarry Unlocked Status
   * @param index Quarry Index (When Updating Only)
   */
  const onSave = (
    value?: string,
    node?: NodeLevel,
    unlocked?: boolean,
    index?: number
  ) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless quarry cannot be recorded.')

    const quarryWithCc: Quarry = {
      name: value,
      node: node || NodeLevel.NODE_1,
      unlocked: unlocked || false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }

    const updatedQuarries = [...(selectedSettlement?.quarries || [])]

    if (index !== undefined) {
      // Updating an existing value - preserve existing CC properties
      updatedQuarries[index] = {
        ...updatedQuarries[index],
        name: value,
        node: node || NodeLevel.NODE_1,
        unlocked: unlocked || false
      }
      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updatedQuarries.push(quarryWithCc)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedQuarries.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { quarries: updatedQuarries },
      index !== undefined
        ? 'The quarry prowls the darkness. Hunt or be hunted.'
        : 'A new quarry emerges.'
    )
    setIsAddingNew(false)
  }

  /**
   * Edit a Quarry
   *
   * @param index Quarry Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Toggle Unlocked Status of a Quarry
   *
   * @param index Quarry Index
   * @param unlocked Unlocked Status
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const updatedQuarries = (selectedSettlement?.quarries || []).map((q, i) =>
      i === index ? { ...q, unlocked } : q
    )

    saveSelectedSettlement(
      { quarries: updatedQuarries },
      `${selectedSettlement?.quarries![index].name} ${unlocked ? 'emerges, ready to be hunted.' : 'retreats into the darkness, beyond your reach.'}`
    )
  }

  /**
   * Update the Node of a Quarry
   *
   * @param index Quarry Index
   * @param node Node Value
   */
  const onUpdateNode = (index: number, node: NodeLevel) => {
    const updatedQuarries = (selectedSettlement?.quarries || []).map((q, i) =>
      i === index ? { ...q, node } : q
    )

    saveSelectedSettlement({ quarries: updatedQuarries })
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
        selectedSettlement?.quarries || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ quarries: newOrder })

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
    <Card className="p-0 border-1">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
          <SwordIcon className="h-4 w-4" />
          Quarries
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addQuarry}
              className="border-0 h-8 w-8"
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-left text-xs text-muted-foreground">
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>

      {/* Quarries List */}
      <CardContent className="p-1 pb-2">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.quarries?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.quarries || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.quarries || []).map((quarry, index) => (
                    <QuarryItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(name, node, unlocked, i) =>
                        onSave(name, node, unlocked, i)
                      }
                      onEdit={onEdit}
                      onToggleUnlocked={onToggleUnlocked}
                      onUpdateNode={onUpdateNode}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewQuarryItem
                onSave={(name, node, unlocked) => onSave(name, node, unlocked)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
