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
  NemesisMonsterLevel,
  QuarryMonsterLevel
} from '@/schemas/monster-level'
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
  /** Set level data callback */
  setLevelData: (
    data: Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  ) => void
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
  setLevelData
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
  const renderNumericInput = (
    accessor: string[],
    updateFn: (value: number) => void,
    label: string,
    colspan: number,
    extendedLabel?: string
  ) => {
    // Access nested value
    let value: unknown = levelData

    for (const key of accessor)
      if (value && typeof value === 'object' && key in value)
        value = (value as Record<string, unknown>)[key]
      else {
        value = undefined
        break
      }

    // Extract numeric value with proper type narrowing
    const numericValue = typeof value === 'number' ? value : 0

    return (
      <div className={`space-y-2 col-span-${colspan}`}>
        <Label
          htmlFor={`level${level}-${accessor.join('-')}`}
          className="justify-center">
          {label}
        </Label>
        <NumericInput
          label={extendedLabel || label}
          value={numericValue}
          onChange={(val: number) => updateFn(val)}
          min={0}
          readOnly={false}>
          <Input
            id={`level${level}-${accessor.join('-')}`}
            type="number"
            min="0"
            placeholder="0"
            value={numericValue}
            onChange={(e) => updateFn(parseInt(e.target.value) || 0)}
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
    accessor: string[],
    updateFn: (items: string[]) => void,
    label: string
  ) => {
    // Access nested value
    let value: unknown = levelData

    for (const key of accessor)
      if (value && typeof value === 'object' && key in value)
        value = (value as Record<string, unknown>)[key]
      else {
        value = undefined
        break
      }

    // Extract array value with proper type narrowing
    const items = Array.isArray(value) ? value : []

    const fieldKey = `level${level}-${accessor.join('-')}`
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
        updateFn([...items, value.trim()])
        setIsAddingNew(false)
      }
    }

    const updateItem = (index: number, value: string) => {
      const newItems = [...items]
      newItems[index] = value.trim()
      updateFn(newItems)
      setEditingIndex(null)
    }

    const removeItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index)
      updateFn(newItems)
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
          <div className="grid grid-cols-4 gap-4">
            {/* AI Deck */}
            <Label className="col-span-4 justify-center">AI Deck</Label>
            {renderNumericInput(
              ['aiDeck', 'basic'],
              (value) =>
                setLevelData({
                  ...levelData,
                  aiDeck: {
                    basic: value,
                    advanced: levelData.aiDeck?.advanced ?? 0,
                    legendary: levelData.aiDeck?.legendary ?? 0,
                    overtone: levelData.aiDeck?.overtone
                  }
                }),
              'B',
              1,
              'AI Deck: Basic'
            )}
            {renderNumericInput(
              ['aiDeck', 'advanced'],
              (value) =>
                setLevelData({
                  ...levelData,
                  aiDeck: {
                    basic: levelData.aiDeck?.basic ?? 0,
                    advanced: value,
                    legendary: levelData.aiDeck?.legendary ?? 0,
                    overtone: levelData.aiDeck?.overtone
                  }
                }),
              'A',
              1,
              'AI Deck: Advanced'
            )}
            {renderNumericInput(
              ['aiDeck', 'legendary'],
              (value) =>
                setLevelData({
                  ...levelData,
                  aiDeck: {
                    basic: levelData.aiDeck?.basic ?? 0,
                    advanced: levelData.aiDeck?.advanced ?? 0,
                    legendary: value,
                    overtone: levelData.aiDeck?.overtone
                  }
                }),
              'L',
              1,
              'AI Deck: Legendary'
            )}
            {renderNumericInput(
              ['aiDeck', 'overtone'],
              (value) =>
                setLevelData({
                  ...levelData,
                  aiDeck: {
                    basic: levelData.aiDeck?.basic ?? 0,
                    advanced: levelData.aiDeck?.advanced ?? 0,
                    legendary: levelData.aiDeck?.legendary ?? 0,
                    overtone: value
                  }
                }),
              'O',
              1,
              'AI Deck: Overtone'
            )}

            <Separator className="col-span-4" />

            {/* Life or Hunt Position */}
            {monsterType === MonsterType.QUARRY ? (
              <>
                {renderNumericInput(
                  ['huntPos'],
                  (value) =>
                    setLevelData({
                      ...levelData,
                      huntPos: value
                    }),
                  'Hunt Position',
                  2
                )}
                {renderNumericInput(
                  ['survivorHuntPos'],
                  (value) =>
                    setLevelData({
                      ...levelData,
                      survivorHuntPos: value
                    }),
                  'Survivor Hunt Position',
                  2
                )}
              </>
            ) : (
              renderNumericInput(
                ['life'],
                (value) =>
                  setLevelData({
                    ...levelData,
                    life: value
                  }),
                'Life',
                4
              )
            )}

            <Separator className="col-span-4" />

            {/* Attributes and Tokens */}
            {renderNumericInput(
              ['accuracy'],
              (value) =>
                setLevelData({
                  ...levelData,
                  accuracy: value
                }),
              'Accuracy',
              2
            )}
            {renderNumericInput(
              ['accuracyTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  accuracyTokens: value
                }),
              'Accuracy Tokens',
              2
            )}

            {renderNumericInput(
              ['damage'],
              (value) =>
                setLevelData({
                  ...levelData,
                  damage: value
                }),
              'Damage',
              2
            )}
            {renderNumericInput(
              ['damageTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  damageTokens: value
                }),
              'Damage Tokens',
              2
            )}

            {renderNumericInput(
              ['evasion'],
              (value) =>
                setLevelData({
                  ...levelData,
                  evasion: value
                }),
              'Evasion',
              2
            )}
            {renderNumericInput(
              ['evasionTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  evasionTokens: value
                }),
              'Evasion Tokens',
              2
            )}

            {renderNumericInput(
              ['luck'],
              (value) =>
                setLevelData({
                  ...levelData,
                  luck: value
                }),
              'Luck',
              2
            )}
            {renderNumericInput(
              ['luckTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  luckTokens: value
                }),
              'Luck Tokens',
              2
            )}

            {renderNumericInput(
              ['movement'],
              (value) =>
                setLevelData({
                  ...levelData,
                  movement: value
                }),
              'Movement',
              2
            )}
            {renderNumericInput(
              ['movementTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  movementTokens: value
                }),
              'Movement Tokens',
              2
            )}

            {renderNumericInput(
              ['speed'],
              (value) =>
                setLevelData({
                  ...levelData,
                  speed: value
                }),
              'Speed',
              2
            )}
            {renderNumericInput(
              ['speedTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  speedTokens: value
                }),
              'Speed Tokens',
              2
            )}

            {renderNumericInput(
              ['strength'],
              (value) =>
                setLevelData({
                  ...levelData,
                  strength: value
                }),
              'Strength',
              2
            )}
            {renderNumericInput(
              ['strengthTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  strengthTokens: value
                }),
              'Strength Tokens',
              2
            )}

            {renderNumericInput(
              ['toughness'],
              (value) =>
                setLevelData({
                  ...levelData,
                  toughness: value
                }),
              'Toughness',
              2
            )}
            {renderNumericInput(
              ['toughnessTokens'],
              (value) =>
                setLevelData({
                  ...levelData,
                  toughnessTokens: value
                }),
              'Toughness Tokens',
              2
            )}
          </div>

          <Separator className="col-span-4" />

          {renderArrayInput(
            ['moods'],
            (items) =>
              setLevelData({
                ...levelData,
                moods: items
              }),
            'Moods'
          )}
          {renderArrayInput(
            ['traits'],
            (items) =>
              setLevelData({
                ...levelData,
                traits: items
              }),
            'Traits'
          )}
          {renderArrayInput(
            ['survivorStatuses'],
            (items) =>
              setLevelData({
                ...levelData,
                survivorStatuses: items
              }),
            'Survivor Statuses'
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
