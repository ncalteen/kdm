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
  /** Level Number (1-4) */
  level: number
  /** Monster Type */
  monsterType: MonsterType
  /** Level Data */
  levelData: Partial<QuarryMonsterLevel | NemesisMonsterLevel>[]
  /** Set Level Data Callback */
  setLevelData: (
    data: Partial<QuarryMonsterLevel | NemesisMonsterLevel>[]
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
  const [selectedSubMonsterIndex, setSelectedSubMonsterIndex] = useState(0)

  // Array input state (for moods, traits, survivorStatuses)
  const [arrayInputEditingIndex, setArrayInputEditingIndex] = useState<
    Record<string, number | null>
  >({})
  const [arrayInputAddingNew, setArrayInputAddingNew] = useState<
    Record<string, boolean>
  >({})

  // Get the current sub-monster data, or create an empty one if none exist
  const currentSubMonster = levelData[selectedSubMonsterIndex] ?? {}

  /**
   * Updates a specific sub-monster's data
   */
  const updateSubMonster = (
    updatedData: Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  ) => {
    const newLevelData = [...levelData]

    newLevelData[selectedSubMonsterIndex] = updatedData
    setLevelData(newLevelData)
  }

  /**
   * Adds a new sub-monster
   */
  const addSubMonster = () => {
    setLevelData([...levelData, {}])
    setSelectedSubMonsterIndex(levelData.length)
  }

  /**
   * Removes a sub-monster
   */
  const removeSubMonster = (index: number) => {
    const newLevelData = levelData.filter((_, i) => i !== index)

    setLevelData(newLevelData)
    if (selectedSubMonsterIndex >= newLevelData.length) {
      setSelectedSubMonsterIndex(Math.max(0, newLevelData.length - 1))
    }
  }

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
    // Access nested value from current sub-monster
    let value: unknown = currentSubMonster

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
          htmlFor={`level${level}-${selectedSubMonsterIndex}-${accessor.join('-')}`}
          className="justify-center text-xs">
          {label}
        </Label>
        <NumericInput
          label={extendedLabel ?? label}
          value={numericValue}
          onChange={(val: number) => updateFn(val)}
          min={0}
        />
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
    // Access nested value from current sub-monster
    let value: unknown = currentSubMonster

    for (const key of accessor)
      if (value && typeof value === 'object' && key in value)
        value = (value as Record<string, unknown>)[key]
      else {
        value = undefined
        break
      }

    // Extract array value with proper type narrowing
    const items = Array.isArray(value) ? value : []

    const fieldKey = `level${level}-${selectedSubMonsterIndex}-${accessor.join('-')}`
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
          <Label className="font-bold text-muted-foreground">{label}</Label>
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
        {/* Sub-Monster Management */}
        <div className="flex items-center gap-2">
          <div className="flex gap-2 flex-wrap flex-1">
            {levelData.map((_, index) => (
              <Button
                key={index}
                type="button"
                variant={
                  selectedSubMonsterIndex === index ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedSubMonsterIndex(index)}>
                {index + 1}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubMonster}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {levelData.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeSubMonster(selectedSubMonsterIndex)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {levelData.length > 0 && (
          <div className="space-y-4 border rounded-lg p-4">
            {/* Sub-Monster Name (Optional) */}
            <div>
              <Label
                htmlFor={`level${level}-${selectedSubMonsterIndex}-name`}
                className="justify-center pb-2 font-bold text-muted-foreground">
                Sub-Monster Name (Optional)
              </Label>

              <Input
                id={`level${level}-${selectedSubMonsterIndex}-name`}
                type="text"
                placeholder="Sub-Monster Name"
                value={currentSubMonster.name ?? ''}
                onChange={(e) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    name: e.target.value
                  })
                }
              />

              <Separator className="my-4" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* AI Deck */}
              <Label className="col-span-4 justify-center font-bold text-muted-foreground">
                AI Deck
              </Label>
              {renderNumericInput(
                ['aiDeck', 'basic'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    aiDeck: {
                      basic: value,
                      advanced: currentSubMonster.aiDeck?.advanced ?? 0,
                      legendary: currentSubMonster.aiDeck?.legendary ?? 0,
                      overtone: currentSubMonster.aiDeck?.overtone
                    }
                  }),
                'B Cards',
                1,
                'AI Deck: Basic'
              )}
              {renderNumericInput(
                ['aiDeck', 'advanced'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    aiDeck: {
                      basic: currentSubMonster.aiDeck?.basic ?? 0,
                      advanced: value,
                      legendary: currentSubMonster.aiDeck?.legendary ?? 0,
                      overtone: currentSubMonster.aiDeck?.overtone
                    }
                  }),
                'A Cards',
                1,
                'AI Deck: Advanced'
              )}
              {renderNumericInput(
                ['aiDeck', 'legendary'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    aiDeck: {
                      basic: currentSubMonster.aiDeck?.basic ?? 0,
                      advanced: currentSubMonster.aiDeck?.advanced ?? 0,
                      legendary: value,
                      overtone: currentSubMonster.aiDeck?.overtone
                    }
                  }),
                'L Cards',
                1,
                'AI Deck: Legendary'
              )}
              {renderNumericInput(
                ['aiDeck', 'overtone'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    aiDeck: {
                      basic: currentSubMonster.aiDeck?.basic ?? 0,
                      advanced: currentSubMonster.aiDeck?.advanced ?? 0,
                      legendary: currentSubMonster.aiDeck?.legendary ?? 0,
                      overtone: value
                    }
                  }),
                'O Cards',
                1,
                'AI Deck: Overtone'
              )}

              <Separator className="col-span-4" />

              {/* Attributes */}
              <Label className="col-span-4 justify-center font-bold text-muted-foreground">
                Attributes
              </Label>

              {/* Life or Hunt Position */}
              {monsterType === MonsterType.QUARRY ? (
                <>
                  {renderNumericInput(
                    ['huntPos'],
                    (value) =>
                      updateSubMonster({
                        ...currentSubMonster,
                        huntPos: value
                      }),
                    'Hunt Position',
                    2
                  )}
                  {renderNumericInput(
                    ['survivorHuntPos'],
                    (value) =>
                      updateSubMonster({
                        ...currentSubMonster,
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
                    updateSubMonster({
                      ...currentSubMonster,
                      life: value
                    }),
                  'Life',
                  4
                )
              )}

              {/* Attributes and Tokens */}
              {renderNumericInput(
                ['accuracy'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    accuracy: value
                  }),
                'Accuracy',
                1
              )}

              {renderNumericInput(
                ['damage'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    damage: value
                  }),
                'Damage',
                1
              )}

              {renderNumericInput(
                ['evasion'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    evasion: value
                  }),
                'Evasion',
                1
              )}

              {renderNumericInput(
                ['luck'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    luck: value
                  }),
                'Luck',
                1
              )}

              {renderNumericInput(
                ['movement'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    movement: value
                  }),
                'Movement',
                1
              )}

              {renderNumericInput(
                ['speed'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    speed: value
                  }),
                'Speed',
                1
              )}

              {renderNumericInput(
                ['strength'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    strength: value
                  }),
                'Strength',
                1
              )}

              {renderNumericInput(
                ['toughness'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    toughness: value
                  }),
                'Toughness',
                1
              )}

              <Separator className="col-span-4" />

              {/* Tokens */}
              <Label className="col-span-4 justify-center font-bold text-muted-foreground">
                Tokens
              </Label>

              {renderNumericInput(
                ['accuracyTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    accuracyTokens: value
                  }),
                'Accuracy',
                1
              )}

              {renderNumericInput(
                ['damageTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    damageTokens: value
                  }),
                'Damage',
                1
              )}

              {renderNumericInput(
                ['evasionTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    evasionTokens: value
                  }),
                'Evasion',
                1
              )}

              {renderNumericInput(
                ['luckTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    luckTokens: value
                  }),
                'Luck',
                1
              )}

              {renderNumericInput(
                ['movementTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    movementTokens: value
                  }),
                'Movement',
                1
              )}

              {renderNumericInput(
                ['speedTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    speedTokens: value
                  }),
                'Speed',
                1
              )}

              {renderNumericInput(
                ['strengthTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    strengthTokens: value
                  }),
                'Strength',
                1
              )}

              {renderNumericInput(
                ['toughnessTokens'],
                (value) =>
                  updateSubMonster({
                    ...currentSubMonster,
                    toughnessTokens: value
                  }),
                'Toughness',
                1
              )}
            </div>

            <Separator />

            {renderArrayInput(
              ['moods'],
              (items) =>
                updateSubMonster({
                  ...currentSubMonster,
                  moods: items
                }),
              'Moods'
            )}

            <Separator />

            {renderArrayInput(
              ['traits'],
              (items) =>
                updateSubMonster({
                  ...currentSubMonster,
                  traits: items
                }),
              'Traits'
            )}

            <Separator />

            {renderArrayInput(
              ['survivorStatuses'],
              (items) =>
                updateSubMonster({
                  ...currentSubMonster,
                  survivorStatuses: items
                }),
              'Survivor Statuses'
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
