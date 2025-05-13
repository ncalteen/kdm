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
import { Quarry } from '@/lib/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Handle Remove Quarry Function */
  handleRemoveQuarry: (quarryName: string) => void
  /** Quarry ID */
  id: string
  /** Disabled Status */
  isDisabled: boolean
  /** Edit Handler */
  onEdit: (quarryName: string) => void
  /** Save Handler */
  onSave: (quarryName: string) => void
  /** Quarry Details */
  quarry: Quarry
  /** Toggle Quarry Unlocked Status Function */
  toggleQuarryUnlocked?: (quarryName: string, unlocked: boolean) => void
  /** Update Quarry Name Function */
  updateQuarryName: (originalName: string, newName: string) => void
  /** Update Quarry Node Handler */
  updateQuarryNode: (quarryName: string, node: string) => void
}

/**
 * New Quarry Item Component Properties
 */
export interface NewQuarryItemProps {
  /** Handle Remove Quarry Function */
  handleRemoveQuarry: (quarryName: string) => void
  /** Index */
  index: number
  /** Save Handler */
  onSave: (name: string, node: string, unlocked: boolean) => void
}

/**
 * Quarry Item Component
 *
 * @param props Quarry Item Props
 */
export const QuarryItem = memo(
  ({
    handleRemoveQuarry,
    id,
    isDisabled,
    onEdit,
    onSave,
    quarry,
    toggleQuarryUnlocked,
    updateQuarryName,
    updateQuarryNode
  }: QuarryItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })
    const [nameValue, setNameValue] = useState(quarry.name)

    useEffect(() => setNameValue(quarry.name), [quarry.name])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    /**
     * Handles the change in quarry name.
     *
     * @param e Event
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setNameValue(e.target.value)

    /**
     * Handles the save action for the quarry name. If the name is empty, a
     * warning is displayed.
     */
    const handleSave = () => {
      if (nameValue.trim() !== '') {
        updateQuarryName(quarry.name, nameValue)
        onSave(nameValue)
      } else
        toast.warning(
          'A nameless horror cannot be recorded in your chronicles.'
        )
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
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean' && toggleQuarryUnlocked)
                        toggleQuarryUnlocked(quarry.name, checked)
                    }}
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
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean' && toggleQuarryUnlocked)
                  toggleQuarryUnlocked(quarry.name, checked)
              }}
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
 *
 * @param props New Quarry Item Props
 */
export function NewQuarryItem({
  index,
  handleRemoveQuarry,
  onSave
}: NewQuarryItemProps) {
  const [name, setName] = useState('')
  const [node, setNode] = useState('Node 1')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)

  const handleNodeChange = (value: string) => setNode(value)

  const handleSave = () => {
    if (name.trim() !== '') onSave(name.trim(), node, false)
    else toast.warning('A nameless horror cannot be added to your chronicles.')
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
