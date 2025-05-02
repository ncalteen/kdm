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
import {
  CheckIcon,
  GripVertical,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Checkbox } from '../checkbox'
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
  isDisabled,
  onEdit,
  onSave,
  handleRemovePrinciple,
  handleSelectOption,
  id
}: PrincipleItemProps & {
  id: string
  isDisabled: boolean
  onEdit: (index: number) => void
  onSave: (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [nameValue, setNameValue] = useState(principle.name)
  const [option1Value, setOption1Value] = useState(principle.option1Name)
  const [option2Value, setOption2Value] = useState(principle.option2Name)

  useEffect(() => {
    setNameValue(principle.name)
    setOption1Value(principle.option1Name)
    setOption2Value(principle.option2Name)
  }, [principle.name, principle.option1Name, principle.option2Name])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value)
  }
  const handleOption1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption1Value(e.target.value)
  }
  const handleOption2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption2Value(e.target.value)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, option1Value, option2Value)
    }
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
        <div className="flex-1 flex flex-col gap-2">
          {isDisabled ? (
            <Input
              value={nameValue}
              disabled
              className="w-full"
              id={`principle-${index}-name`}
              name={`principles[${index}].name`}
            />
          ) : (
            <Input
              placeholder="Name"
              className="w-full"
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              autoFocus
              id={`principle-${index}-name`}
              name={`principles[${index}].name`}
            />
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={principle.option1Selected}
              onCheckedChange={() => handleSelectOption(index, 1)}
              disabled={true}
              id={`principle-${index}-option1-selected`}
              name={`principles[${index}].option1Selected`}
            />
            {isDisabled ? (
              <Input
                value={option1Value}
                disabled
                className="flex-1"
                id={`principle-${index}-option1-name`}
                name={`principles[${index}].option1Name`}
              />
            ) : (
              <Input
                placeholder="Option 1"
                value={option1Value}
                className="flex-1"
                onChange={handleOption1Change}
                onKeyDown={handleKeyDown}
                id={`principle-${index}-option1-name`}
                name={`principles[${index}].option1Name`}
              />
            )}
            <strong>or</strong>
            <Checkbox
              checked={principle.option2Selected}
              onCheckedChange={() => handleSelectOption(index, 2)}
              disabled={true}
              id={`principle-${index}-option2-selected`}
              name={`principles[${index}].option2Selected`}
            />
            {isDisabled ? (
              <Input
                value={option2Value}
                disabled
                className="flex-1"
                id={`principle-${index}-option2-name`}
                name={`principles[${index}].option2Name`}
              />
            ) : (
              <Input
                placeholder="Option 2"
                value={option2Value}
                className="flex-1"
                onChange={handleOption2Change}
                onKeyDown={handleKeyDown}
                id={`principle-${index}-option2-name`}
                name={`principles[${index}].option2Name`}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 self-stretch">
          {isDisabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(index)}
              title="Edit principle">
              <PencilIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                onSave(index, nameValue, option1Value, option2Value)
              }
              title="Save principle">
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            type="button"
            onClick={() => handleRemovePrinciple(index)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PrinciplesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const principles = useMemo(() => form.watch('principles') || [], [form])
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}
      principles.forEach((_, i) => {
        next[i] = prev[i] ?? true
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

  const handleAddPrinciple = () => {
    form.setValue('principles', [
      ...principles,
      {
        name: '',
        option1Name: '',
        option2Name: '',
        option1Selected: false,
        option2Selected: false
      }
    ])
    setDisabledInputs((prev) => ({ ...prev, [principles.length]: false }))
  }

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
        if (num > index) {
          reindexed[num - 1] = next[num]
        } else if (num < index) {
          reindexed[num] = next[num]
        }
      })
      return reindexed
    })
  }

  const handleEdit = (index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }

  const handleSave = (
    index: number,
    name: string,
    option1Name: string,
    option2Name: string
  ) => {
    if (!name || name.trim() === '') {
      toast.warning('Cannot save a principle without a name')
      return
    }
    const updated = [...principles]
    updated[index] = { ...updated[index], name, option1Name, option2Name }
    form.setValue('principles', updated)
    setDisabledInputs((prev) => ({ ...prev, [index]: true }))
    toast.success('Principle saved')
  }

  const handleSelectOption = (index: number, option: 1 | 2) => {
    if (disabledInputs[index]) return
    const updatedPrinciples = [...principles]
    if (option === 1) {
      updatedPrinciples[index].option1Selected =
        !updatedPrinciples[index].option1Selected
      if (updatedPrinciples[index].option1Selected) {
        updatedPrinciples[index].option2Selected = false
      }
    } else {
      updatedPrinciples[index].option2Selected =
        !updatedPrinciples[index].option2Selected
      if (updatedPrinciples[index].option2Selected) {
        updatedPrinciples[index].option1Selected = false
      }
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
                    isDisabled={!!disabledInputs[index]}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    handleRemovePrinciple={handleRemovePrinciple}
                    handleSelectOption={handleSelectOption}
                    handleUpdatePrinciple={() => {}}
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
            onClick={handleAddPrinciple}
            disabled={Object.values(disabledInputs).some((v) => v === false)}>
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Principle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
