'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Nemeses Card Props
 */
interface NemesesCardProps {
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
 * Nemeses Card Component
 *
 * @param props Nemeses Card Properties
 * @returns Nemeses Card Component
 */
export function NemesesCard({
  form,
  saveSelectedSettlement,
  selectedSettlement
}: NemesesCardProps): ReactElement {
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[NemesesCard] Initializing Disabled Inputs')
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      selectedSettlement?.nemeses?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [selectedSettlement?.nemeses])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedNemeses Updated Nemeses
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (updatedNemeses: Nemesis[], successMsg?: string) =>
    saveSelectedSettlement({ nemeses: updatedNemeses }, successMsg)

  /**
   * Handles the removal of a nemesis.
   *
   * @param index Nemesis Index
   */
  const onRemove = (index: number) => {
    const currentNemeses = [...(selectedSettlement?.nemeses || [])]
    currentNemeses.splice(index, 1)

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
      currentNemeses,
      'The nemesis has returned to the darkness.'
    )
  }

  /**
   * Handles saving a new nemesis.
   *
   * @param value Nemesis Name
   * @param unlocked Nemesis Unlocked Status
   * @param index Nemesis Index (When Updating Only)
   */
  const onSave = (value?: string, unlocked?: boolean, index?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless nemesis cannot be recorded.')

    const nemesisWithCc: Nemesis = {
      name: value,
      unlocked: unlocked || false,
      level1: false,
      level2: false,
      level3: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    }

    const updatedNemeses = [...(selectedSettlement?.nemeses || [])]

    if (index !== undefined) {
      // Updating an existing value - preserve existing properties
      updatedNemeses[index] = {
        ...updatedNemeses[index],
        name: value,
        unlocked: unlocked || false
      }
      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updatedNemeses.push(nemesisWithCc)
      setDisabledInputs((prev) => ({
        ...prev,
        [updatedNemeses.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedNemeses,
      index !== undefined
        ? 'The nemesis waits outside your settlement.'
        : 'A new nemesis emerges.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a nemesis.
   *
   * @param index Nemesis Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

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
    saveToLocalStorage(
      updatedNemeses,
      `${selectedSettlement?.nemeses![index]?.name} ${unlocked ? 'emerges, ready to accept your challenge.' : 'retreats into the darkness, beyond your reach.'}`
    )
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
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => {
    const updatedNemeses = (selectedSettlement?.nemeses || []).map((n, i) =>
      i === index ? { ...n, [level]: checked } : n
    )
    saveToLocalStorage(updatedNemeses)
  }

  /**
   * Handles the end of a drag event for reordering nemeses.
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
          <SkullIcon className="h-4 w-4" />
          Nemesis Monsters
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addNemesis}
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
        <CardDescription className="text-left text-xs text-muted-foreground">
          The nemesis monsters your settlement can encounter.
        </CardDescription>
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
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(name, unlocked, i) => onSave(name, unlocked, i)}
                      onEdit={onEdit}
                      onToggleUnlocked={onToggleUnlocked}
                      onToggleLevel={onToggleLevel}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewNemesisItem
                onSave={(name, unlocked) => onSave(name, unlocked)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
