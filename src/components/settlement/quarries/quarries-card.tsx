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
import { getCampaign } from '@/lib/utils'
import { Quarry, Settlement, SettlementSchema } from '@/schemas/settlement'
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
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Quarries Card Component
 */
export function QuarriesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const quarries = useMemo(() => form.watch('quarries') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      quarries.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [quarries])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = () => setIsAddingNew(true)

  /**
   * Save quarries to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedQuarries Updated Quarries
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedQuarries: Quarry[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          quarries: updatedQuarries
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].quarries = updatedQuarries
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Quarry Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a quarry.
   *
   * @param index Quarry Index
   */
  const onRemove = (index: number) => {
    const currentQuarries = [...quarries]

    currentQuarries.splice(index, 1)
    form.setValue('quarries', currentQuarries)

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
      'The beast has been banished to the void.'
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
      return toast.error(
        'A nameless horror cannot be recorded in your chronicles.'
      )

    const quarryWithCc: Quarry = {
      name: value,
      node: (node || 'Node 1') as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4',
      unlocked: unlocked || false,
      ccPrologue: false,
      ccLevel1: false,
      ccLevel2: [false, false],
      ccLevel3: [false, false, false]
    }

    try {
      SettlementSchema.shape.quarries.parse([quarryWithCc])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedQuarries = [...quarries]

    if (index !== undefined) {
      // Updating an existing value - preserve existing CC properties
      updatedQuarries[index] = {
        ...updatedQuarries[index],
        name: value,
        node: (node || 'Node 1') as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4',
        unlocked: unlocked || false
      }
      form.setValue(`quarries.${index}`, updatedQuarries[index])

      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updatedQuarries.push(quarryWithCc)

      form.setValue('quarries', updatedQuarries)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedQuarries.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedQuarries,
      index !== undefined
        ? 'The monster prowls the darkness. Hunt or be hunted.'
        : 'A new terror emerges from the mist.'
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
    const updatedQuarries = quarries.map((q, i) =>
      i === index ? { ...q, unlocked } : q
    )

    form.setValue('quarries', updatedQuarries)

    saveToLocalStorage(
      updatedQuarries,
      `${quarries[index]?.name} ${unlocked ? 'emerges from the mist, ready to be hunted.' : 'retreats into the darkness, beyond your reach.'}`
    )
  }

  /**
   * Handles updating quarry node.
   *
   * @param index Quarry Index
   * @param node Node Value
   */
  const onUpdateNode = (index: number, node: string) => {
    const updatedQuarries = quarries.map((q, i) =>
      i === index
        ? { ...q, node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4' }
        : q
    )

    form.setValue('quarries', updatedQuarries)
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
      const newOrder = arrayMove(quarries, oldIndex, newIndex)

      form.setValue('quarries', newOrder)
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
    <Card>
      <CardHeader className="px-4 py-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
            <SwordIcon className="h-4 w-4" />
            Quarries
            {!isAddingNew && (
              <div className="flex justify-center">
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
              </div>
            )}
          </CardTitle>
        </div>
        <CardDescription className="text-left text-xs">
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>

      {/* Quarries List */}
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {quarries.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={quarries.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {quarries.map((quarry, index) => (
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
      </CardContent>
    </Card>
  )
}
