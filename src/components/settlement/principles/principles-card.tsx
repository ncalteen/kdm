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
import { SettlementSchema } from '@/schemas/settlement'
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Principles Card Component
 */
export function PrinciplesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const principles = useMemo(() => form.watch('principles') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null)

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
    setIsEditingIndex(null)
  }, [principles])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAddPrinciple = () => setIsAddingNew(true)

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

      toast.success('Principle removed!')
    } catch (error) {
      console.error('Error saving principles to localStorage:', error)
    }
  }

  const handleEdit = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
    setIsEditingIndex(index)
  }

  const handleSave = (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot save a principle without a name')

    const updated = [...principles]

    updated[index] = { ...updated[index], name, option1Name, option2Name }

    form.setValue('principles', updated)

    setDisabledInputs((prev) => ({ ...prev, [index]: true }))
    setIsEditingIndex(null)
    
    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].principles = updated
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('Principle saved!')
    } catch (error) {
      console.error('Error saving principles to localStorage:', error)
    }
  }

  // TODO: Implement this in the settlement editor
  // const handleSelectOption = (index: number, option: 1 | 2) => {
  //   if (disabledInputs[index]) return

  //   const updatedPrinciples = [...principles]

  //   if (option === 1) {
  //     updatedPrinciples[index].option1Selected =
  //       !updatedPrinciples[index].option1Selected

  //     if (updatedPrinciples[index].option1Selected)
  //       updatedPrinciples[index].option2Selected = false
  //   } else {
  //     updatedPrinciples[index].option2Selected =
  //       !updatedPrinciples[index].option2Selected

  //     if (updatedPrinciples[index].option2Selected)
  //       updatedPrinciples[index].option1Selected = false
  //   }

  //   form.setValue('principles', updatedPrinciples)
  // }

  const handleCancelNew = useCallback(() => setIsAddingNew(false), [])

  const handleSaveNew = (
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '')
      return toast.warning('Cannot save a principle without a name')

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

      toast.success('Principle added!')
    } catch (error) {
      console.error('Error saving principles to localStorage:', error)
    }
  }

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
        console.error('Error saving principles to localStorage:', error)
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

function NewPrincipleItem({
  index,
  onSave,
  onCancel
}: {
  index: number
  onSave: (name: string, option1Name: string, option2Name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [option1, setOption1] = useState('')
  const [option2, setOption2] = useState('')

  const handleSave = () => {
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
