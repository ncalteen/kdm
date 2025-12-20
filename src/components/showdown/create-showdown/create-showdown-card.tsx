'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { TraitsMoods } from '@/components/monster/traits-moods/traits-moods'
import { ScoutSelectionDrawer } from '@/components/survivor/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/survivor/survivor-selection/survivor-selection-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Toggle } from '@/components/ui/toggle'
import {
  AmbushType,
  ColorChoice,
  MonsterLevel,
  MonsterType,
  TurnType
} from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_ALREADY_ACTIVE_ERROR_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_CREATED_MESSAGE
} from '@/lib/messages'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { getNextShowdownId } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown, SurvivorShowdownDetails } from '@/schemas/showdown'
import { SkullIcon } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * Create Showdown Card Properties
 */
interface CreateShowdownCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
}

/**
 * Create Showdown Card Component
 *
 * @param props Create Showdown Card Properties
 * @returns Create Showdown Card Component
 */
export function CreateShowdownCard({
  campaign,
  saveSelectedShowdown,
  selectedHunt,
  selectedSettlement,
  setSelectedShowdown
}: CreateShowdownCardProps): ReactElement {
  const [selectedMonsterAccuracyTokens, setSelectedMonsterAccuracyTokens] =
    useState<number>(0)
  const [selectedMonsterAIDeckACards, setSelectedMonsterAIDeckACards] =
    useState<number>(0)
  const [selectedMonsterAIDeckBCards, setSelectedMonsterAIDeckBCards] =
    useState<number>(0)
  const [selectedMonsterAIDeckLCards, setSelectedMonsterAIDeckLCards] =
    useState<number>(0)
  const [selectedMonsterAIDeckOCards, setSelectedMonsterAIDeckOCards] =
    useState<number>(0)
  const [selectedMonsterDamage, setSelectedMonsterDamage] = useState<number>(0)
  const [selectedMonsterDamageTokens, setSelectedMonsterDamageTokens] =
    useState<number>(0)
  const [selectedMonsterEvasionTokens, setSelectedMonsterEvasionTokens] =
    useState<number>(0)
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedMonsterLuckTokens, setSelectedMonsterLuckTokens] =
    useState<number>(0)
  const [selectedMonsterMoods, setSelectedMonsterMoods] = useState<string[]>([])
  const [selectedMonsterMovement, setSelectedMonsterMovement] =
    useState<number>(6)
  const [selectedMonsterMovementTokens, setSelectedMonsterMovementTokens] =
    useState<number>(0)
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('')
  const [selectedMonsterSpeed, setSelectedMonsterSpeed] = useState<number>(0)
  const [selectedMonsterSpeedTokens, setSelectedMonsterSpeedTokens] =
    useState<number>(0)
  const [selectedMonsterStrengthTokens, setSelectedMonsterStrengthTokens] =
    useState<number>(0)
  const [selectedMonsterToughness, setSelectedMonsterToughness] =
    useState<number>(6)
  const [selectedMonsterTraits, setSelectedMonsterTraits] = useState<string[]>(
    []
  )
  const [selectedMonsterType, setSelectedMonsterType] = useState<MonsterType>()

  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)
  const [startingTurn, setStartingTurn] = useState<TurnType>(TurnType.MONSTER)
  const [availableLevels, setAvailableLevels] = useState<MonsterLevel[]>([])

  // State for managing trait and mood editing
  const [disabledTraits, setDisabledTraits] = useState<{
    [key: number]: boolean
  }>({})
  const [disabledMoods, setDisabledMoods] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingTrait, setIsAddingTrait] = useState<boolean>(false)
  const [isAddingMood, setIsAddingMood] = useState<boolean>(false)

  // Handle monster selection and auto-set type
  const handleMonsterSelection = (monsterId: string) => {
    setSelectedMonsterId(monsterId)

    // Determine if it's a quarry, nemesis, or custom monster
    const isQuarry = availableMonsters.some(
      (monster) => monster.id === monsterId && monster.source === 'quarry'
    )
    const isNemesis = availableMonsters.some(
      (monster) => monster.id === monsterId && monster.source === 'nemesis'
    )

    let monsterData = null
    let monsterType: MonsterType | undefined

    if (isQuarry) {
      monsterType = MonsterType.QUARRY
      const quarryId = parseInt(monsterId.replace('quarry-', ''))
      monsterData = QUARRIES[quarryId as keyof typeof QUARRIES]?.main
    } else if (isNemesis) {
      monsterType = MonsterType.NEMESIS
      const nemesisId = parseInt(monsterId.replace('nemesis-', ''))
      monsterData = NEMESES[nemesisId as keyof typeof NEMESES]?.main
    } else {
      // Custom monster - look up type
      const customMonster = availableMonsters.find((m) => m.id === monsterId)
      if (customMonster) monsterType = customMonster.type
    }

    if (monsterType) setSelectedMonsterType(monsterType)

    if (!monsterData) return

    // Determine which levels are available for this monster
    const levels: MonsterLevel[] = []
    if (monsterData.level1) levels.push(MonsterLevel.LEVEL_1)
    if (monsterData.level2) levels.push(MonsterLevel.LEVEL_2)
    if (monsterData.level3) levels.push(MonsterLevel.LEVEL_3)
    if (monsterData.level4) levels.push(MonsterLevel.LEVEL_4)
    setAvailableLevels(levels)

    // Set to first available level or keep current if valid
    const currentLevelValid = levels.includes(selectedMonsterLevel)
    const levelToUse = currentLevelValid ? selectedMonsterLevel : levels[0]

    if (!levelToUse) return

    setSelectedMonsterLevel(levelToUse)
    const levelData = monsterData[`level${levelToUse}`]

    if (levelData) {
      // Auto-populate all form fields with monster data
      setSelectedMonsterAccuracyTokens(levelData.accuracyTokens ?? 0)
      setSelectedMonsterAIDeckACards(levelData.aiDeck?.advanced ?? 0)
      setSelectedMonsterAIDeckBCards(levelData.aiDeck?.basic ?? 0)
      setSelectedMonsterAIDeckLCards(levelData.aiDeck?.legendary ?? 0)
      setSelectedMonsterAIDeckOCards(levelData.aiDeck?.overtone ?? 0)
      setSelectedMonsterDamage(levelData.damage ?? 0)
      setSelectedMonsterDamageTokens(levelData.damageTokens ?? 0)
      setSelectedMonsterEvasionTokens(levelData.evasionTokens ?? 0)
      setSelectedMonsterLuckTokens(levelData.luckTokens ?? 0)
      setSelectedMonsterMoods(levelData.moods ?? [])
      setSelectedMonsterMovement(levelData.movement ?? 6)
      setSelectedMonsterMovementTokens(levelData.movementTokens ?? 0)
      setSelectedMonsterSpeed(levelData.speed ?? 0)
      setSelectedMonsterSpeedTokens(levelData.speedTokens ?? 0)
      setSelectedMonsterStrengthTokens(levelData.strengthTokens ?? 0)
      setSelectedMonsterToughness(levelData.toughness ?? 6)
      setSelectedMonsterTraits(levelData.traits ?? [])

      // Set disabled state for auto-populated traits and moods
      const traitsDisabled: { [key: number]: boolean } = {}
      ;(levelData.traits ?? []).forEach((_, index) => {
        traitsDisabled[index] = true
      })
      setDisabledTraits(traitsDisabled)

      const moodsDisabled: { [key: number]: boolean } = {}
      ;(levelData.moods ?? []).forEach((_, index) => {
        moodsDisabled[index] = true
      })
      setDisabledMoods(moodsDisabled)
    }
  }

  // Handle level change and auto-populate form
  const handleLevelChange = (level: MonsterLevel) => {
    if (!selectedMonsterId) return

    let monsterData = null

    // Determine monster source and get data
    if (selectedMonsterId.startsWith('quarry-')) {
      const quarryId = parseInt(selectedMonsterId.replace('quarry-', ''))
      monsterData = QUARRIES[quarryId as keyof typeof QUARRIES]?.main
    } else if (selectedMonsterId.startsWith('nemesis-')) {
      const nemesisId = parseInt(selectedMonsterId.replace('nemesis-', ''))
      monsterData = NEMESES[nemesisId as keyof typeof NEMESES]?.main
    }

    if (!monsterData) return
    if (!level) return

    const levelData = monsterData[`level${level}`]

    if (levelData) {
      // Auto-populate all form fields with monster data
      setSelectedMonsterAccuracyTokens(levelData.accuracyTokens ?? 0)
      setSelectedMonsterAIDeckACards(levelData.aiDeck?.advanced ?? 0)
      setSelectedMonsterAIDeckBCards(levelData.aiDeck?.basic ?? 0)
      setSelectedMonsterAIDeckLCards(levelData.aiDeck?.legendary ?? 0)
      setSelectedMonsterAIDeckOCards(levelData.aiDeck?.overtone ?? 0)
      setSelectedMonsterDamage(levelData.damage ?? 0)
      setSelectedMonsterDamageTokens(levelData.damageTokens ?? 0)
      setSelectedMonsterEvasionTokens(levelData.evasionTokens ?? 0)
      setSelectedMonsterLevel(level)
      setSelectedMonsterLuckTokens(levelData.luckTokens ?? 0)
      setSelectedMonsterMoods(levelData.moods ?? [])
      setSelectedMonsterMovement(levelData.movement ?? 6)
      setSelectedMonsterMovementTokens(levelData.movementTokens ?? 0)
      setSelectedMonsterSpeed(levelData.speed ?? 0)
      setSelectedMonsterSpeedTokens(levelData.speedTokens ?? 0)
      setSelectedMonsterStrengthTokens(levelData.strengthTokens ?? 0)
      setSelectedMonsterToughness(levelData.toughness ?? 6)
      setSelectedMonsterTraits(levelData.traits ?? [])

      // Set disabled state for auto-populated traits and moods
      const traitsDisabled: { [key: number]: boolean } = {}
      ;(levelData.traits ?? []).forEach((_, index) => {
        traitsDisabled[index] = true
      })
      setDisabledTraits(traitsDisabled)

      const moodsDisabled: { [key: number]: boolean } = {}
      ;(levelData.moods ?? []).forEach((_, index) => {
        moodsDisabled[index] = true
      })
      setDisabledMoods(moodsDisabled)
    }
  }

  // Get available survivors for this settlement (exclude dead/retired)
  const availableSurvivors = useMemo(
    () =>
      campaign.survivors
        ? campaign.survivors.filter(
            (survivor) =>
              survivor.settlementId === selectedSettlement?.id &&
              !survivor.dead &&
              !survivor.retired
          )
        : [],
    [campaign.survivors, selectedSettlement?.id]
  )

  // Get all survivors for this settlement (including dead ones) for messaging
  const allSettlementSurvivors = useMemo(
    () =>
      campaign.survivors
        ? campaign.survivors.filter(
            (survivor) => survivor.settlementId === selectedSettlement?.id
          )
        : [],
    [campaign.survivors, selectedSettlement?.id]
  )

  // Get available monsters (quarries, nemeses, and custom monsters)
  const availableMonsters: Array<{
    id: string
    name: string
    node?: string
    type: MonsterType
    source: 'quarry' | 'nemesis' | 'custom'
  }> = []

  // Add unlocked quarries
  if (selectedSettlement?.quarries)
    selectedSettlement.quarries
      .filter((q) => q.unlocked)
      .forEach((quarry) => {
        const quarryData = QUARRIES[quarry.id as keyof typeof QUARRIES]?.main
        if (quarryData) {
          availableMonsters.push({
            id: `quarry-${quarry.id}`,
            name: quarryData.name,
            node: quarryData.node,
            type: MonsterType.QUARRY,
            source: 'quarry'
          })
        }
      })

  // Add unlocked nemeses
  if (selectedSettlement?.nemeses)
    selectedSettlement.nemeses
      .filter((n) => n.unlocked)
      .forEach((nemesis) => {
        const nemesisData = NEMESES[nemesis.id as keyof typeof NEMESES]?.main
        if (nemesisData) {
          availableMonsters.push({
            id: `nemesis-${nemesis.id}`,
            name: nemesisData.name,
            node: nemesisData.node,
            type: MonsterType.NEMESIS,
            source: 'nemesis'
          })
        }
      })

  // Add custom monsters
  try {
    if (campaign.customMonsters)
      Object.entries(campaign.customMonsters).forEach(
        ([id, monsterWrapper]) => {
          const monsterData = monsterWrapper.main
          availableMonsters.push({
            id: `custom-${id}`,
            name: monsterData.name,
            node: monsterData.node,
            type: monsterData.type,
            source: 'custom'
          })
        }
      )
  } catch (error) {
    console.error('Failed to load custom monsters:', error)
  }

  /**
   * Trait Operations
   */

  const onRemoveTrait = (index: number) => {
    const currentTraits = [...selectedMonsterTraits]
    currentTraits.splice(index, 1)

    setDisabledTraits((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })

    setSelectedMonsterTraits(currentTraits)
  }

  const onSaveTrait = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('trait'))

    const updatedTraits = [...selectedMonsterTraits]

    if (i !== undefined) {
      updatedTraits[i] = value
      setDisabledTraits((prev) => ({ ...prev, [i]: true }))
    } else {
      updatedTraits.push(value)
      setDisabledTraits((prev) => ({
        ...prev,
        [updatedTraits.length - 1]: true
      }))
    }

    setSelectedMonsterTraits(updatedTraits)
    setIsAddingTrait(false)
  }

  /**
   * Mood Operations
   */

  const onRemoveMood = (index: number) => {
    const currentMoods = [...selectedMonsterMoods]
    currentMoods.splice(index, 1)

    setDisabledMoods((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })

    setSelectedMonsterMoods(currentMoods)
  }

  const onSaveMood = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('mood'))

    const updatedMoods = [...selectedMonsterMoods]

    if (i !== undefined) {
      updatedMoods[i] = value
      setDisabledMoods((prev) => ({ ...prev, [i]: true }))
    } else {
      updatedMoods.push(value)
      setDisabledMoods((prev) => ({
        ...prev,
        [updatedMoods.length - 1]: true
      }))
    }

    setSelectedMonsterMoods(updatedMoods)
    setIsAddingMood(false)
  }

  // Create Showdown
  const handleCreateShowdown = () => {
    // Check if there's already an active hunt for this settlement
    if (selectedHunt && selectedHunt.settlementId === selectedSettlement?.id)
      return toast.error(HUNT_ALREADY_ACTIVE_ERROR_MESSAGE())

    if (
      !selectedSettlement ||
      !selectedMonsterId ||
      !selectedMonsterType ||
      selectedSurvivors.length === 0
    )
      return toast.error(ERROR_MESSAGE())

    // Validate scout selection if settlement uses scouts
    if (selectedSettlement.usesScouts && !selectedScout)
      return toast.error(SCOUT_REQUIRED_MESSAGE('showdown'))

    // Validate that scout is not also a selected survivor
    if (
      selectedSettlement.usesScouts &&
      selectedScout &&
      selectedSurvivors.includes(selectedScout)
    )
      return toast.error(SCOUT_CONFLICT_MESSAGE())

    const survivorDetails: SurvivorShowdownDetails[] = selectedSurvivors.map(
      (survivorId) => ({
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
        color: ColorChoice.SLATE,
        deflectTokens: 0,
        evasionTokens: 0,
        id: survivorId,
        insanityTokens: 0,
        knockedDown: false,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        priorityTarget: false,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })
    )

    if (selectedScout)
      survivorDetails.push({
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
        color: ColorChoice.SLATE,
        deflectTokens: 0,
        evasionTokens: 0,
        id: selectedScout,
        insanityTokens: 0,
        knockedDown: false,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        priorityTarget: false,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })

    // Save as partial data that will be merged by the hook
    const showdownData: Showdown = {
      ambush: AmbushType.NONE,
      id: getNextShowdownId(campaign),
      monster: {
        accuracy: 0,
        accuracyTokens: selectedMonsterAccuracyTokens,
        aiDeck: {
          basic: selectedMonsterAIDeckBCards,
          advanced: selectedMonsterAIDeckACards,
          legendary: selectedMonsterAIDeckLCards,
          overtone: selectedMonsterAIDeckOCards
        },
        aiDeckRemaining:
          selectedMonsterAIDeckACards +
          selectedMonsterAIDeckBCards +
          selectedMonsterAIDeckLCards +
          selectedMonsterAIDeckOCards,
        damage: selectedMonsterDamage,
        damageTokens: selectedMonsterDamageTokens,
        evasion: 0,
        evasionTokens: selectedMonsterEvasionTokens,
        knockedDown: false,
        level: selectedMonsterLevel,
        luck: 0,
        luckTokens: selectedMonsterLuckTokens,
        moods: selectedMonsterMoods,
        movement: selectedMonsterMovement,
        movementTokens: selectedMonsterMovementTokens,
        name:
          availableMonsters.find((m) => m.id === selectedMonsterId)?.name || '',
        notes: '',
        speed: selectedMonsterSpeed,
        speedTokens: selectedMonsterSpeedTokens,
        strength: 0,
        strengthTokens: selectedMonsterStrengthTokens,
        toughness: selectedMonsterToughness,
        traits: selectedMonsterTraits,
        type: selectedMonsterType,
        wounds: 0
      },
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivors: selectedSurvivors,
      turn: {
        currentTurn: startingTurn,
        monsterState: { aiCardDrawn: false },
        survivorStates: survivorDetails.map((survivor) => ({
          activationUsed: false,
          id: survivor.id,
          movementUsed: false
        }))
      }
    }

    const monsterName =
      availableMonsters.find((m) => m.id === selectedMonsterId)?.name || ''

    saveSelectedShowdown(
      showdownData,
      SHOWDOWN_CREATED_MESSAGE(monsterName, selectedMonsterType)
    )

    // Reset form
    setSelectedMonsterAccuracyTokens(0)
    setSelectedMonsterAIDeckACards(0)
    setSelectedMonsterAIDeckBCards(0)
    setSelectedMonsterAIDeckLCards(0)
    setSelectedMonsterAIDeckOCards(0)
    setSelectedMonsterDamage(0)
    setSelectedMonsterDamageTokens(0)
    setSelectedMonsterEvasionTokens(0)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setSelectedMonsterLuckTokens(0)
    setSelectedMonsterMoods([])
    setSelectedMonsterMovement(6)
    setSelectedMonsterMovementTokens(0)
    setSelectedMonsterId('')
    setSelectedMonsterSpeed(0)
    setSelectedMonsterSpeedTokens(0)
    setSelectedMonsterStrengthTokens(0)
    setSelectedMonsterToughness(6)
    setSelectedMonsterTraits([])
    setSelectedMonsterType(undefined)
    setSelectedSurvivors([])
    setSelectedScout(null)
    setStartingTurn(TurnType.MONSTER)
    setAvailableLevels([])
    setDisabledTraits({})
    setDisabledMoods({})
    setIsAddingTrait(false)
    setIsAddingMood(false)
    setSelectedShowdown(showdownData)
  }

  return (
    <Card className="w-[400px] mt-10 mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SkullIcon className="h-5 w-5" />
          Begin Showdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        {/* Showdown Monster */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            Monster
          </Label>
          <Select
            value={selectedMonsterId}
            onValueChange={handleMonsterSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a monster..." />
            </SelectTrigger>
            <SelectContent>
              {availableMonsters.map((monster) => (
                <SelectItem key={monster.id} value={monster.id}>
                  {monster.name}
                  {monster.node && ` (${monster.node})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monster Level */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            Level
          </Label>
          <Select
            value={selectedMonsterLevel}
            onValueChange={handleLevelChange}
            disabled={availableLevels.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose level..." />
            </SelectTrigger>
            <SelectContent>
              {availableLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  Level {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monster Type */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            Type
          </Label>
          <div className="w-full px-3 py-2 text-sm border rounded-md bg-muted">
            {selectedMonsterType || 'Select a monster'}
          </div>
        </div>

        {/* AI Deck */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            AI Deck
          </Label>

          <div className="flex gap-2 w-full">
            <div className="flex-1 space-y-1">
              <Label htmlFor="monster-ai-deck-a" className="text-xs text-center block">
                A Cards
              </Label>
              <NumericInput
                label="A Cards"
                value={selectedMonsterAIDeckACards}
                onChange={setSelectedMonsterAIDeckACards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-a"
                  type="number"
                  value={selectedMonsterAIDeckACards}
                  onChange={(e) =>
                    setSelectedMonsterAIDeckACards(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="monster-ai-deck-b" className="text-xs text-center block">
                B Cards
              </Label>
              <NumericInput
                label="B Cards"
                value={selectedMonsterAIDeckBCards}
                onChange={setSelectedMonsterAIDeckBCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-b"
                  type="number"
                  value={selectedMonsterAIDeckBCards}
                  onChange={(e) =>
                    setSelectedMonsterAIDeckBCards(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="monster-ai-deck-l" className="text-xs text-center block">
                L Cards
              </Label>
              <NumericInput
                label="L Cards"
                value={selectedMonsterAIDeckLCards}
                onChange={setSelectedMonsterAIDeckLCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-l"
                  type="number"
                  value={selectedMonsterAIDeckLCards}
                  onChange={(e) =>
                    setSelectedMonsterAIDeckLCards(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="monster-ai-deck-o" className="text-xs text-center block">
                O Cards
              </Label>
              <NumericInput
                label="O Cards"
                value={selectedMonsterAIDeckOCards}
                onChange={setSelectedMonsterAIDeckOCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-o"
                  type="number"
                  value={selectedMonsterAIDeckOCards}
                  onChange={(e) =>
                    setSelectedMonsterAIDeckOCards(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Monster Attributes */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Attributes
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Movement */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-movement"
              className="text-xs justify-center">
              Movement
            </Label>

            <NumericInput
              label="Movement"
              value={selectedMonsterMovement}
              onChange={setSelectedMonsterMovement}
              min={0}
              readOnly={false}>
              <Input
                id="monster-movement"
                type="number"
                value={selectedMonsterMovement}
                onChange={(e) =>
                  setSelectedMonsterMovement(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Toughness */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-toughness"
              className="text-xs justify-center">
              Toughness
            </Label>

            <NumericInput
              label="Toughness"
              value={selectedMonsterToughness}
              onChange={setSelectedMonsterToughness}
              min={0}
              readOnly={false}>
              <Input
                id="monster-toughness"
                type="number"
                value={selectedMonsterToughness}
                onChange={(e) =>
                  setSelectedMonsterToughness(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <Label htmlFor="monster-speed" className="text-xs justify-center">
              Speed
            </Label>

            <NumericInput
              label="Speed"
              value={selectedMonsterSpeed}
              onChange={setSelectedMonsterSpeed}
              min={0}
              readOnly={false}>
              <Input
                id="monster-speed"
                type="number"
                value={selectedMonsterSpeed}
                onChange={(e) =>
                  setSelectedMonsterSpeed(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Damage */}
          <div className="space-y-1">
            <Label htmlFor="monster-damage" className="text-xs justify-center">
              Damage
            </Label>

            <NumericInput
              label="Damage"
              value={selectedMonsterDamage}
              onChange={setSelectedMonsterDamage}
              min={0}
              readOnly={false}>
              <Input
                id="monster-damage"
                type="number"
                value={selectedMonsterDamage}
                onChange={(e) =>
                  setSelectedMonsterDamage(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Monster Tokens */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Tokens
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Movement */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-movement-tokens"
              className="text-xs justify-center">
              Movement
            </Label>

            <NumericInput
              label="Movement Tokens"
              value={selectedMonsterMovementTokens}
              onChange={setSelectedMonsterMovementTokens}
              readOnly={false}>
              <Input
                id="monster-movement-tokens"
                type="number"
                value={selectedMonsterMovementTokens}
                onChange={(e) =>
                  setSelectedMonsterMovementTokens(
                    parseInt(e.target.value) || 0
                  )
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-speed-tokens"
              className="text-xs justify-center">
              Speed
            </Label>

            <NumericInput
              label="Speed Tokens"
              value={selectedMonsterSpeedTokens}
              onChange={setSelectedMonsterSpeedTokens}
              readOnly={false}>
              <Input
                id="monster-speed-tokens"
                type="number"
                value={selectedMonsterSpeedTokens}
                onChange={(e) =>
                  setSelectedMonsterSpeedTokens(parseInt(e.target.value) || 0)
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Damage */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-damage-tokens"
              className="text-xs justify-center">
              Damage
            </Label>

            <NumericInput
              label="Damage Tokens"
              value={selectedMonsterDamageTokens}
              onChange={setSelectedMonsterDamageTokens}
              readOnly={false}>
              <Input
                id="monster-damage-tokens"
                type="number"
                value={selectedMonsterDamageTokens}
                onChange={(e) =>
                  setSelectedMonsterDamageTokens(parseInt(e.target.value) || 0)
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Accuracy */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-accuracy-tokens"
              className="text-xs justify-center">
              Accuracy
            </Label>

            <NumericInput
              label="Accuracy Tokens"
              value={selectedMonsterAccuracyTokens}
              onChange={setSelectedMonsterAccuracyTokens}
              readOnly={false}>
              <Input
                id="monster-accuracy-tokens"
                type="number"
                value={selectedMonsterAccuracyTokens}
                onChange={(e) =>
                  setSelectedMonsterAccuracyTokens(
                    parseInt(e.target.value) || 0
                  )
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Strength */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-strength-tokens"
              className="text-xs justify-center">
              Strength
            </Label>

            <NumericInput
              label="Strength Tokens"
              value={selectedMonsterStrengthTokens}
              onChange={setSelectedMonsterStrengthTokens}
              readOnly={false}>
              <Input
                id="monster-strength-tokens"
                type="number"
                value={selectedMonsterStrengthTokens}
                onChange={(e) =>
                  setSelectedMonsterStrengthTokens(
                    parseInt(e.target.value) || 0
                  )
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Evasion */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-evasion-tokens"
              className="text-xs justify-center">
              Evasion
            </Label>

            <NumericInput
              label="Evasion Tokens"
              value={selectedMonsterEvasionTokens}
              onChange={setSelectedMonsterEvasionTokens}
              readOnly={false}>
              <Input
                id="monster-evasion-tokens"
                type="number"
                value={selectedMonsterEvasionTokens}
                onChange={(e) =>
                  setSelectedMonsterEvasionTokens(parseInt(e.target.value) || 0)
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Luck */}
          <div className="space-y-1">
            <Label
              htmlFor="monster-luck-tokens"
              className="text-xs justify-center">
              Luck
            </Label>

            <NumericInput
              label="Luck Tokens"
              value={selectedMonsterLuckTokens}
              onChange={setSelectedMonsterLuckTokens}
              readOnly={false}>
              <Input
                id="monster-luck-tokens"
                type="number"
                value={selectedMonsterLuckTokens}
                onChange={(e) =>
                  setSelectedMonsterLuckTokens(parseInt(e.target.value) || 0)
                }
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Monster Traits and Moods */}
        <TraitsMoods
          monster={{
            accuracy: 0,
            accuracyTokens: selectedMonsterAccuracyTokens,
            aiDeck: {
              basic: selectedMonsterAIDeckBCards,
              advanced: selectedMonsterAIDeckACards,
              legendary: selectedMonsterAIDeckLCards,
              overtone: selectedMonsterAIDeckOCards
            },
            aiDeckRemaining:
              selectedMonsterAIDeckACards +
              selectedMonsterAIDeckBCards +
              selectedMonsterAIDeckLCards +
              selectedMonsterAIDeckOCards,
            damage: selectedMonsterDamage,
            damageTokens: selectedMonsterDamageTokens,
            evasion: 0,
            evasionTokens: selectedMonsterEvasionTokens,
            knockedDown: false,
            level: selectedMonsterLevel,
            luck: 0,
            luckTokens: selectedMonsterLuckTokens,
            moods: selectedMonsterMoods,
            movement: selectedMonsterMovement,
            movementTokens: selectedMonsterMovementTokens,
            name:
              availableMonsters.find((m) => m.id === selectedMonsterId)?.name ||
              '',
            notes: '',
            speed: selectedMonsterSpeed,
            speedTokens: selectedMonsterSpeedTokens,
            strength: 0,
            strengthTokens: selectedMonsterStrengthTokens,
            toughness: selectedMonsterToughness,
            traits: selectedMonsterTraits,
            type: selectedMonsterType || MonsterType.QUARRY,
            wounds: 0
          }}
          disabledTraits={disabledTraits}
          disabledMoods={disabledMoods}
          isAddingTrait={isAddingTrait}
          isAddingMood={isAddingMood}
          setIsAddingTrait={setIsAddingTrait}
          setIsAddingMood={setIsAddingMood}
          onEditTrait={(index: number) =>
            setDisabledTraits((prev) => ({ ...prev, [index]: false }))
          }
          onSaveTrait={onSaveTrait}
          onRemoveTrait={onRemoveTrait}
          onEditMood={(index: number) =>
            setDisabledMoods((prev) => ({ ...prev, [index]: false }))
          }
          onSaveMood={onSaveMood}
          onRemoveMood={onRemoveMood}
        />

        <Separator className="my-2" />

        {/* Starting Turn Selection */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Starting Turn
          </h3>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Toggle
            pressed={startingTurn === TurnType.SURVIVORS}
            onPressedChange={() => setStartingTurn(TurnType.SURVIVORS)}
            variant="outline"
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Survivors
          </Toggle>
          <Toggle
            pressed={startingTurn === TurnType.MONSTER}
            onPressedChange={() => setStartingTurn(TurnType.MONSTER)}
            variant="outline"
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Monster
          </Toggle>
        </div>

        <Separator className="my-2" />

        {/* Survivor Selection */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Survivors
          </h3>
        </div>

        {/* Survivors */}
        <SurvivorSelectionDrawer
          title="Select Showdown Party"
          description="Up to 4 survivors may embark on a showdown."
          survivors={availableSurvivors}
          selectedSurvivors={selectedSurvivors}
          selectedScout={selectedScout}
          onSelectionChange={setSelectedSurvivors}
          maxSelection={4}
        />

        {/* Scout */}
        {selectedSettlement?.usesScouts && (
          <ScoutSelectionDrawer
            title="Select Scout"
            description="Choose a single scout. Their skills will help navigate the dangers ahead."
            survivors={availableSurvivors}
            selectedSurvivors={selectedSurvivors}
            selectedScout={selectedScout}
            onSelectionChange={setSelectedScout}
          />
        )}

        {availableSurvivors.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {allSettlementSurvivors.length === 0
              ? 'No survivors available. Create survivors first.'
              : 'All survivors are dead or retired.'}
          </p>
        )}

        {/* Begin Showdown Button */}
        <Button
          onClick={handleCreateShowdown}
          disabled={
            !selectedMonsterId ||
            !selectedMonsterType ||
            availableSurvivors.length === 0 ||
            selectedSurvivors.length === 0 ||
            (selectedSettlement?.usesScouts && !selectedScout)
          }
          className="w-full mt-2">
          Begin Showdown
        </Button>
      </CardContent>
    </Card>
  )
}
