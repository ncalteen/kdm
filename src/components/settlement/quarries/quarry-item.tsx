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
import { QUARRIES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { SettlementQuarry } from '@/schemas/settlement-quarry'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Campaign */
  campaign: Campaign
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (name: string | undefined, index?: number) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** Quarry Data */
  quarry: SettlementQuarry
}

/**
 * New Quarry Item Component Properties
 */
export interface NewQuarryItemProps {
  /** Campaign */
  campaign: Campaign
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
  onSave: (name: string | undefined, index?: number) => void
}

/**
 * Quarry Item Component
 *
 * @param props Quarry Item Component Properties
 * @returns Quarry Item Component
 */
export function QuarryItem({
  campaign,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave,
  onToggleUnlocked,
  quarry
}: QuarryItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() })

  const [selectedQuarryName, setSelectedQuarryName] = useState<
    string | undefined
  >(quarry.name)

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
        checked={quarry.unlocked}
        onCheckedChange={(checked) => onToggleUnlocked(index, !!checked)}
      />

      {/* Quarry Selection */}
      {isDisabled ? (
        <div className="flex ml-1">
          <Label className="text-sm" htmlFor={`quarry-unlocked-${index}`}>
            {quarry.name}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedQuarryName}
          onValueChange={(value) => setSelectedQuarryName(value)}
          disabled={isDisabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select quarry" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(QUARRIES).map((q) => (
              <SelectItem key={q.name} value={q.name}>
                {q.name}
              </SelectItem>
            ))}
            {Object.values(campaign.customQuarries ?? {}).map((cq) => (
              <SelectItem key={cq.name} value={cq.name}>
                {cq.name} (Custom)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Node Badge */}
      <div className="flex items-center gap-1 ml-auto">
        <Badge variant="secondary" className="h-8 w-20">
          {quarry.node}
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
            onClick={() => onSave(selectedQuarryName, index)}
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
  campaign,
  onCancel,
  onSave
}: NewQuarryItemProps): ReactElement {
  const [selectedQuarryName, setSelectedQuarryName] = useState<
    string | undefined
  >(undefined)

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Unlocked Checkbox */}
      <Checkbox checked={false} disabled={true} id="quarry-new-unlocked" />

      {/* Quarry Selector */}
      <Select
        value={selectedQuarryName}
        onValueChange={(value) => setSelectedQuarryName(value)}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select quarry" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(QUARRIES).map((quarry) => (
            <SelectItem key={quarry.name} value={quarry.name}>
              {quarry.name}
            </SelectItem>
          ))}
          {Object.values(campaign.customQuarries ?? {}).map((quarry) => (
            <SelectItem key={quarry.name} value={quarry.name}>
              {quarry.name} (Custom)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Interaction Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(selectedQuarryName)}
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
