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
 * Quarries Card Props
 */
interface QuarriesCardProps extends Partial<Settlement> {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Save settlement function */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Quarries Card Component
 */
export function QuarriesCard({
  form,
  saveSettlement,
  ...settlement
}: QuarriesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      settlement.quarries?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [settlement.quarries])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedQuarries Updated Quarries
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (updatedQuarries: Quarry[], successMsg?: string) =>
    saveSettlement({ quarries: updatedQuarries }, successMsg)

  /**
   * Handles the removal of a quarry.
   *
   * @param index Quarry Index
   */
  const onRemove = (index: number) => {
    const currentQuarries = [...(settlement.quarries || [])]
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

    saveToLocalStorage(
      currentQuarries,
      'The beast retreats back into the void.'
    )
  }

  /**
   * Handles saving a new quarry.
   *
   * @param value Quarry Name
   * @param node Quarry Node
   * @param unlocked Quarry Unlocked Status
   * @param index Quarry Index (When Updating Only)
   */
  const onSave = (
    value?: string,
    node?: string,
    unlocked?: boolean,
    index?: number
  ) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless quarry cannot be recorded.')

    const quarryWithCc: Quarry = {
      name: value,
      node: (node || 'Node 1') as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4',
      unlocked: unlocked || false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }

    const updatedQuarries = [...(settlement.quarries || [])]

    if (index !== undefined) {
      // Updating an existing value - preserve existing CC properties
      updatedQuarries[index] = {
        ...updatedQuarries[index],
        name: value,
        node: (node || 'Node 1') as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4',
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

    saveToLocalStorage(
      updatedQuarries,
      index !== undefined
        ? 'The quarry prowls the darkness. Hunt or be hunted.'
        : 'A new quarry emerges.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a quarry.
   *
   * @param index Quarry Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles toggling quarry unlocked status.
   *
   * @param index Quarry Index
   * @param unlocked Unlocked Status
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const updatedQuarries = (settlement.quarries || []).map((q, i) =>
      i === index ? { ...q, unlocked } : q
    )
    saveToLocalStorage(
      updatedQuarries,
      `${settlement.quarries![index].name} ${unlocked ? 'emerges, ready to be hunted.' : 'retreats into the darkness, beyond your reach.'}`
    )
  }

  /**
   * Handles updating quarry node.
   *
   * @param index Quarry Index
   * @param node Node Value
   */
  const onUpdateNode = (index: number, node: string) => {
    const updatedQuarries = (settlement.quarries || []).map((q, i) =>
      i === index
        ? { ...q, node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4' }
        : q
    )
    saveToLocalStorage(updatedQuarries)
  }

  /**
   * Handles the end of a drag event for reordering quarries.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(settlement.quarries || [], oldIndex, newIndex)

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
            {settlement.quarries?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(settlement.quarries || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(settlement.quarries || []).map((quarry, index) => (
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
