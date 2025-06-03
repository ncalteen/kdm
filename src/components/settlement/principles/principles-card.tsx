'use client'

import {
  NewPrincipleItem,
  PrincipleItem
} from '@/components/settlement/principles/principle-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
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
import { PlusIcon, StampIcon } from 'lucide-react'
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
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
  const watchedPrinciples = form.watch('principles')
  const principles = useMemo(() => watchedPrinciples || [], [watchedPrinciples])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [])

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
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedPrinciples Updated Principles
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedPrinciples: Settlement['principles'],
      successMsg?: string,
      immediate = false
    ) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.principles.parse(updatedPrinciples)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].principles = updatedPrinciples
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Principle Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        doSave()
      } else {
        saveTimeoutRef.current = setTimeout(doSave, 300)
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

    saveToLocalStorageDebounced(
      currentPrinciples,
      'The settlement has cleansed a principle from its memory.',
      true
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
      return toast.error('A nameless principle cannot be recorded.')

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

      saveToLocalStorageDebounced(
        updatedPrinciples,
        "The settlement's principle has been etched in stone.",
        true
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
      saveToLocalStorageDebounced(
        updatedPrinciples,
        `The settlement has chosen ${
          option === 1
            ? updatedPrinciples[index].option1Name
            : updatedPrinciples[index].option2Name
        }.`
      )
    },
    [principles, form, saveToLocalStorageDebounced]
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
      return toast.error('A nameless principle cannot be recorded.')

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

    saveToLocalStorageDebounced(updatedPrinciples, 'A new principle emerges.')
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
      saveToLocalStorageDebounced(newOrder)

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
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
        </div>
      </CardContent>
    </Card>
  )
}
