'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { ERROR_MESSAGE } from '@/lib/messages'
import {
  getAvailableNodes,
  getCampaign,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import {
  BaseMonsterLevel,
  NemesisMonsterDataSchema,
  NemesisMonsterLevel,
  QuarryMonsterDataSchema,
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
 * Create Monster Dialog Properties
 */
export interface CreateMonsterDialogProps {
  /** Monster Create Callback */
  onMonsterCreated?: () => void
}

/**
 * Create Monster Dialog Component
 *
 * Provides a modal dialog for creating custom quarry or nemesis monsters.
 *
 * @param props Create Monster Dialog Properties
 * @returns Create Monster Dialog Component
 */
export function CreateMonsterDialog({
  onMonsterCreated
}: CreateMonsterDialogProps): ReactElement {
  const { toast } = useToast()

  // Basic fields
  const [isOpen, setIsOpen] = useState(false)
  const [monsterType, setMonsterType] = useState<MonsterType>(
    MonsterType.QUARRY
  )
  const [name, setName] = useState('')
  const [node, setNode] = useState<MonsterNode>(MonsterNode.NQ1)

  // Level data
  const [level1, setLevel1] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level2, setLevel2] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level3, setLevel3] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level4, setLevel4] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})

  // Timeline
  const [timeline, setTimeline] = useState<
    Array<{ year: number; event: string }>
  >([])
  const [disabledTimelineInputs, setDisabledTimelineInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNewTimeline, setIsAddingNewTimeline] = useState<boolean>(false)

  // Quarry-specific fields
  const [huntBoard, setHuntBoard] = useState<
    Record<number, HuntEventType.BASIC | HuntEventType.MONSTER | undefined>
  >({})
  const [locations, setLocations] = useState<string[]>([])
  const [ccRewards, setCcRewards] = useState<string[]>([])

  // Collapsible section state
  const [level1Open, setLevel1Open] = useState(false)
  const [level2Open, setLevel2Open] = useState(false)
  const [level3Open, setLevel3Open] = useState(false)
  const [level4Open, setLevel4Open] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [huntBoardOpen, setHuntBoardOpen] = useState(false)
  const [locationsOpen, setLocationsOpen] = useState(false)
  const [ccRewardsOpen, setCcRewardsOpen] = useState(false)

  /**
   * Handles monster type change and updates node to first available
   */
  const handleMonsterTypeChange = (type: MonsterType) => {
    setMonsterType(type)
    const availableNodes = getAvailableNodes(type)
    setNode(availableNodes[0])
  }

  /**
   * Resets the form to its initial state
   */
  const resetForm = () => {
    setMonsterType(MonsterType.QUARRY)
    setName('')
    setNode(MonsterNode.NQ1)
    setLevel1({})
    setLevel2({})
    setLevel3({})
    setLevel4({})
    setTimeline([])
    setDisabledTimelineInputs({})
    setIsAddingNewTimeline(false)
    setHuntBoard({})
    setLocations([])
    setCcRewards([])
    setLevel1Open(false)
    setLevel2Open(false)
    setLevel3Open(false)
    setLevel4Open(false)
    setTimelineOpen(false)
    setHuntBoardOpen(false)
    setLocationsOpen(false)
    setCcRewardsOpen(false)
  }

  /**
   * Handles creating a new monster
   */
  const handleCreateMonster = () => {
    try {
      // Create the base monster data
      const baseData = {
        name,
        node,
        type: monsterType
      }

      // Generate a unique ID for the monster
      const monsterId = `custom-${Math.random().toString(36).substring(2, 9)}`

      // Get existing campaign data
      const campaign = getCampaign()
      const existingMonsters = campaign.customMonsters || []

      // Convert timeline array to Record format
      const timelineRecord: Record<number, string[]> = {}
      timeline.forEach(({ year, event }) => {
        if (!timelineRecord[year]) timelineRecord[year] = []
        timelineRecord[year].push(event)
      })

      // Validate based on monster type
      if (monsterType === MonsterType.QUARRY) {
        const monsterData = QuarryMonsterDataSchema.parse({
          ...baseData,
          ccRewards: ccRewards.map((name) => ({
            name,
            cc: 0,
            unlocked: false
          })),
          huntBoard,
          locations: locations.map((name) => ({ name, unlocked: false })),
          timeline: timelineRecord,
          ...(Object.keys(level1).length > 0 && { level1 }),
          ...(Object.keys(level2).length > 0 && { level2 }),
          ...(Object.keys(level3).length > 0 && { level3 }),
          ...(Object.keys(level4).length > 0 && { level4 })
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })

        toast.success('A new quarry stalks the land.')
      } else {
        const monsterData = NemesisMonsterDataSchema.parse({
          ...baseData,
          timeline: timelineRecord,
          ...(Object.keys(level1).length > 0 && { level1 }),
          ...(Object.keys(level2).length > 0 && { level2 }),
          ...(Object.keys(level3).length > 0 && { level3 }),
          ...(Object.keys(level4).length > 0 && { level4 })
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })

        toast.success('A nemesis has awakened.')
      }

      resetForm()
      setIsOpen(false)

      if (onMonsterCreated) onMonsterCreated()
    } catch (error) {
      console.error('Create Monster Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles dialog close with cleanup
   */
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  /**
   * Updates a level's field
   */
  const updateLevel = (
    level: 1 | 2 | 3 | 4,
    field: string,
    value: number | string | string[]
  ) => {
    const setters = [setLevel1, setLevel2, setLevel3, setLevel4]
    const setter = setters[level - 1]
    const levels = [level1, level2, level3, level4]
    const currentLevel = levels[level - 1]

    setter({ ...currentLevel, [field]: value })
  }

  /**
   * Renders a numeric input for a level field
   */
  const renderNumericInput = (
    level: 1 | 2 | 3 | 4,
    field: keyof BaseMonsterLevel,
    label: string
  ) => {
    const levels = [level1, level2, level3, level4]
    const currentLevel = levels[level - 1] as Partial<BaseMonsterLevel>
    const value = currentLevel[field] ?? ''

    return (
      <div className="space-y-2">
        <Label htmlFor={`level${level}-${field}`}>{label}</Label>
        <NumericInput
          label={label}
          value={typeof value === 'number' ? value : 0}
          onChange={(value: number) => updateLevel(level, field, value)}
          min={0}
          readOnly={false}>
          <Input
            id={`level${level}-${field}`}
            name={`level${level}-${field}`}
            type="number"
            min="0"
            placeholder="0"
            value={value}
            readOnly
            onChange={(e) =>
              updateLevel(level, field, parseInt(e.target.value) || 0)
            }
            className="text-center no-spinners"
          />
        </NumericInput>
      </div>
    )
  }

  /**
   * Renders a text array input for a level field
   */
  const renderArrayInput = (
    level: 1 | 2 | 3 | 4,
    field: 'moods' | 'traits' | 'survivorStatuses',
    label: string
  ) => {
    const levels = [level1, level2, level3, level4]
    const currentLevel = levels[level - 1] as Partial<BaseMonsterLevel>
    const value = (currentLevel[field] || []).join(', ')

    return (
      <div className="space-y-2">
        <Label htmlFor={`level${level}-${field}`}>{label}</Label>
        <Textarea
          id={`level${level}-${field}`}
          name={`level${level}-${field}`}
          placeholder="Enter line-separated values..."
          value={value}
          onChange={(e) =>
            updateLevel(
              level,
              field,
              e.target.value
                .split(/\n/)
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
        />
      </div>
    )
  }

  /**
   * Renders level editor for a specific level
   */
  const renderLevelEditor = (level: 1 | 2 | 3 | 4) => {
    return (
      <div className="space-y-4 border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          {renderNumericInput(level, 'aiDeckSize', 'AI Deck Size')}
          {renderNumericInput(level, 'toughness', 'Toughness')}
          {renderNumericInput(level, 'movement', 'Movement')}
          {renderNumericInput(level, 'movementTokens', 'Movement Tokens')}

          <Separator className="col-span-2" />

          {monsterType === MonsterType.QUARRY ? (
            <>
              {renderNumericInput(
                level,
                'huntPos' as keyof BaseMonsterLevel,
                'Hunt Position'
              )}
              {renderNumericInput(
                level,
                'survivorHuntPos' as keyof BaseMonsterLevel,
                'Survivor Hunt Position'
              )}
            </>
          ) : (
            renderNumericInput(level, 'life' as keyof BaseMonsterLevel, 'Life')
          )}

          <Separator className="col-span-2" />

          {renderNumericInput(level, 'accuracy', 'Accuracy')}
          {renderNumericInput(level, 'accuracyTokens', 'Accuracy Tokens')}
          {renderNumericInput(level, 'speed', 'Speed')}
          {renderNumericInput(level, 'speedTokens', 'Speed Tokens')}
          {renderNumericInput(level, 'evasion', 'Evasion')}
          {renderNumericInput(level, 'evasionTokens', 'Evasion Tokens')}
          {renderNumericInput(level, 'luck', 'Luck')}
          {renderNumericInput(level, 'luckTokens', 'Luck Tokens')}
          {renderNumericInput(level, 'strength', 'Strength')}
          {renderNumericInput(level, 'strengthTokens', 'Strength Tokens')}
          {renderNumericInput(level, 'damage', 'Damage')}
          {renderNumericInput(level, 'damageTokens', 'Damage Tokens')}
        </div>

        <Separator className="col-span-2" />

        {renderArrayInput(level, 'moods', 'Moods')}
        {renderArrayInput(level, 'traits', 'Traits')}
        {renderArrayInput(level, 'survivorStatuses', 'Survivor Statuses')}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Custom Monster
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Monster</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monster-name">Monster Name</Label>
              <Input
                id="monster-name"
                name="monster-name"
                placeholder="Enter monster name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monster-type">Monster Type</Label>
                <Select
                  value={monsterType}
                  onValueChange={(value) =>
                    handleMonsterTypeChange(value as MonsterType)
                  }
                  name="monster-type">
                  <SelectTrigger id="monster-type">
                    <SelectValue placeholder="Select monster type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MonsterType.QUARRY}>Quarry</SelectItem>
                    <SelectItem value={MonsterType.NEMESIS}>Nemesis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monster-node">Monster Node</Label>
                <Select
                  value={node}
                  onValueChange={(value) => setNode(value as MonsterNode)}
                  name="monster-node">
                  <SelectTrigger id="monster-node">
                    <SelectValue placeholder="Select monster node" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableNodes(monsterType).map((nodeValue) => (
                      <SelectItem key={nodeValue} value={nodeValue}>
                        {nodeValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attributes & Tokens - Level 1 */}
          <Collapsible open={level1Open} onOpenChange={setLevel1Open}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Attributes & Tokens - Level 1</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${level1Open ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {renderLevelEditor(1)}
            </CollapsibleContent>
          </Collapsible>

          {/* Attributes & Tokens - Level 2 */}
          <Collapsible open={level2Open} onOpenChange={setLevel2Open}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Attributes & Tokens - Level 2</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${level2Open ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {renderLevelEditor(2)}
            </CollapsibleContent>
          </Collapsible>

          {/* Attributes & Tokens - Level 3 */}
          <Collapsible open={level3Open} onOpenChange={setLevel3Open}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Attributes & Tokens - Level 3</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${level3Open ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {renderLevelEditor(3)}
            </CollapsibleContent>
          </Collapsible>

          {/* Attributes & Tokens - Level 4 */}
          <Collapsible open={level4Open} onOpenChange={setLevel4Open}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Attributes & Tokens - Level 4</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${level4Open ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {renderLevelEditor(4)}
            </CollapsibleContent>
          </Collapsible>

          {/* Timeline Entries */}
          <Collapsible open={timelineOpen} onOpenChange={setTimelineOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Timeline Entries</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${timelineOpen ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Timeline Entries</Label>
                  {!isAddingNewTimeline && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingNewTimeline(true)}
                      disabled={
                        isAddingNewTimeline ||
                        Object.values(disabledTimelineInputs).some(
                          (v) => v === false
                        )
                      }>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {timeline.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-20">
                        {disabledTimelineInputs[index] ? (
                          <span className="text-sm">{entry.year}</span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            placeholder="Year"
                            defaultValue={entry.year}
                            onChange={(e) => {
                              const newTimeline = [...timeline]
                              newTimeline[index] = {
                                ...entry,
                                year: parseInt(e.target.value) || 0
                              }
                              setTimeline(newTimeline)
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        {disabledTimelineInputs[index] ? (
                          <span className="text-sm">{entry.event}</span>
                        ) : (
                          <Input
                            placeholder="Event name"
                            defaultValue={entry.event}
                            onChange={(e) => {
                              const newTimeline = [...timeline]
                              newTimeline[index] = {
                                ...entry,
                                event: e.target.value
                              }
                              setTimeline(newTimeline)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                setDisabledTimelineInputs((prev) => ({
                                  ...prev,
                                  [index]: true
                                }))
                              }
                            }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {disabledTimelineInputs[index] ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDisabledTimelineInputs((prev) => ({
                                ...prev,
                                [index]: false
                              }))
                            }>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDisabledTimelineInputs((prev) => ({
                                ...prev,
                                [index]: true
                              }))
                            }>
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTimeline = timeline.filter(
                              (_, i) => i !== index
                            )
                            setTimeline(newTimeline)
                            const newDisabled = { ...disabledTimelineInputs }
                            delete newDisabled[index]
                            Object.keys(newDisabled).forEach((k) => {
                              const num = parseInt(k)
                              if (num > index) {
                                newDisabled[num - 1] = newDisabled[num]
                                delete newDisabled[num]
                              }
                            })
                            setDisabledTimelineInputs(newDisabled)
                          }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {isAddingNewTimeline && (
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Input
                          id="new-timeline-year"
                          type="number"
                          min="0"
                          placeholder="Year"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.preventDefault()
                              setIsAddingNewTimeline(false)
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id="new-timeline-event"
                          placeholder="Event name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const yearInput = document.getElementById(
                                'new-timeline-year'
                              ) as HTMLInputElement
                              const eventInput = document.getElementById(
                                'new-timeline-event'
                              ) as HTMLInputElement
                              const year = parseInt(yearInput?.value || '0')
                              const event = eventInput?.value || ''
                              if (event.trim()) {
                                const newTimeline = [
                                  ...timeline,
                                  { year, event }
                                ]
                                setTimeline(newTimeline)
                                setDisabledTimelineInputs((prev) => ({
                                  ...prev,
                                  [timeline.length]: true
                                }))
                                setIsAddingNewTimeline(false)
                              }
                            } else if (e.key === 'Escape') {
                              e.preventDefault()
                              setIsAddingNewTimeline(false)
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const yearInput = document.getElementById(
                              'new-timeline-year'
                            ) as HTMLInputElement
                            const eventInput = document.getElementById(
                              'new-timeline-event'
                            ) as HTMLInputElement
                            const year = parseInt(yearInput?.value || '0')
                            const event = eventInput?.value || ''
                            if (event.trim()) {
                              const newTimeline = [...timeline, { year, event }]
                              setTimeline(newTimeline)
                              setDisabledTimelineInputs((prev) => ({
                                ...prev,
                                [timeline.length]: true
                              }))
                              setIsAddingNewTimeline(false)
                            }
                          }}>
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsAddingNewTimeline(false)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Quarry-Specific Fields */}
          {monsterType === MonsterType.QUARRY && (
            <>
              {/* Hunt Board Layout */}
              <Collapsible open={huntBoardOpen} onOpenChange={setHuntBoardOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Hunt Board Layout</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${huntBoardOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="hunt-board-input">Hunt Board</Label>
                    <Textarea
                      id="hunt-board-input"
                      name="hunt-board-input"
                      placeholder="Enter hunt board config (e.g., '0: basic', '5: monster')"
                      value={Object.entries(huntBoard)
                        .map(([pos, type]) => `${pos}: ${type || ''}`)
                        .join('\n')}
                      onChange={(e) => {
                        const newBoard: Record<
                          number,
                          | HuntEventType.BASIC
                          | HuntEventType.MONSTER
                          | undefined
                        > = {}
                        e.target.value.split('\n').forEach((line) => {
                          const match = line.match(/^(\d+):\s*(.*)$/)
                          if (match) {
                            const pos = parseInt(match[1])
                            const type = match[2].trim()
                            if (
                              type === HuntEventType.BASIC ||
                              type === HuntEventType.MONSTER
                            ) {
                              newBoard[pos] = type
                            } else if (type === '') {
                              newBoard[pos] = undefined
                            }
                          }
                        })
                        setHuntBoard(newBoard)
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: position: basic|monster (one per line)
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Settlement Locations */}
              <Collapsible open={locationsOpen} onOpenChange={setLocationsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Settlement Locations</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${locationsOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="locations-input">Locations</Label>
                    <div className="space-y-2">
                      {locations.map((location, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={location}
                            onChange={(e) => {
                              const newLocations = [...locations]
                              newLocations[index] = e.target.value
                              setLocations(newLocations)
                            }}
                            placeholder="Location name"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setLocations(
                                locations.filter((_, i) => i !== index)
                              )
                            }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocations([...locations, ''])}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Collective Cognition Rewards (Arc) */}
              <Collapsible open={ccRewardsOpen} onOpenChange={setCcRewardsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Collective Cognition Rewards (Arc)</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${ccRewardsOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cc-rewards-input">CC Rewards</Label>
                    <div className="space-y-2">
                      {ccRewards.map((reward, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={reward}
                            onChange={(e) => {
                              const newRewards = [...ccRewards]
                              newRewards[index] = e.target.value
                              setCcRewards(newRewards)
                            }}
                            placeholder="Reward name"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setCcRewards(
                                ccRewards.filter((_, i) => i !== index)
                              )
                            }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCcRewards([...ccRewards, ''])}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add CC Reward
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setIsOpen(false)
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateMonster}
            disabled={!name.trim() || !node}>
            Create Monster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
