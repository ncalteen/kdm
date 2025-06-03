'use client'

import {
  KnowledgeItem,
  NewKnowledgeItem
} from '@/components/settlement/arc/knowledge-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Knowledge, Settlement, SettlementSchema } from '@/schemas/settlement'
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
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Knowledges Card Component
 */
export function KnowledgesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedKnowledges = form.watch('knowledges')
  const watchedPhilosophies = form.watch('philosophies')

  const knowledges = useMemo(() => watchedKnowledges || [], [watchedKnowledges])
  const philosophies = useMemo(
    () => watchedPhilosophies || [],
    [watchedPhilosophies]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      knowledges.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [knowledges])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addKnowledge = () => setIsAddingNew(true)

  /**
   * Save to Local Storage
   *
   * @param updatedKnowledges Updated Knowledges
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedKnowledges: Knowledge[],
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        try {
          SettlementSchema.shape.knowledges.parse(updatedKnowledges)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        // Use the saveCampaignToLocalStorage helper
        saveCampaignToLocalStorage({
          ...campaign,
          settlements: campaign.settlements.map((s) =>
            s.id === formValues.id
              ? {
                  ...s,
                  knowledges: updatedKnowledges
                }
              : s
          )
        })

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Knowledge Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of a knowledge.
   *
   * @param index Knowledge Index
   */
  const onRemove = (index: number) => {
    const currentKnowledges = [...knowledges]

    currentKnowledges.splice(index, 1)
    form.setValue('knowledges', currentKnowledges)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    // Use immediate save with feedback for user actions
    saveToLocalStorage(currentKnowledges, 'Knowledge banished to the void.')
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
      return toast.error('A nameless knowledge cannot be recorded.')

    // Convert empty string to undefined for optional philosophy
    const processedPhilosophy =
      philosophy && philosophy.trim() !== '' ? philosophy : undefined

    try {
      SettlementSchema.shape.knowledges.parse([
        { name: name.trim(), philosophy: processedPhilosophy }
      ])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedKnowledges = [...knowledges]
    const knowledgeData: Knowledge = {
      name: name.trim(),
      philosophy: processedPhilosophy as Knowledge['philosophy']
    }

    if (i !== undefined) {
      // Updating an existing value
      updatedKnowledges[i] = knowledgeData
      form.setValue(`knowledges.${i}`, knowledgeData)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedKnowledges.push(knowledgeData)

      form.setValue('knowledges', updatedKnowledges)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedKnowledges.length - 1]: true
      }))
    }

    // Use immediate save with feedback for user actions
    saveToLocalStorage(
      updatedKnowledges,
      i !== undefined
        ? 'Knowledge carved into memory.'
        : 'New knowledge illuminates the settlement.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Knowledge Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

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
      const newOrder = arrayMove(knowledges, oldIndex, newIndex)

      form.setValue('knowledges', newOrder)
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
    <Card className="p-0 pb-1 mt-1 border-1">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
          {knowledges.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={knowledges.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {knowledges.map((knowledge, index) => (
                  <KnowledgeItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    onRemove={onRemove}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(name, philosophy, i) =>
                      onSave(name, philosophy, i)
                    }
                    onEdit={onEdit}
                    philosophies={philosophies}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewKnowledgeItem
              onSave={(name, philosophy) => onSave(name, philosophy)}
              onCancel={() => setIsAddingNew(false)}
              philosophies={philosophies}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
