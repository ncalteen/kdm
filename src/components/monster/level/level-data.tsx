'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MonsterType } from '@/lib/enums'
import {
  BaseMonsterLevel,
  NemesisMonsterLevel,
  QuarryMonsterLevel
} from '@/schemas/monster'
import {
  CheckIcon,
  ChevronDown,
  PencilIcon,
  PlusIcon,
  Trash2
} from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Level Data Properties
 */
export interface LevelDataProps {
  /** Level number (1-4) */
  level: number
  /** Monster type */
  monsterType: MonsterType
  /** Level data */
  levelData: Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  /** Update level data callback */
  onLevelDataChange: (field: string, value: number | string | string[]) => void
}

/**
 * Level Data Component
 *
 * Manages attributes and tokens for a specific monster level.
 *
 * @param props Level Data Properties
 * @returns Level Data Component
 */
export function LevelData({
  level,
  monsterType,
  levelData,
  onLevelDataChange
}: LevelDataProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  // Array input state (for moods, traits, survivorStatuses)
  const [arrayInputEditingIndex, setArrayInputEditingIndex] = useState<
    Record<string, number | null>
  >({})
  const [arrayInputAddingNew, setArrayInputAddingNew] = useState<
    Record<string, boolean>
  >({})

  /**
   * Renders a numeric input for a level field
   */
  const renderNumericInput = (field: keyof BaseMonsterLevel, label: string) => {
    const currentLevel = levelData as Partial<BaseMonsterLevel>
    const value = currentLevel[field] ?? ''

    return (
      <div className="space-y-2">
        <Label htmlFor={`level${level}-${field}`}>{label}</Label>
        <NumericInput
          label={label}
          value={typeof value === 'number' ? value : 0}
          onChange={(value: number) => onLevelDataChange(field, value)}
          min={0}
          readOnly={false}>
          <Input
            id={`level${level}-${field}`}
            name={`level${level}-${field}`}
            type="number"
            min="0"
            placeholder="0"
            value={value}
            onChange={(e) =>
              onLevelDataChange(field, parseInt(e.target.value) || 0)
            }
            className="text-center no-spinners"
          />
        </NumericInput>
      </div>
    )
  }

  /**
   * Renders a text array input for a level field using interactive list
   */
  const renderArrayInput = (
    field: 'moods' | 'traits' | 'survivorStatuses',
    label: string
  ) => {
    const currentLevel = levelData as Partial<BaseMonsterLevel>
    const items = (currentLevel[field] || []) as string[]
    const fieldKey = `level${level}-${field}`
    const editingIndex = arrayInputEditingIndex[fieldKey] ?? null
    const isAddingNew = arrayInputAddingNew[fieldKey] ?? false

    const setEditingIndex = (index: number | null) => {
      setArrayInputEditingIndex((prev) => ({ ...prev, [fieldKey]: index }))
    }

    const setIsAddingNew = (adding: boolean) => {
      setArrayInputAddingNew((prev) => ({ ...prev, [fieldKey]: adding }))
    }

    const addItem = (value: string) => {
      if (value.trim()) {
        onLevelDataChange(field, [...items, value.trim()])
        setIsAddingNew(false)
      }
    }

    const updateItem = (index: number, value: string) => {
      const newItems = [...items]
      newItems[index] = value.trim()
      onLevelDataChange(field, newItems)
      setEditingIndex(null)
    }

    const removeItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index)
      onLevelDataChange(field, newItems)
      if (editingIndex === index) setEditingIndex(null)
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2 h-8">
          <Label>{label}</Label>
          {!isAddingNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddingNew(true)}
              className="border-0 h-8 w-8"
              disabled={isAddingNew || editingIndex !== null}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                {editingIndex === index ? (
                  <Input
                    defaultValue={item}
                    placeholder={label}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        updateItem(index, e.currentTarget.value)
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        setEditingIndex(null)
                      }
                    }}
                    onBlur={(e) => updateItem(index, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm">{item}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {editingIndex === index ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(null)}>
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(index)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {isAddingNew && (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  id={`${fieldKey}-new`}
                  placeholder={`Add ${label.toLowerCase()}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addItem(e.currentTarget.value)
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      setIsAddingNew(false)
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const input = document.getElementById(
                      `${fieldKey}-new`
                    ) as HTMLInputElement
                    if (input) addItem(input.value)
                  }}>
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddingNew(false)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Attributes & Tokens - Level {level}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="space-y-4 border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            {renderNumericInput('aiDeckSize', 'AI Deck Size')}
            {renderNumericInput('toughness', 'Toughness')}
            {renderNumericInput('movement', 'Movement')}
            {renderNumericInput('movementTokens', 'Movement Tokens')}

            <Separator className="col-span-2" />

            {monsterType === MonsterType.QUARRY ? (
              <>
                {renderNumericInput(
                  'huntPos' as keyof BaseMonsterLevel,
                  'Hunt Position'
                )}
                {renderNumericInput(
                  'survivorHuntPos' as keyof BaseMonsterLevel,
                  'Survivor Hunt Position'
                )}
              </>
            ) : (
              renderNumericInput('life' as keyof BaseMonsterLevel, 'Life')
            )}

            <Separator className="col-span-2" />

            {renderNumericInput('accuracy', 'Accuracy')}
            {renderNumericInput('accuracyTokens', 'Accuracy Tokens')}
            {renderNumericInput('speed', 'Speed')}
            {renderNumericInput('speedTokens', 'Speed Tokens')}
            {renderNumericInput('evasion', 'Evasion')}
            {renderNumericInput('evasionTokens', 'Evasion Tokens')}
            {renderNumericInput('luck', 'Luck')}
            {renderNumericInput('luckTokens', 'Luck Tokens')}
            {renderNumericInput('strength', 'Strength')}
            {renderNumericInput('strengthTokens', 'Strength Tokens')}
            {renderNumericInput('damage', 'Damage')}
            {renderNumericInput('damageTokens', 'Damage Tokens')}
          </div>

          <Separator className="col-span-2" />

          {renderArrayInput('moods', 'Moods')}
          {renderArrayInput('traits', 'Traits')}
          {renderArrayInput('survivorStatuses', 'Survivor Statuses')}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
