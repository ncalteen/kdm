'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NEMESIS_ADDED_MESSAGE,
  NEMESIS_REMOVED_MESSAGE,
  NEMESIS_UNLOCKED_MESSAGE,
  NEMESIS_UPDATED_MESSAGE
} from '@/lib/messages'
import {
  createSettlementNemesisFromData,
  getNemesisDataByName
} from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
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
import { PlusIcon, SkullIcon } from 'lucide-react'
import { ReactElement, useRef, useState } from 'react'

/**
 * Nemeses Card Properties
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
      (selectedSettlement?.nemeses ?? []).map((_, i) => [i, true])
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
        (selectedSettlement?.nemeses ?? []).map((_, i) => [i, true])
      )
    )
  }

  /**
   * Remove a Nemesis
   *
   * @param index Nemesis Index
   */
  const onRemove = (index: number) => {
    const current = [...(selectedSettlement?.nemeses ?? [])]
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
   * Save a Nemesis
   *
   * @param name Nemesis Name
   * @param index Nemesis Index (Updates Only)
   */
  const onSave = (name: string | undefined, index?: number) => {
    const data = getNemesisDataByName(campaign, name)

    if (name === undefined || name.trim() === '' || !data)
      return setIsAddingNew(false)

    const updatedNemeses = [...(selectedSettlement?.nemeses ?? [])]

    if (index !== undefined) {
      // Updating an existing value
      updatedNemeses[index] = createSettlementNemesisFromData(
        selectedSettlement,
        data
      )
      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updatedNemeses.push(
        createSettlementNemesisFromData(selectedSettlement, data)
      )
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedNemeses.length - 1]: true
      }))
    }

    saveSelectedSettlement(
      { nemeses: updatedNemeses },
      index !== undefined ? NEMESIS_UPDATED_MESSAGE() : NEMESIS_ADDED_MESSAGE()
    )
    setIsAddingNew(false)
  }

  /**
   * Toggle Unlocked Status of a Nemesis
   *
   * @param index Nemesis Index
   * @param unlocked Unlocked Status
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const updatedNemeses = (selectedSettlement?.nemeses ?? []).map((n, i) =>
      i === index ? { ...n, unlocked } : n
    )

    saveSelectedSettlement(
      { nemeses: updatedNemeses },
      NEMESIS_UNLOCKED_MESSAGE(updatedNemeses[index].name, unlocked)
    )
  }

  /**
   * Toggle Nemesis Levels
   *
   * @param index Nemesis Index
   * @param level Level to Toggle
   * @param checked Checked State
   */
  const onToggleLevel = (
    index: number,
    level:
      | 'level1Defeated'
      | 'level2Defeated'
      | 'level3Defeated'
      | 'level4Defeated'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) =>
    saveSelectedSettlement({
      nemeses: (selectedSettlement?.nemeses ?? []).map((n, i) =>
        i === index ? { ...n, [level]: checked } : n
      )
    })

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
        selectedSettlement?.nemeses ?? [],
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
                  items={(selectedSettlement?.nemeses ?? []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(selectedSettlement?.nemeses ?? []).map((nemesis, index) => (
                    <NemesisItem
                      campaign={campaign}
                      index={index}
                      isDisabled={!!disabledInputs[index]}
                      key={index}
                      nemesis={nemesis}
                      onEdit={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }
                      onRemove={onRemove}
                      onSave={onSave}
                      onToggleLevel={onToggleLevel}
                      onToggleUnlocked={onToggleUnlocked}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewNemesisItem
                campaign={campaign}
                onCancel={() => setIsAddingNew(false)}
                onSave={onSave}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
