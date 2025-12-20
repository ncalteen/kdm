'use client'

import {
  NewQuarryItem,
  QuarryItem
} from '@/components/settlement/quarries/quarry-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonsterNode, MonsterType } from '@/lib/enums'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  QUARRY_REMOVED_MESSAGE,
  QUARRY_UNLOCKED_MESSAGE,
  QUARRY_UPDATED_MESSAGE
} from '@/lib/messages'
import { QUARRIES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
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
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Quarries Card Properties
 */
interface QuarriesCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Quarries Card Component
 *
 * @param props Quarries Card Properties
 * @returns Quarries Card Component
 */
export function QuarriesCard({
  campaign,
  saveSelectedSettlement,
  selectedSettlement
}: QuarriesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.quarries || []).map((_, i) => [i, true])
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
        (selectedSettlement?.quarries || []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Remove a Quarry
   *
   * @param index Quarry Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.quarries || [])]
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

    saveSelectedSettlement({ quarries: current }, QUARRY_REMOVED_MESSAGE())
  }

  /**
   * Save a Quarry
   *
   * @param id Quarry ID (number for built-in, string for custom)
   * @param unlocked Quarry Unlocked Status
   * @param index Quarry Index (When Updating Only)
   */
  const onSave = (id?: number | string, unlocked?: boolean, index?: number) => {
    if (id === undefined)
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('quarry'))

    const value: Quarry = {
      id,
      unlocked: unlocked || false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }

    const updated = [...(selectedSettlement?.quarries || [])]

    if (index !== undefined) {
      // Updating an existing value
      updated[index] = {
        ...updated[index],
        id,
        unlocked: unlocked || false
      }
      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updated.push(value)
      setDisabledInputs((prev) => ({
        ...prev,
        [updated.length - 1]: true
      }))
    }

    saveSelectedSettlement({ quarries: updated }, QUARRY_UPDATED_MESSAGE(index))
    setIsAddingNew(false)
  }

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

    const quarryId = selectedSettlement?.quarries![index].id
    const quarryName = quarryId
      ? typeof quarryId === 'number'
        ? QUARRIES[quarryId as keyof typeof QUARRIES]?.main.name || ''
        : campaign.customMonsters?.[quarryId]?.main.name || ''
      : ''

    saveSelectedSettlement(
      { quarries: updatedQuarries },
      QUARRY_UNLOCKED_MESSAGE(quarryName, unlocked)
    )
  }

  /**
   * Update the Quarry ID and automatically set the node from QUARRIES data
   *
   * @param index Quarry Index
   * @param id Quarry ID (number for built-in, string for custom)
   */
  const onUpdateQuarry = (index: number, id: number | string) => {
    let node: MonsterNode = MonsterNode.NQ1

    if (typeof id === 'number') {
      const quarryData = QUARRIES[id as keyof typeof QUARRIES]
      node = quarryData?.main.node || MonsterNode.NQ1
    } else {
      const customMonster = campaign.customMonsters?.[id]
      if (customMonster?.main.type === MonsterType.QUARRY) {
        node = customMonster.main.node as MonsterNode
      }
    }

    const updatedQuarries = (selectedSettlement?.quarries || []).map((q, i) =>
      i === index ? { ...q, id, node } : q
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
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <SwordIcon className="h-4 w-4" />
          Quarries
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
                      campaign={campaign}
                      key={index}
                      id={index.toString()}
                      index={index}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(id, unlocked, i) => onSave(id, unlocked, i)}
                      onEdit={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }
                      onToggleUnlocked={onToggleUnlocked}
                      onUpdateQuarry={onUpdateQuarry}
                      selectedSettlement={selectedSettlement}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewQuarryItem
                campaign={campaign}
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
