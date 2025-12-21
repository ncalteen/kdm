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
import { MonsterType } from '@/lib/enums'
import { NEMESES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useRef } from 'react'

/**
 * Nemesis Item Properties
 */
export interface NemesisItemProps {
  /** Campaign */
  campaign: Campaign
  /** Nemesis ID */
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
  /** On Toggle Level Handler */
  onToggleLevel: (
    index: number,
    level:
      | 'level1'
      | 'level2'
      | 'level3'
      | 'level4'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => void
  /** On Toggle Unlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** On Update Nemesis Handler */
  onUpdateNemesis: (index: number, id: number | string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
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
  onSave: (id?: number | string, unlocked?: boolean) => void
}

/**
 * Nemesis Item Component
 *
 * @param props Nemesis Item Component Properties
 * @returns Nemesis Item Component
 */
export function NemesisItem({
  campaign,
  id,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave,
  onToggleLevel,
  onToggleUnlocked,
  onUpdateNemesis,
  selectedSettlement
}: NemesisItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const nemesisIdRef = useRef<number | string | undefined>(
    selectedSettlement?.nemeses?.[index]?.id
  )
  const currentNemesisId = selectedSettlement?.nemeses?.[index]?.id

  if (nemesisIdRef.current !== currentNemesisId) {
    nemesisIdRef.current = currentNemesisId
    console.debug('[NemesisItem] Nemesis ID changed', currentNemesisId, index)
  }

  const nemesisData = currentNemesisId
    ? typeof currentNemesisId === 'number'
      ? NEMESES[currentNemesisId as keyof typeof NEMESES]?.main
      : campaign.customMonsters?.[currentNemesisId]?.main.type ===
          MonsterType.NEMESIS
        ? campaign.customMonsters[currentNemesisId].main
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
        id={`nemesis-unlocked-${index}`}
        checked={selectedSettlement?.nemeses?.[index].unlocked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') onToggleUnlocked(index, checked)
        }}
      />

      {/* Nemesis Selection */}
      {isDisabled ? (
        <div className="flex ml-1">
          <Label className="text-sm" htmlFor={`nemesis-unlocked-${index}`}>
            {nemesisData?.name || 'Unknown Nemesis'}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedSettlement?.nemeses?.[index].id.toString()}
          onValueChange={(value) => {
            const numValue = parseInt(value)
            const isBuiltIn =
              !isNaN(numValue) && NEMESES[numValue as keyof typeof NEMESES]
            onUpdateNemesis(
              index,
              isBuiltIn ? numValue : (value as unknown as number)
            )
          }}
          disabled={isDisabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select nemesis" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(NEMESES).map(([id, nemesis]) => (
              <SelectItem key={id} value={id}>
                {nemesis.main.name}
              </SelectItem>
            ))}
            {Object.entries(campaign.customMonsters || {})
              .filter(
                ([, monster]) => monster.main.type === MonsterType.NEMESIS
              )
              .map(([id, monster]) => (
                <SelectItem key={id} value={id}>
                  {monster.main.name} (Custom)
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
                visibility: nemesisData?.level1 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level1}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level1', !!checked)
                }}
                id={`nemesis-${index}-level1`}
                disabled={!nemesisData?.level1}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level1`}>
                Lvl 1
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.level2 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level2}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level2', !!checked)
                }}
                id={`nemesis-${index}-level2`}
                disabled={!nemesisData?.level2}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level2`}>
                Lvl 2
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.level3 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level3}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level3', !!checked)
                }}
                id={`nemesis-${index}-level3`}
                disabled={!nemesisData?.level3}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level3`}>
                Lvl 3
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.level4 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level4}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level4', !!checked)
                }}
                id={`nemesis-${index}-level4`}
                disabled={!nemesisData?.level4}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level4`}>
                Lvl 4
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
            onClick={() => {
              const nemesisId = selectedSettlement?.nemeses?.[index].id
              onSave(
                typeof nemesisId === 'number'
                  ? nemesisId
                  : (nemesisId as unknown as number),
                selectedSettlement?.nemeses?.[index].unlocked,
                index
              )
            }}
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
  const nemesisIdRef = useRef<number | string>(1)

  const handleSave = () => {
    if (typeof nemesisIdRef.current === 'number')
      onSave(nemesisIdRef.current, false)
    else onSave(nemesisIdRef.current as unknown as number, false)
  }

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
        defaultValue="1"
        onValueChange={(value) => {
          const numValue = parseInt(value)
          const isBuiltIn =
            !isNaN(numValue) && NEMESES[numValue as keyof typeof NEMESES]
          nemesisIdRef.current = isBuiltIn ? numValue : value
        }}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select nemesis" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(NEMESES).map(([id, nemesis]) => (
            <SelectItem key={id} value={id}>
              {nemesis.main.name}
            </SelectItem>
          ))}
          {Object.entries(campaign.customMonsters || {})
            .filter(([, monster]) => monster.main.type === MonsterType.NEMESIS)
            .map(([id, monster]) => (
              <SelectItem key={id} value={id}>
                {monster.main.name} (Custom)
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
          onClick={handleSave}
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
