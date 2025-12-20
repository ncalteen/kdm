'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonsterNode, MonsterType } from '@/lib/enums'
import {
  NAMELESS_OBJECT_ERROR_MESSAGE,
  NEMESIS_REMOVED_MESSAGE,
  NEMESIS_UNLOCKED_MESSAGE,
  NEMESIS_UPDATED_MESSAGE
} from '@/lib/messages'
import { NEMESES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { Nemesis, Settlement } from '@/schemas/settlement'
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
import { PlusIcon, SkullIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Nemeses Card Props
 */
interface NemesesCardProps {
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
 * Nemeses Card Component
 *
 * @param props Nemeses Card Properties
 * @returns Nemeses Card Component
 */
export function NemesesCard({
  campaign,
  saveSelectedSettlement,
  selectedSettlement
}: NemesesCardProps): ReactElement {
  const settlementIdRef = useRef<number | undefined>(undefined)

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(
    Object.fromEntries(
      (selectedSettlement?.nemeses || []).map((_, i) => [i, true])
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
        (selectedSettlement?.nemeses || []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Remove a Nemesis
   *
   * @param index Nemesis Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.nemeses || [])]
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

    saveSelectedSettlement({ nemeses: current }, NEMESIS_REMOVED_MESSAGE())
  }

  /**
   * Save a Quarry
   *
   * @param id Nemesis ID (number for built-in, string for custom)
   * @param unlocked Nemesis Unlocked Status
   * @param index Nemesis Index (When Updating Only)
   */
  const onSave = (id?: number | string, unlocked?: boolean, index?: number) => {
    if (id === undefined)
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('nemesis'))

    const value: Nemesis = {
      id,
      unlocked: unlocked || false,
      level1: false,
      level2: false,
      level3: false,
      level4: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    }

    const updated = [...(selectedSettlement?.nemeses || [])]

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

    saveSelectedSettlement({ nemeses: updated }, NEMESIS_UPDATED_MESSAGE(index))
    setIsAddingNew(false)
  }

  /**
   * Handles toggling nemesis unlocked status.
   *
   * @param index Nemesis Index
   * @param unlocked Unlocked Status
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const updatedNemeses = (selectedSettlement?.nemeses || []).map((n, i) =>
      i === index ? { ...n, unlocked } : n
    )

    const nemesisId = selectedSettlement?.nemeses![index].id
    const nemesisName = nemesisId
      ? typeof nemesisId === 'number'
        ? NEMESES[nemesisId as keyof typeof NEMESES]?.main.name || ''
        : campaign.customMonsters?.[nemesisId]?.main.name || ''
      : ''

    saveSelectedSettlement(
      { nemeses: updatedNemeses },
      NEMESIS_UNLOCKED_MESSAGE(nemesisName, unlocked)
    )
  }

  /**
   * Update the Nemesis ID and automatically set the node from NEMESES data
   *
   * @param index Nemesis Index
   * @param id Nemesis ID (number for built-in, string for custom)
   */
  const onUpdateNemesis = (index: number, id: number | string) => {
    let node: MonsterNode = MonsterNode.NQ1

    if (typeof id === 'number') {
      const nemesisData = NEMESES[id as keyof typeof NEMESES]
      node = nemesisData?.main.node || MonsterNode.NN1
    } else {
      const customMonster = campaign.customMonsters?.[id]
      if (customMonster?.main.type === MonsterType.NEMESIS) {
        node = customMonster.main.node as MonsterNode
      }
    }

    const updatedNemeses = (selectedSettlement?.nemeses || []).map((n, i) =>
      i === index ? { ...n, id, node } : n
    )

    saveSelectedSettlement({ nemeses: updatedNemeses })
  }

  /**
   * Handles toggling nemesis levels.
   *
   * @param index Nemesis Index
   * @param level Level to Toggle
   * @param checked Checked State
   */
  const onToggleLevel = (
    index: number,
    level:
      | 'level1'
      | 'level2'
      | 'level3'
      | 'level4'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => {
    const updatedNemeses = (selectedSettlement?.nemeses || []).map((n, i) =>
      i === index ? { ...n, [level]: checked } : n
    )

    saveSelectedSettlement({ nemeses: updatedNemeses })
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
        selectedSettlement?.nemeses || [],
        oldIndex,
        newIndex
      )

      saveSelectedSettlement({ nemeses: newOrder })

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
          <SkullIcon className="h-4 w-4" />
          Nemesis Monsters
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

      {/* Nemeses List */}
      <CardContent className="p-1 pb-2">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {selectedSettlement?.nemeses?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(selectedSettlement?.nemeses || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.nemeses || []).map((nemesis, index) => (
                    <NemesisItem
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
                      onToggleLevel={onToggleLevel}
                      onUpdateNemesis={onUpdateNemesis}
                      selectedSettlement={selectedSettlement}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewNemesisItem
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
