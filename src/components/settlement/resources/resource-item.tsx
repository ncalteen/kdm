'use client'

import { ResourceCategoriesCombobox } from '@/components/settlement/resources/resource-categories-combobox'
import { ResourceTypesCombobox } from '@/components/settlement/resources/resource-types-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResourceCategory, ResourceType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Resource Item Component Properties
 */
export interface ResourceItemProps {
  /** Form */
  form: UseFormReturn<Settlement>
  /** Resource Item ID */
  id: string
  /** Resource Item Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (
    index: number,
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => void
}

/**
 * New Resource Item Component Properties
 */
export interface NewResourceItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number
  ) => void
}

/**
 * Resource Item Component
 *
 * @param props Resource Item Component Properties
 * @returns Resource Item Component
 */
export function ResourceItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave
}: ResourceItemProps): ReactElement {
  const resource = form.watch(`resources.${index}`)

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const nameInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)

  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
    resource?.category || ResourceCategory.BASIC
  )
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(
    resource?.types || [ResourceType.BONE]
  )

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.value = resource?.name || ''

    if (amountInputRef.current)
      amountInputRef.current.value = (resource?.amount || 0).toString()

    setSelectedCategory(resource?.category || ResourceCategory.BASIC)
    setSelectedTypes(resource?.types || [ResourceType.BONE])

    if (!isDisabled && nameInputRef.current) {
      nameInputRef.current.focus()

      const val = nameInputRef.current.value
      nameInputRef.current.value = ''
      nameInputRef.current.value = val
    }
  }, [resource, isDisabled, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and values.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && nameInputRef.current && amountInputRef.current) {
      e.preventDefault()
      onSave(
        index,
        nameInputRef.current.value,
        selectedCategory,
        selectedTypes,
        Number(amountInputRef.current.value)
      )
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Name Input */}
      <Input
        ref={nameInputRef}
        placeholder="Resource Name"
        defaultValue={resource?.name}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />

      {/* Category */}
      <div className="w-32 mr-2">
        <ResourceCategoriesCombobox
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
          disabled={isDisabled}
        />
      </div>

      {/* Types */}
      <div className="w-40 mr-2">
        {isDisabled ? (
          <div className="flex flex-wrap gap-1">
            {selectedTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        ) : (
          <ResourceTypesCombobox
            selectedTypes={selectedTypes}
            onChange={setSelectedTypes}
            disabled={isDisabled}
          />
        )}
      </div>

      {/* Amount Input */}
      <Input
        ref={amountInputRef}
        type="number"
        min={0}
        placeholder="0"
        defaultValue={resource?.amount}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="w-16 text-center mr-2 no-spinners"
      />

      {/* Edit/Save Button */}
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => onEdit(index)}
          title="Edit resource">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => {
            if (nameInputRef.current && amountInputRef.current) {
              onSave(
                index,
                nameInputRef.current.value,
                selectedCategory,
                selectedTypes,
                Number(amountInputRef.current.value)
              )
            }
          }}
          title="Save resource">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onRemove(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Resource Item Component
 *
 * @param props New Resource Item Component Props
 */
export function NewResourceItem({
  onCancel,
  onSave
}: NewResourceItemProps): ReactElement {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState<ResourceCategory>(
    ResourceCategory.BASIC
  )
  const [types, setTypes] = useState<ResourceType[]>([ResourceType.BONE])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * values. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && nameInputRef.current && amountInputRef.current) {
      e.preventDefault()
      onSave(
        nameInputRef.current.value,
        category,
        types,
        Number(amountInputRef.current.value)
      )
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex items-center">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Name Input */}
      <Input
        ref={nameInputRef}
        placeholder="Resource Name"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />

      {/* Category */}
      <div className="w-32 mr-2">
        <ResourceCategoriesCombobox
          selectedCategory={category}
          onChange={setCategory}
        />
      </div>

      {/* Types */}
      <div className="w-40 mr-2">
        <ResourceTypesCombobox selectedTypes={types} onChange={setTypes} />
      </div>

      {/* Amount Input */}
      <Input
        ref={amountInputRef}
        type="number"
        min={0}
        placeholder="0"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="w-16 text-center mr-2"
      />

      {/* Save Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() => {
          if (nameInputRef.current && amountInputRef.current) {
            onSave(
              nameInputRef.current.value,
              category,
              types,
              Number(amountInputRef.current.value)
            )
          }
        }}
        title="Save resource">
        <CheckIcon className="h-4 w-4" />
      </Button>

      {/* Cancel Button */}
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
