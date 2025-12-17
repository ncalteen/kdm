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
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useRef } from 'react'

/**
 * Nemesis Item Properties
 */
export interface NemesisItemProps {
  /** Nemesis ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (id?: number, unlocked?: boolean, index?: number) => void
  /** OnToggleLevel Handler */
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
  /** OnToggleUnlocked Handler */
  onToggleUnlocked: (index: number, unlocked: boolean) => void
  /** OnUpdateNemesis Handler */
  onUpdateNemesis: (index: number, id: number) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * New Nemesis Item Component Properties
 */
export interface NewNemesisItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (id?: number, unlocked?: boolean) => void
}

/**
 * Nemesis Item Component
 *
 * @param props Nemesis Item Component Properties
 * @returns Nemesis Item Component
 */
export function NemesisItem({
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

  const nemesisIdRef = useRef<number | undefined>(
    selectedSettlement?.nemeses?.[index]?.id
  )
  const currentNemesisId = selectedSettlement?.nemeses?.[index]?.id

  if (nemesisIdRef.current !== currentNemesisId) {
    nemesisIdRef.current = currentNemesisId
    console.debug('[NemesisItem] Nemesis ID changed', currentNemesisId, index)
  }

  const nemesisData = currentNemesisId
    ? NEMESES[currentNemesisId as keyof typeof NEMESES]
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
        checked={selectedSettlement?.nemeses?.[index].unlocked}
        onCheckedChange={(checked) => {
          if (checked !== 'indeterminate') onToggleUnlocked(index, !!checked)
        }}
        id={`nemesis-${index}-unlocked`}
      />

      {/* Nemesis Selection */}
      {isDisabled ? (
        <div className="flex flex-1 ml-1">
          <Label className="text-sm" htmlFor={`nemesis-${index}-unlocked`}>
            {nemesisData?.main.name || 'Unknown Nemesis'}
          </Label>
        </div>
      ) : (
        <Select
          value={selectedSettlement?.nemeses?.[index].id.toString()}
          onValueChange={(value) => onUpdateNemesis(index, parseInt(value))}
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
                visibility: nemesisData?.main.level1 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level1}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level1', !!checked)
                }}
                id={`nemesis-${index}-level1`}
                disabled={!nemesisData?.main.level1}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level1`}>
                Lvl 1
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.main.level2 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level2}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level2', !!checked)
                }}
                id={`nemesis-${index}-level2`}
                disabled={!nemesisData?.main.level2}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level2`}>
                Lvl 2
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.main.level3 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level3}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level3', !!checked)
                }}
                id={`nemesis-${index}-level3`}
                disabled={!nemesisData?.main.level3}
              />
              <Label className="text-xs" htmlFor={`nemesis-${index}-level3`}>
                Lvl 3
              </Label>
            </div>

            <div
              className="flex items-center space-x-1"
              style={{
                visibility: nemesisData?.main.level4 ? 'visible' : 'hidden'
              }}>
              <Checkbox
                checked={selectedSettlement?.nemeses?.[index].level4}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate')
                    onToggleLevel(index, 'level4', !!checked)
                }}
                id={`nemesis-${index}-level4`}
                disabled={!nemesisData?.main.level4}
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
            onClick={() =>
              onSave(
                selectedSettlement?.nemeses?.[index].id,
                selectedSettlement?.nemeses?.[index].unlocked,
                index
              )
            }
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
  onCancel,
  onSave
}: NewNemesisItemProps): ReactElement {
  const nemesisIdRef = useRef<number>(1)

  const handleSave = () => onSave(nemesisIdRef.current, false)

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
        onValueChange={(value) => (nemesisIdRef.current = parseInt(value))}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select nemesis" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(NEMESES).map(([id, nemesis]) => (
            <SelectItem key={id} value={id}>
              {nemesis.main.name}
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
