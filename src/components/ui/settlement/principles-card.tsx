'use client'

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
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PlusCircleIcon, XIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Input } from '../input'

interface PrincipleItemProps {
  principle: {
    name: string
    option1Name: string
    option1Selected: boolean
    option2Name: string
    option2Selected: boolean
  }
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemovePrinciple: (index: number) => void
  handleSelectOption: (index: number, option: 1 | 2) => void
  handleUpdatePrinciple: (index: number, field: string, value: string) => void
}

function PrincipleItem({
  index,
  principle,
  handleRemovePrinciple,
  handleSelectOption,
  handleUpdatePrinciple,
  id
}: PrincipleItemProps & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 border rounded-md p-3">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <Input
          placeholder="Name"
          className="flex-1"
          value={principle.name}
          onChange={(e) => handleUpdatePrinciple(index, 'name', e.target.value)}
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleRemovePrinciple(index)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 pl-8">
        <Button
          type="button"
          size="sm"
          variant={principle.option1Selected ? 'default' : 'outline'}
          className="h-8 min-w-8 p-1"
          onClick={() => handleSelectOption(index, 1)}>
          {principle.option1Selected && <CheckIcon className="h-4 w-4" />}
        </Button>

        <Input
          placeholder="Option 1"
          value={principle.option1Name}
          className="flex-1"
          onChange={(e) =>
            handleUpdatePrinciple(index, 'option1Name', e.target.value)
          }
        />

        <Button
          type="button"
          size="sm"
          variant={principle.option2Selected ? 'default' : 'outline'}
          className="h-8 min-w-8 p-1 ml-2"
          onClick={() => handleSelectOption(index, 2)}>
          {principle.option2Selected && <CheckIcon className="h-4 w-4" />}
        </Button>

        <Input
          placeholder="Option 2"
          value={principle.option2Name}
          className="flex-1 mr-10"
          onChange={(e) =>
            handleUpdatePrinciple(index, 'option2Name', e.target.value)
          }
        />
      </div>
    </div>
  )
}

export function PrinciplesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const principles = form.watch('principles') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAddPrinciple = () => {
    // Add a new empty principle directly to the list
    const updatedPrinciples = [
      ...principles,
      {
        name: '',
        option1Name: '',
        option2Name: '',
        option1Selected: false,
        option2Selected: false
      }
    ]

    form.setValue('principles', updatedPrinciples)
  }

  const handleRemovePrinciple = (index: number) => {
    const updatedPrinciples = [...principles]
    updatedPrinciples.splice(index, 1)
    form.setValue('principles', updatedPrinciples)
  }

  const handleSelectOption = (index: number, option: 1 | 2) => {
    const updatedPrinciples = [...principles]

    if (option === 1) {
      updatedPrinciples[index].option1Selected =
        !updatedPrinciples[index].option1Selected

      // If option 1 is selected, deselect option 2
      if (updatedPrinciples[index].option1Selected) {
        updatedPrinciples[index].option2Selected = false
      }
    } else {
      updatedPrinciples[index].option2Selected =
        !updatedPrinciples[index].option2Selected

      // If option 2 is selected, deselect option 1
      if (updatedPrinciples[index].option2Selected) {
        updatedPrinciples[index].option1Selected = false
      }
    }

    form.setValue('principles', updatedPrinciples)
  }

  const handleUpdatePrinciple = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedPrinciples = [...principles]
    updatedPrinciples[index] = {
      ...updatedPrinciples[index],
      [field]: value
    }
    form.setValue('principles', updatedPrinciples)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newOrder = arrayMove(principles, oldIndex, newIndex)
      form.setValue('principles', newOrder)
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Principles
        </CardTitle>
        <CardDescription className="text-left">
          The settlement&apos;s established principles.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 mb-4">
          {principles.length === 0 ? (
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
                    handleRemovePrinciple={handleRemovePrinciple}
                    handleSelectOption={handleSelectOption}
                    handleUpdatePrinciple={handleUpdatePrinciple}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddPrinciple}>
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Principle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
