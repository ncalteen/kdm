'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Nemesis } from '@/lib/types'
import { SettlementSchema } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Nemesis Item Props
 */
interface NemesisItemProps {
  /** Disabled Status */
  isDisabled: boolean
  /** Removal Handler */
  handleRemoveNemesis: (nemesisName: string) => void
  /** Level Toggle Handler */
  handleToggleLevel: (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => void
  /** ID */
  id: string
  /** Nemesis */
  nemesis: Nemesis
  /** Edit Handler */
  onEdit: (nemesisName: string) => void
  /** Save Handler */
  onSave: (nemesisName: string) => void
  /** Unlocked Toggle Handler */
  toggleUnlocked: (nemesisName: string, checked: boolean) => void
  /** Update Name Handler */
  updateNemesisName: (originalName: string, newName: string) => void
}

/**
 * Nemesis Item Component
 */
export const NemesisItem = memo(
  ({
    nemesis,
    handleToggleLevel,
    toggleUnlocked,
    handleRemoveNemesis,
    id,
    isDisabled,
    onSave,
    onEdit,
    updateNemesisName
  }: NemesisItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })
    const [nameValue, setNameValue] = useState(nemesis.name)

    useEffect(() => {
      setNameValue(nemesis.name)
    }, [nemesis.name])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setNameValue(e.target.value)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        if (nameValue !== nemesis.name)
          updateNemesisName(nemesis.name, nameValue)
        else onSave(nameValue)
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
            name="nemesis.unlocked"
            render={() => (
              <FormItem className="flex items-center space-x-2 flex-shrink-0">
                <FormControl>
                  <Checkbox
                    checked={nemesis.unlocked}
                    className="mt-2"
                    id={`nemesis-${nemesis.name}-unlocked`}
                    name={`nemesis[${nemesis.name}].unlocked`}
                    onCheckedChange={(checked) => {
                      if (checked !== 'indeterminate')
                        toggleUnlocked(nemesis.name, !!checked)
                    }}
                  />
                </FormControl>
                <FormLabel
                  className="text-sm font-medium mr-2"
                  htmlFor={`nemesis-${nemesis.name}-unlocked`}>
                  {nemesis.name}
                </FormLabel>
              </FormItem>
            )}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={nemesis.unlocked}
              className="mt-2"
              disabled={false}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  toggleUnlocked(nemesis.name, !!checked)
                }
              }}
              id={`nemesis-${nemesis.name}-unlocked`}
              name={`nemesis[${nemesis.name}].unlocked`}
            />
            <Input
              value={nameValue}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="w-[180px]"
              autoFocus
              id={`nemesis-${nemesis.name}-name`}
              name={`nemesis[${nemesis.name}].name`}
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <FormField
            name="nemesis"
            render={() => (
              <FormItem className="flex items-center space-x-1">
                <FormControl>
                  <Checkbox
                    checked={nemesis.level1}
                    className="mt-2"
                    onCheckedChange={(checked) => {
                      if (checked !== 'indeterminate') {
                        handleToggleLevel(nemesis.name, 'level1', checked)
                      }
                    }}
                    id={`nemesis-${nemesis.name}-level1`}
                    name={`nemesis[${nemesis.name}].level1`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level1`}>
                  Lvl 1
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name="nemesis"
            render={() => (
              <FormItem className="flex items-center space-x-1">
                <FormControl>
                  <Checkbox
                    checked={nemesis.level2}
                    className="mt-2"
                    onCheckedChange={(checked) => {
                      if (checked !== 'indeterminate') {
                        handleToggleLevel(nemesis.name, 'level2', checked)
                      }
                    }}
                    id={`nemesis-${nemesis.name}-level2`}
                    name={`nemesis[${nemesis.name}].level2`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level2`}>
                  Lvl 2
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name="nemesis"
            render={() => (
              <FormItem className="flex items-center space-x-1">
                <FormControl>
                  <Checkbox
                    checked={nemesis.level3}
                    className="mt-2"
                    onCheckedChange={(checked) => {
                      if (checked !== 'indeterminate') {
                        handleToggleLevel(nemesis.name, 'level3', checked)
                      }
                    }}
                    id={`nemesis-${nemesis.name}-level3`}
                    name={`nemesis[${nemesis.name}].level3`}
                  />
                </FormControl>
                <FormLabel
                  className="text-xs"
                  htmlFor={`nemesis-${nemesis.name}-level3`}>
                  Lvl 3
                </FormLabel>
              </FormItem>
            )}
          />

          {isDisabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(nemesis.name)}
              title="Edit nemesis">
              <PencilIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (nameValue !== nemesis.name) {
                  updateNemesisName(nemesis.name, nameValue)
                  toast.success('Nemesis updated!')
                } else onSave(nameValue)
              }}
              title="Save nemesis">
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveNemesis(nemesis.name)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
)

NemesisItem.displayName = 'NemesisItem'

/**
 * New Nemesis Item Component
 */
export function NewNemesisItem({
  index,
  handleRemoveNemesis,
  onSave
}: {
  index: number
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
  handleRemoveNemesis: (nemesisName: string) => void
  onSave: (name: string) => void
}) {
  const [name, setName] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)

  const handleSave = () => {
    if (name.trim() !== '') onSave(name.trim())
    else toast.warning('Cannot save a nemesis without a name')
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
        id={`nemesis-new-${index}-unlocked`}
        name={`nemesis[new-${index}].unlocked`}
      />

      <Input
        placeholder="Add a nemesis..."
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
        id={`nemesis-new-${index}-name`}
        name={`nemesis[new-${index}].name`}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSave}
        title="Save nemesis">
        <CheckIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveNemesis('new-nemesis-' + index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
