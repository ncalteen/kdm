'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MonsterNode } from '@/lib/enums'
import { QUARRIES } from '@/lib/monsters'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Quarry ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (
    id?: number,
    node?: MonsterNode,
    unlocked?: boolean,
    index?: number
  ) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** On Update Quarry Handler */
  onUpdateQuarry: (index: number, id: number) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * New Quarry Item Component Properties
 */
export interface NewQuarryItemProps {
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
  onSave: (id?: number, node?: MonsterNode, unlocked?: boolean) => void
}

/**
 * Quarry Item Component
 *
 * @param props Quarry Item Component Properties
 * @returns Quarry Item Component
 */
export function QuarryItem({
  id,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave,
  onToggleUnlocked,
  onUpdateQuarry,
  selectedSettlement
}: QuarryItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const quarryData = selectedSettlement
    ? QUARRIES[
        selectedSettlement.quarries?.[index]?.id as keyof typeof QUARRIES
      ]
    : null

  useEffect(() => {
    console.debug(
      '[QuarryItem] Changed',
      selectedSettlement?.quarries?.[index],
      index
    )
  }, [selectedSettlement?.quarries, index])

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Unlocked Checkbox */}
      <Checkbox
        id={`quarry-unlocked-${index}`}
        checked={selectedSettlement?.quarries?.[index].unlocked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') onToggleUnlocked(index, checked)
        }}
      />

      {/* Quarry Selection */}
      {isDisabled ? (
        <div className="flex ml-1">
          <Label className="text-sm" htmlFor={`quarry-unlocked-${index}`}>
            {quarryData?.main.name || 'Unknown Quarry'}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedSettlement?.quarries?.[index].id.toString()}
          onValueChange={(value) => onUpdateQuarry(index, parseInt(value))}
          disabled={isDisabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select quarry" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(QUARRIES).map(([id, quarry]) => (
              <SelectItem key={id} value={id}>
                {quarry.main.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Node Badge */}
      <div className="flex items-center gap-1 ml-auto">
        <Badge variant="secondary" className="h-8 w-20">
          {quarryData?.main.node || 'N/A'}
        </Badge>

        {/* Interaction Buttons */}
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit quarry">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onSave(
                selectedSettlement?.quarries?.[index].id,
                quarryData?.main.node,
                selectedSettlement?.quarries?.[index].unlocked,
                index
              )
            }
            title="Save quarry">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onRemove(index)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Quarry Item Component
 *
 * @param props New Quarry Item Component Props
 */
export function NewQuarryItem({
  onCancel,
  onSave
}: NewQuarryItemProps): ReactElement {
  const quarryIdRef = useRef<number>(1)
  const [selectedQuarryId, setSelectedQuarryId] = useState<number>(1)

  const handleSave = () => {
    const quarryData = QUARRIES[quarryIdRef.current as keyof typeof QUARRIES]
    onSave(quarryIdRef.current, quarryData?.main.node, false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Unlocked Checkbox */}
      <Checkbox checked={false} disabled />

      {/* Quarry Selector */}
      <Select
        defaultValue="1"
        onValueChange={(value) => {
          const id = parseInt(value)
          quarryIdRef.current = id
          setSelectedQuarryId(id)
        }}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select quarry" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(QUARRIES).map(([id, quarry]) => (
            <SelectItem key={id} value={id}>
              {quarry.main.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1 ml-auto">
        {/* Node Badge */}
        <Badge variant="secondary" className="h-8 w-20">
          {QUARRIES[selectedQuarryId as keyof typeof QUARRIES]?.main.node ||
            'N/A'}
        </Badge>

        {/* Interaction Buttons */}
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
          onClick={onCancel}
          title="Cancel">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
