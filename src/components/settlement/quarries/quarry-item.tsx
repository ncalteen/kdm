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
import { MonsterType } from '@/lib/enums'
import { QUARRIES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useRef } from 'react'

/**
 * Quarry Item Properties
 */
export interface QuarryItemProps {
  /** Campaign */
  campaign: Campaign
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
  onSave: (id?: number | string, unlocked?: boolean, index?: number) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** On Update Quarry Handler */
  onUpdateQuarry: (index: number, id: number | string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
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
  onSave: (id?: number | string, unlocked?: boolean) => void
}

/**
 * Quarry Item Component
 *
 * @param props Quarry Item Component Properties
 * @returns Quarry Item Component
 */
export function QuarryItem({
  campaign,
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

  const quarryIdRef = useRef<number | string | undefined>(
    selectedSettlement?.quarries?.[index]?.id
  )
  const currentQuarryId = selectedSettlement?.quarries?.[index]?.id

  if (quarryIdRef.current !== currentQuarryId) {
    quarryIdRef.current = currentQuarryId
    console.debug('[QuarryItem] Quarry ID changed', currentQuarryId, index)
  }

  const quarryData = currentQuarryId
    ? typeof currentQuarryId === 'number'
      ? QUARRIES[currentQuarryId as keyof typeof QUARRIES]?.main
      : campaign.customMonsters?.[currentQuarryId]?.main.type ===
          MonsterType.QUARRY
        ? campaign.customMonsters[currentQuarryId].main
        : null
    : null

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
            {quarryData?.name || 'Unknown Quarry'}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedSettlement?.quarries?.[index].id.toString()}
          onValueChange={(value) => {
            const numValue = parseInt(value)
            const isBuiltIn =
              !isNaN(numValue) && QUARRIES[numValue as keyof typeof QUARRIES]
            onUpdateQuarry(
              index,
              isBuiltIn ? numValue : (value as unknown as number)
            )
          }}
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
            {Object.entries(campaign.customMonsters || {})
              .filter(([, monster]) => monster.main.type === MonsterType.QUARRY)
              .map(([id, monster]) => (
                <SelectItem key={id} value={id}>
                  {monster.main.name} (Custom)
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {/* Node Badge */}
      <div className="flex items-center gap-1 ml-auto">
        <Badge variant="secondary" className="h-8 w-20">
          {quarryData?.node || 'N/A'}
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
            onClick={() => {
              const quarryId = selectedSettlement?.quarries?.[index].id
              onSave(
                typeof quarryId === 'number'
                  ? quarryId
                  : (quarryId as unknown as number),
                selectedSettlement?.quarries?.[index].unlocked,
                index
              )
            }}
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
  const quarryIdRef = useRef<number | string>(1)

  const handleSave = () => {
    if (typeof quarryIdRef.current === 'number')
      onSave(quarryIdRef.current, false)
    else onSave(quarryIdRef.current as unknown as number, false)
  }

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
        defaultValue="1"
        onValueChange={(value) => {
          const numValue = parseInt(value)
          const isBuiltIn =
            !isNaN(numValue) && QUARRIES[numValue as keyof typeof QUARRIES]
          quarryIdRef.current = isBuiltIn ? numValue : value
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
          {Object.entries(campaign.customMonsters || {})
            .filter(([, monster]) => monster.main.type === MonsterType.QUARRY)
            .map(([id, monster]) => (
              <SelectItem key={id} value={id}>
                {monster.main.name} (Custom)
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1 ml-auto">
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
