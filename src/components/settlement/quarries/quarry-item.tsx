'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface QuarryItemProps {
  quarry: {
    name: string
    unlocked: boolean
    node: string
  }
  updateQuarryNode: (quarryName: string, node: string) => void
  handleRemoveQuarry: (quarryName: string) => void
  isDisabled: boolean
  onSave: (quarryName: string) => void
  onEdit: (quarryName: string) => void
  updateQuarryName: (originalName: string, newName: string) => void
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
}

export const QuarryItem = memo(
  ({
    quarry,
    updateQuarryNode,
    handleRemoveQuarry,
    id,
    isDisabled,
    onSave,
    onEdit,
    updateQuarryName
  }: QuarryItemProps & { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })
    const [nameValue, setNameValue] = useState(quarry.name)

    useEffect(() => {
      setNameValue(quarry.name)
    }, [quarry.name])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setNameValue(e.target.value)

    const handleSave = () => {
      if (nameValue.trim() !== '') {
        updateQuarryName(quarry.name, nameValue)
        onSave(nameValue)
      } else toast.warning('Cannot save a quarry without a name')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      }
    }

    return (
      <div ref={setNodeRef} style={style} className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {isDisabled ? (
          <FormField
            name="quarries"
            render={() => (
              <FormItem className="flex items-center space-x-2 flex-shrink-0">
                <FormControl>
                  <Checkbox
                    checked={quarry.unlocked}
                    className="mt-2"
                    disabled={true}
                    id={`quarry-${quarry.name}-unlocked`}
                    name={`quarries[${quarry.name}].unlocked`}
                  />
                </FormControl>
                <FormLabel
                  className="text-sm font-medium"
                  htmlFor={`quarry-${quarry.name}-unlocked`}>
                  {quarry.name}
                </FormLabel>
              </FormItem>
            )}
          />
        ) : (
          <>
            <Checkbox
              checked={quarry.unlocked}
              disabled={true}
              id={`quarry-${quarry.name}-unlocked`}
              name={`quarries[${quarry.name}].unlocked`}
            />
            <Input
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
              autoFocus
              id={`quarry-${quarry.name}-name`}
              name={`quarries[${quarry.name}].name`}
            />
          </>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isDisabled ? (
            <Badge
              variant="secondary"
              className="h-8 px-3 flex items-center justify-center">
              {quarry.node}
            </Badge>
          ) : (
            <Select
              value={quarry.node}
              onValueChange={(value) => updateQuarryNode(quarry.name, value)}
              disabled={isDisabled}
              name={`quarries[${quarry.name}].node`}>
              <SelectTrigger
                className="h-8 w-24"
                id={`quarry-${quarry.name}-node-trigger`}
                name={`quarries[${quarry.name}].node`}>
                <SelectValue placeholder={quarry.node} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Node 1">Node 1</SelectItem>
                <SelectItem value="Node 2">Node 2</SelectItem>
                <SelectItem value="Node 3">Node 3</SelectItem>
                <SelectItem value="Node 4">Node 4</SelectItem>
              </SelectContent>
            </Select>
          )}

          {isDisabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(quarry.name)}
              title="Edit quarry">
              <PencilIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSave}
              title="Save quarry">
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveQuarry(quarry.name)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
)

QuarryItem.displayName = 'QuarryItem'

/**
 * New Quarry Item Component
 */
export function NewQuarryItem({
  index,
  handleRemoveQuarry,
  onSave
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveQuarry: (quarryName: string) => void
  onSave: (name: string, node: string, unlocked: boolean) => void
}) {
  const [name, setName] = useState('')
  const [node, setNode] = useState('Node 1')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)

  const handleNodeChange = (value: string) => setNode(value)

  const handleSave = () => {
    if (name.trim() !== '') onSave(name.trim(), node, false)
    else toast.warning('Cannot save a quarry without a name')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      <Checkbox
        checked={false}
        disabled={true}
        id={`quarry-new-${index}-unlocked`}
        name={`quarries[new-${index}].unlocked`}
      />

      <Input
        placeholder="Add a quarry..."
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`quarry-new-${index}-name`}
        name={`quarries[new-${index}].name`}
      />

      <Select
        value={node}
        onValueChange={handleNodeChange}
        name={`quarries[new-${index}].node`}>
        <SelectTrigger
          className="w-24"
          id={`quarry-new-${index}-node-trigger`}
          name={`quarries[new-${index}].node`}>
          <SelectValue placeholder="Node" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Node 1">Node 1</SelectItem>
          <SelectItem value="Node 2">Node 2</SelectItem>
          <SelectItem value="Node 3">Node 3</SelectItem>
          <SelectItem value="Node 4">Node 4</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save quarry">
        <CheckIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveQuarry('new-quarry-' + index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
