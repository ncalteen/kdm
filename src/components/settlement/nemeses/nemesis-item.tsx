'use client'

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
import { NEMESES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { SettlementNemesis } from '@/schemas/settlement-nemesis'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Nemesis Item Properties
 */
export interface NemesisItemProps {
  /** Campaign */
  campaign: Campaign
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** Nemesis Data */
  nemesis: SettlementNemesis
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (name: string | undefined, index?: number) => void
  /** On Toggle Level Handler */
  onToggleLevel: (
    index: number,
    level:
      | 'level1Defeated'
      | 'level2Defeated'
      | 'level3Defeated'
      | 'level4Defeated'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
}

/**
 * New Nemesis Item Component Properties
 */
export interface NewNemesisItemProps {
  /** Campaign */
  campaign: Campaign
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
  onSave: (name: string | undefined, index?: number) => void
}

/**
 * Nemesis Item Component
 *
 * @param props Nemesis Item Component Properties
 * @returns Nemesis Item Component
 */
export function NemesisItem({
  campaign,
  index,
  isDisabled,
  nemesis,
  onEdit,
  onRemove,
  onSave,
  onToggleLevel,
  onToggleUnlocked
}: NemesisItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() })

  const [selectedNemesisName, setSelectedNemesisName] = useState<
    string | undefined
  >(nemesis.name)

  if (isDisabled && selectedNemesisName !== nemesis.name)
    setSelectedNemesisName(nemesis.name)

  const level1Available = 'level1' in nemesis
  const level2Available = 'level2' in nemesis
  const level3Available = 'level3' in nemesis
  const level4Available = 'level4' in nemesis

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
        id={`nemesis-unlocked-${index}`}
        checked={nemesis.unlocked}
        onCheckedChange={(checked) => onToggleUnlocked(index, !!checked)}
      />

      {/* Nemesis Selection */}
      {isDisabled ? (
        <div className="flex ml-1">
          <Label className="text-sm" htmlFor={`nemesis-unlocked-${index}`}>
            {nemesis.name}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedNemesisName}
          onValueChange={(value) => setSelectedNemesisName(value)}
          disabled={isDisabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select nemesis" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(NEMESES).map((n) => (
              <SelectItem key={n.name} value={n.name}>
                {n.name}
              </SelectItem>
            ))}
            {Object.values(campaign.customNemeses ?? {}).map((cn) => (
              <SelectItem key={cn.name} value={cn.name}>
                {cn.name} (Custom)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Level Checkboxes */}
      <div className="flex items-center gap-1 ml-auto">
        {isDisabled && (
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="flex items-center space-x-1"
              style={{
                visibility: level1Available ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={nemesis.level1Defeated}
                onCheckedChange={(checked) =>
                  onToggleLevel(index, 'level1Defeated', !!checked)
                }
                id={`nemesis-${index}-level1`}
                disabled={!level1Available}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level1`}>
                L1
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: level2Available ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={nemesis.level2Defeated}
                onCheckedChange={(checked) =>
                  onToggleLevel(index, 'level2Defeated', !!checked)
                }
                id={`nemesis-${index}-level2`}
                disabled={!level2Available}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level2`}>
                L2
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: level3Available ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={nemesis.level3Defeated}
                onCheckedChange={(checked) =>
                  onToggleLevel(index, 'level3Defeated', !!checked)
                }
                id={`nemesis-${index}-level3`}
                disabled={!level3Available}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level3`}>
                L3
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: level4Available ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={nemesis.level4Defeated}
                onCheckedChange={(checked) =>
                  onToggleLevel(index, 'level4Defeated', !!checked)
                }
                id={`nemesis-${index}-level4`}
                disabled={!level4Available}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level4`}>
                L4
              </Label>
            </div>
          </div>
        )}

        {/* Interaction Buttons */}
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit nemesis">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(selectedNemesisName, index)}
            title="Save nemesis">
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
 * New Nemesis Item Component
 *
 * @param props New Nemesis Item Component Props
 */
export function NewNemesisItem({
  campaign,
  onCancel,
  onSave
}: NewNemesisItemProps): ReactElement {
  const [selectedNemesisName, setSelectedNemesisName] = useState<
    string | undefined
  >(undefined)

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Unlocked Checkbox */}
      <Checkbox checked={false} disabled={true} id="nemesis-new-unlocked" />

      {/* Nemesis Selector */}
      <Select
        value={selectedNemesisName}
        onValueChange={(value) => setSelectedNemesisName(value)}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select nemesis" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(NEMESES).map((nemesis) => (
            <SelectItem key={nemesis.name} value={nemesis.name}>
              {nemesis.name}
            </SelectItem>
          ))}
          {Object.values(campaign.customNemeses ?? {}).map((nemesis) => (
            <SelectItem key={nemesis.name} value={nemesis.name}>
              {nemesis.name} (Custom)
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
          onClick={() => onSave(selectedNemesisName)}
          title="Save nemesis">
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
