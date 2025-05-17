'use client'

import { PrincipleItem } from '@/components/settlement/principles/principle-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  CheckIcon,
  CrownIcon,
  GripVertical,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import {
  ReactElement,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * New Principle Item Properties
 */
export interface NewPrincipleItemProps {
  /** Index */
  index: number
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (name: string, option1Name: string, option2Name: string) => void
}

/**
 * Principles Card Component
 *
 * @param form Form
 */
export function PrinciplesCard(form: UseFormReturn<Settlement>) {
  const principles = useMemo(() => form.watch('principles') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [isEditingIndex, setIsEditingIndex] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      principles.forEach((_, i) => {
        next[i] = prev[i] ?? true
      })

      return next
    })

    // If principles array changes (e.g. tab switch), cancel new and editing
    setIsAddingNew(false)
    setIsEditingIndex(undefined)
  }, [principles])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAddPrinciple = () => setIsAddingNew(true)

  /**
   * Handles the removal of a principle.
   *
   * @param index Principle Index
   */
  const handleRemovePrinciple = (index: number) => {
    const updated = [...principles]

    updated.splice(index, 1)

    form.setValue('principles', updated)

    setDisabledInputs((prev) => {
      const next = { ...prev }
      delete next[index]

      const reindexed: { [key: number]: boolean } = {}

      Object.keys(next).forEach((k) => {
        const num = parseInt(k)

        if (num > index) reindexed[num - 1] = next[num]
        else if (num < index) reindexed[num] = next[num]
      })

      return reindexed
    })

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].principles = updated
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success('The settlement has cleansed a belief from its memory.')
    } catch (error) {
      console.error('Principle Remove Error:', error)
      toast.error(
        'The conviction clings to the settlement, refusing to be forgotten. Please try again.'
      )
    }
  }

  const handleEdit = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
    setIsEditingIndex(index)
  }

  /**
   * Handles the saving of a principle.
   *
   * @param index Principle Index
   * @param name Principle Name
   * @param option1Name Option 1 Name
   * @param option2Name Option 2 Name
   */
  const handleSave = (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.warning(
        'A nameless conviction cannot guide your settlement.'
      )

    const updated = [...principles]

    updated[index] = { ...updated[index], name, option1Name, option2Name }

    form.setValue('principles', updated)

    setDisabledInputs((prev) => ({ ...prev, [index]: true }))
    setIsEditingIndex(undefined)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].principles = updated
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success("The settlement's conviction has been etched in stone.")
    } catch (error) {
      console.error('Principle Save Error:', error)
      toast.error('The darkness rejects your principle. Please try again.')
    }
  }

  const handleCancelNew = useCallback(() => setIsAddingNew(false), [])

  /**
   * Handles the saving of a new principle.
   *
   * @param name Principle Name
   * @param option1Name Option 1 Name
   * @param option2Name Option 2 Name
   */
  const handleSaveNew = (
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.warning('A nameless principle cannot guide your settlement.')

    const updated = [
      ...principles,
      {
        name,
        option1Name,
        option2Name,
        option1Selected: false,
        option2Selected: false
      }
    ]

    form.setValue('principles', updated)

    setDisabledInputs((prev) => ({ ...prev, [updated.length - 1]: true }))
    setIsAddingNew(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].principles = updated
      localStorage.setItem('campaign', JSON.stringify(campaign))
      toast.success('A new guiding principle emerges from the darkness.')
    } catch (error) {
      console.error('New Principle Save Error:', error)
      toast.error('The darkness rejects you. Please try again.')
    }
  }

  /**
   * Handles selecting an option for a principle. Only one option can be selected at a time.
   *
   * @param index Principle Index
   * @param option Which option (1 or 2)
   */
  const handleOptionSelect = useCallback(
    (index: number, option: 1 | 2) => {
      startTransition(() => {
        const updated = [...principles]

        // Update the option selected, ensuring only one is selected at a time
        updated[index] = {
          ...updated[index],
          option1Selected: option === 1,
          option2Selected: option === 2
        }

        form.setValue('principles', updated)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].principles = updated
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success(
            `The settlement has chosen ${option === 1 ? updated[index].option1Name : updated[index].option2Name}.`
          )
        } catch (error) {
          console.error('Principle Option Select Error:', error)
          toast.error('Failed to update principle selection. Please try again.')
        }
      })
    },
    [principles, form]
  )

  /**
   * Handles the drag end event.
   *
   * @param event Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(principles, oldIndex, newIndex)

      form.setValue('principles', newOrder)

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].principles = newOrder
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Principle Drag Error:', error)
      }
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <CrownIcon className="h-4 w-4" /> Principles
        </CardTitle>
        <CardDescription className="text-left text-xs">
          The settlement&apos;s established principles.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 mb-4">
          {principles.length === 0 && !isAddingNew ? (
            <div className="text-center text-muted-foreground py-4">
              No principles established yet.
            </div>
          ) : (
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
                    principle={principle}
                    index={index}
                    form={form}
                    isDisabled={!!disabledInputs[index]}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    handleRemovePrinciple={handleRemovePrinciple}
                    handleUpdatePrinciple={() => {}}
                    handleOptionSelect={handleOptionSelect}
                    autoFocus={isEditingIndex === index}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewPrincipleItem
              index={principles.length}
              onSave={handleSaveNew}
              onCancel={handleCancelNew}
            />
          )}
        </div>
        <div className="flex justify-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddPrinciple}
            disabled={isAddingNew}>
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Principle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * New Principle Item Component
 *
 * @param props New Principle Item Props
 */
function NewPrincipleItem({
  index,
  onSave,
  onCancel
}: NewPrincipleItemProps): ReactElement {
  const [name, setName] = useState<string | undefined>(undefined)
  const [option1, setOption1] = useState<string | undefined>(undefined)
  const [option2, setOption2] = useState<string | undefined>(undefined)

  const handleSave = () => {
    if (!name || !option1 || !option2)
      return toast.warning('A nameless principle cannot guide your settlement.')

    onSave(name.trim(), option1.trim(), option2.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex flex-col gap-2 border rounded-md p-3 bg-muted/40">
      <div className="flex items-center gap-2">
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Input
            placeholder="Name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            id={`principle-new-${index}-name`}
            name={`principles[new-${index}].name`}
          />
          <div className="flex items-center gap-2">
            <Checkbox checked={false} disabled className="mt-2" />
            <Input
              placeholder="Option 1"
              value={option1}
              className="flex-1"
              onChange={(e) => setOption1(e.target.value)}
              onKeyDown={handleKeyDown}
              id={`principle-new-${index}-option1-name`}
              name={`principles[new-${index}].option1Name`}
            />
            <strong>or</strong>
            <Checkbox checked={false} disabled className="mt-2" />
            <Input
              placeholder="Option 2"
              value={option2}
              className="flex-1"
              onChange={(e) => setOption2(e.target.value)}
              onKeyDown={handleKeyDown}
              id={`principle-new-${index}-option2-name`}
              name={`principles[new-${index}].option2Name`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 self-stretch">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSave}
            title="Save principle">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            type="button"
            onClick={onCancel}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
