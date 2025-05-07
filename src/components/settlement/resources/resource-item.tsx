'use client'

import { ResourceCategoriesCombobox } from '@/components/settlement/resources/resource-categories-combobox'
import { ResourceTypesCombobox } from '@/components/settlement/resources/resource-types-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResourceCategory, ResourceType } from '@/lib/enums'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface ResourceItemProps {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveResource: (index: number) => void
  id: string
  isDisabled: boolean
  onSave: (
    index: number,
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => void
  onEdit: (index: number) => void
}

/**
 * Resource Item Component
 */
export function ResourceItem({
  index,
  form,
  handleRemoveResource,
  id,
  isDisabled,
  onSave,
  onEdit
}: ResourceItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const resource = form.watch(`resources.${index}`)

  const [nameValue, setNameValue] = useState(resource?.name || '')

  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
    resource?.category || ResourceCategory.BASIC
  )

  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(
    resource?.types || [ResourceType.BONE]
  )

  const [amountValue, setAmountValue] = useState(resource?.amount || 0)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(index, nameValue, selectedCategory, selectedTypes, amountValue)
    }
  }

  useEffect(() => {
    setNameValue(resource?.name || '')
    setSelectedCategory(resource?.category || ResourceCategory.BASIC)
    setSelectedTypes(resource?.types || [ResourceType.BONE])
    setAmountValue(resource?.amount || 0)
  }, [resource, isDisabled, index])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center mb-3 gap-2">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="w-[30%]">
          <Input
            placeholder="Resource Name"
            value={nameValue}
            disabled={isDisabled}
            onChange={(e) => !isDisabled && setNameValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>
        <div className="w-[25%]">
          <ResourceCategoriesCombobox
            selectedCategory={selectedCategory}
            onChange={(cat) => !isDisabled && setSelectedCategory(cat)}
            disabled={isDisabled}
          />
        </div>
        <div className="w-[30%]">
          {isDisabled ? (
            <div className="flex flex-wrap gap-1">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <ResourceTypesCombobox
              selectedTypes={selectedTypes}
              onChange={(types) => !isDisabled && setSelectedTypes(types)}
              disabled={isDisabled}
            />
          )}
        </div>
        <div className="w-[10%] flex items-center">
          <Input
            type="number"
            min={0}
            placeholder="0"
            className="w-12 text-center no-spinners"
            value={amountValue}
            disabled={isDisabled}
            onChange={(e) =>
              !isDisabled && setAmountValue(Number(e.target.value))
            }
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit resource">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            onSave(
              index,
              nameValue,
              selectedCategory,
              selectedTypes,
              amountValue
            )
          }
          title="Save resource">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-9 w-9 p-0"
        onClick={() => handleRemoveResource(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Resource Item Component
 */
export function NewResourceItem({
  onSave,
  onCancel
}: {
  onSave: (
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(ResourceCategory.BASIC)
  const [types, setTypes] = useState<ResourceType[]>([ResourceType.BONE])
  const [amount, setAmount] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(name, category, types, amount)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="flex items-center mb-2 gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="w-[30%]">
          <Input
            placeholder="Resource Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
            autoFocus
          />
        </div>
        <div className="w-[25%]">
          <ResourceCategoriesCombobox
            selectedCategory={category}
            onChange={setCategory}
          />
        </div>
        <div className="w-[30%]">
          <ResourceTypesCombobox selectedTypes={types} onChange={setTypes} />
        </div>
        <div className="w-[10%] flex items-center">
          <Input
            type="number"
            min={0}
            placeholder="0"
            className="w-12 text-center no-spinners"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onSave(name, category, types, amount)}
        title="Save resource">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        title="Cancel">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
