'use client'

import {
  NewPrincipleItem,
  PrincipleItem
} from '@/components/settlement/principles/principle-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
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
import { PlusIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const principles = useMemo(() => form.watch('principles') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      principles.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [principles])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addPrinciple = () => setIsAddingNew(true)

  /**
   * Save principles to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedPrinciples Updated Principles
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (updatedPrinciples: Settlement['principles'], successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (settlementIndex !== -1) {
          const updatedSettlement = {
            ...campaign.settlements[settlementIndex],
            principles: updatedPrinciples
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

          campaign.settlements[settlementIndex].principles = updatedPrinciples
          localStorage.setItem('campaign', JSON.stringify(campaign))

          if (successMsg) toast.success(successMsg)
        }
      } catch (error) {
        console.error('Principle Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Handles the removal of a principle.
   *
   * @param index Principle Index
   */
  const onRemove = (index: number) => {
    const currentPrinciples = [...principles]

    currentPrinciples.splice(index, 1)
    form.setValue('principles', currentPrinciples)

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
      currentPrinciples,
      'The settlement has cleansed a belief from its memory.'
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
      return toast.error('A nameless conviction cannot guide your settlement.')

    const updatedPrinciples = [...principles]

    if (index < updatedPrinciples.length) {
      // Updating an existing principle
      updatedPrinciples[index] = {
        ...updatedPrinciples[index],
        name,
        option1Name,
        option2Name
      }
      form.setValue('principles', updatedPrinciples)

      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))

      saveToLocalStorage(
        updatedPrinciples,
        "The settlement's conviction has been etched in stone."
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
  const handleOptionSelect = useCallback(
    (index: number, option: 1 | 2) => {
      const updatedPrinciples = [...principles]

      // Update the option selected, ensuring only one is selected at a time
      updatedPrinciples[index] = {
        ...updatedPrinciples[index],
        option1Selected: option === 1,
        option2Selected: option === 2
      }

      form.setValue('principles', updatedPrinciples)
      saveToLocalStorage(
        updatedPrinciples,
        `The settlement has chosen ${
          option === 1
            ? updatedPrinciples[index].option1Name
            : updatedPrinciples[index].option2Name
        }.`
      )
    },
    [principles, form, saveToLocalStorage]
  )

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
      return toast.error('A nameless principle cannot guide your settlement.')

    const updatedPrinciples = [
      ...principles,
      {
        name,
        option1Name,
        option2Name,
        option1Selected: false,
        option2Selected: false
      }
    ]

    form.setValue('principles', updatedPrinciples)

    setDisabledInputs((prev) => ({
      ...prev,
      [updatedPrinciples.length - 1]: true
    }))

    saveToLocalStorage(
      updatedPrinciples,
      'A new guiding principle emerges from the darkness.'
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
      const newOrder = arrayMove(principles, oldIndex, newIndex)

      form.setValue('principles', newOrder)
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
    <Card className="mt-1">
      <CardHeader className="px-4 py-4 pb-2">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
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
        </div>
      </CardHeader>

      {/* Principles List */}
      <CardContent className="p-0">
        <div>
          {principles.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={principles.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {principles.map((principle, index) => (
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
                ))}
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
      </CardContent>
    </Card>
  )
}
