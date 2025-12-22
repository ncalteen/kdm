'use client'

import { NumericInput } from '@/components/menu/numeric-input'
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
import { basicHuntBoard } from '@/lib/common'
import { ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_BEGINS_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE
} from '@/lib/messages'
import { QUARRIES } from '@/lib/monsters'
import { getNextHuntId } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt, HuntBoard, SurvivorHuntDetails } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { PawPrintIcon } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * Create Hunt Card Properties
 */
interface CreateHuntCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

/**
 * Create Hunt Card Component
 *
 * @param props Create Hunt Card Properties
 * @returns Create Hunt Card Component
 */
export function CreateHuntCard({
  campaign,
  saveSelectedHunt,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  setSelectedSurvivor
}: CreateHuntCardProps): ReactElement {
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
  const [selectedMonsterHuntBoard, setSelectedMonsterHuntBoard] =
    useState<HuntBoard>(basicHuntBoard)
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedMonsterLuckTokens, setSelectedMonsterLuckTokens] =
    useState<number>(0)
  const [selectedMonsterMoods, setSelectedMonsterMoods] = useState<string[]>([])
  const [selectedMonsterMovement, setSelectedMonsterMovement] =
    useState<number>(6)
  const [selectedMonsterMovementTokens, setSelectedMonsterMovementTokens] =
    useState<number>(0)
  const [selectedMonsterName, setSelectedMonsterName] = useState<string>('')
  const [selectedMonsterQuarryId, setSelectedMonsterQuarryId] = useState<
    number | null
  >(null)
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
  const [selectedMonsterWounds, setSelectedMonsterWounds] = useState<number>(0)

  const [monsterHuntPosition, setMonsterHuntPosition] = useState<number>(12)
  const [survivorHuntPosition, setSurvivorHuntPosition] = useState<number>(0)
  const [availableLevels, setAvailableLevels] = useState<MonsterLevel[]>([])

  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

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

  // Get available quarries (unlocked ones) and map to monster data
  const availableQuarries = useMemo(
    () =>
      selectedSettlement?.quarries
        ? selectedSettlement.quarries
            .filter((quarry) => quarry.unlocked)
            .map((quarry) => ({
              ...quarry,
              monsterData: QUARRIES[quarry.id as keyof typeof QUARRIES]?.main
            }))
            .filter((quarry) => quarry.monsterData) // Filter out any missing monster data
        : [],
    [selectedSettlement]
  )

  // Handle monster selection and auto-populate form
  const handleMonsterSelection = (quarryIdStr: string) => {
    const quarryId = parseInt(quarryIdStr)
    setSelectedMonsterQuarryId(quarryId)

    // Look up monster data from QUARRIES using the ID
    const monsterData = QUARRIES[quarryId as keyof typeof QUARRIES]?.main

    if (!monsterData) {
      console.error(
        'CreateHuntCard: Monster data not found for quarry ID:',
        quarryId
      )
      toast.error(
        'The darkness swallows this quarry. Its details cannot be found — check your custom monster data and try again.'
      )
      return
    }

    setSelectedMonsterName(monsterData.name)

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
      setSelectedMonsterHuntBoard(monsterData.huntBoard ?? basicHuntBoard)
      setSelectedMonsterLuckTokens(levelData.luckTokens ?? 0)
      setSelectedMonsterMoods(levelData.moods ?? [])
      setSelectedMonsterMovement(levelData.movement ?? 6)
      setSelectedMonsterMovementTokens(levelData.movementTokens ?? 0)
      setSelectedMonsterSpeed(levelData.speed ?? 0)
      setSelectedMonsterSpeedTokens(levelData.speedTokens ?? 0)
      setSelectedMonsterStrengthTokens(levelData.strengthTokens ?? 0)
      setSelectedMonsterToughness(levelData.toughness ?? 6)
      setSelectedMonsterType(MonsterType.QUARRY)
      setSelectedMonsterTraits(levelData.traits ?? [])
      setSelectedMonsterWounds(0)

      // Set hunt board positions
      setMonsterHuntPosition(levelData.huntPos ?? 12)
      setSurvivorHuntPosition(levelData.survivorHuntPos ?? 0)
    }
  }

  // Handle level change and auto-populate form
  const handleLevelChange = (level: MonsterLevel) => {
    if (!selectedMonsterQuarryId) return

    // Look up monster data from QUARRIES using the ID
    const monsterData =
      QUARRIES[selectedMonsterQuarryId as keyof typeof QUARRIES]?.main

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
      setSelectedMonsterHuntBoard(monsterData.huntBoard ?? basicHuntBoard)
      setSelectedMonsterLevel(level)
      setSelectedMonsterLuckTokens(levelData.luckTokens ?? 0)
      setSelectedMonsterMoods(levelData.moods ?? [])
      setSelectedMonsterMovement(levelData.movement ?? 6)
      setSelectedMonsterMovementTokens(levelData.movementTokens ?? 0)
      setSelectedMonsterSpeed(levelData.speed ?? 0)
      setSelectedMonsterSpeedTokens(levelData.speedTokens ?? 0)
      setSelectedMonsterStrengthTokens(levelData.strengthTokens ?? 0)
      setSelectedMonsterToughness(levelData.toughness ?? 6)
      setSelectedMonsterType(MonsterType.QUARRY)
      setSelectedMonsterTraits(levelData.traits ?? [])
      setSelectedMonsterWounds(0)

      // Set hunt board positions
      setMonsterHuntPosition(levelData.huntPos ?? 12)
      setSurvivorHuntPosition(levelData.survivorHuntPos ?? 0)
    }
  }

  // Handle monster selection and auto-populate form
  const handleCreateHunt = () => {
    if (
      selectedShowdown &&
      selectedShowdown.settlementId === selectedSettlement?.id
    )
      return toast.error(SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE())

    if (
      !selectedSettlement ||
      !selectedMonsterName ||
      !selectedMonsterType ||
      selectedSurvivors.length === 0
    )
      return toast.error(ERROR_MESSAGE())

    // Validate scout selection if settlement uses scouts
    if (selectedSettlement.usesScouts && !selectedScout)
      return toast.error(SCOUT_REQUIRED_MESSAGE('hunt'))

    // Validate that scout is not also a selected survivor
    if (
      selectedSettlement.usesScouts &&
      selectedScout &&
      selectedSurvivors.includes(selectedScout)
    )
      return toast.error(SCOUT_CONFLICT_MESSAGE())

    const survivorDetails: SurvivorHuntDetails[] = selectedSurvivors.map(
      (survivorId) => ({
        accuracyTokens: 0,
        color: ColorChoice.SLATE,
        evasionTokens: 0,
        id: survivorId,
        insanityTokens: 0,
        luckTokens: 0,
        notes: '',
        movementTokens: 0,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })
    )

    if (selectedScout)
      survivorDetails.push({
        accuracyTokens: 0,
        color: ColorChoice.SLATE,
        evasionTokens: 0,
        id: selectedScout,
        insanityTokens: 0,
        luckTokens: 0,
        notes: '',
        movementTokens: 0,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })

    // Save as partial data that will be merged by the hook
    const huntData: Hunt = {
      id: getNextHuntId(campaign),
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
          selectedMonsterAIDeckBCards +
          selectedMonsterAIDeckACards +
          selectedMonsterAIDeckLCards +
          selectedMonsterAIDeckOCards,
        damage: selectedMonsterDamage,
        damageTokens: selectedMonsterDamageTokens,
        evasion: 0,
        evasionTokens: selectedMonsterEvasionTokens,
        huntBoard: selectedMonsterHuntBoard,
        knockedDown: false,
        level: selectedMonsterLevel,
        luck: 0,
        luckTokens: selectedMonsterLuckTokens,
        moods: selectedMonsterMoods,
        movement: selectedMonsterMovement,
        movementTokens: selectedMonsterMovementTokens,
        name: selectedMonsterName,
        notes: '',
        speed: selectedMonsterSpeed,
        speedTokens: selectedMonsterSpeedTokens,
        strength: 0,
        strengthTokens: selectedMonsterStrengthTokens,
        toughness: selectedMonsterToughness,
        traits: selectedMonsterTraits,
        type: selectedMonsterType,
        wounds: selectedMonsterWounds
      },
      monsterPosition: monsterHuntPosition,
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivorPosition: survivorHuntPosition,
      survivors: selectedSurvivors
    }

    saveSelectedHunt(huntData, HUNT_BEGINS_MESSAGE(selectedMonsterName))

    // Reset form
    setSelectedMonsterAccuracyTokens(0)
    setSelectedMonsterAIDeckACards(0)
    setSelectedMonsterAIDeckBCards(0)
    setSelectedMonsterAIDeckLCards(0)
    setSelectedMonsterAIDeckOCards(0)
    setSelectedMonsterDamage(0)
    setSelectedMonsterDamageTokens(0)
    setSelectedMonsterEvasionTokens(0)
    setSelectedMonsterHuntBoard(basicHuntBoard)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setSelectedMonsterLuckTokens(0)
    setSelectedMonsterMoods([])
    setSelectedMonsterMovement(6)
    setSelectedMonsterMovementTokens(0)
    setSelectedMonsterName('')
    setSelectedMonsterQuarryId(null)
    setSelectedMonsterSpeed(0)
    setSelectedMonsterSpeedTokens(0)
    setSelectedMonsterStrengthTokens(0)
    setSelectedMonsterToughness(6)
    setSelectedMonsterTraits([])
    setSelectedMonsterType(undefined)
    setSelectedMonsterWounds(0)
    setMonsterHuntPosition(12)
    setSurvivorHuntPosition(0)
    setAvailableLevels([])
    setSelectedSurvivors([])
    setSelectedSurvivor(null)
    setSelectedScout(null)
    setSelectedHunt(huntData)
  }

  return (
    <Card className="w-[400px] mt-10 mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PawPrintIcon className="h-5 w-5" />
          Begin Hunt
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 w-full">
        {/* Hunt Quarry */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            Quarry
          </Label>

          <Select
            value={selectedMonsterQuarryId?.toString() || ''}
            onValueChange={handleMonsterSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a quarry..." />
            </SelectTrigger>

            <SelectContent>
              {availableQuarries.map((quarry) => (
                <SelectItem key={quarry.id} value={quarry.id.toString()}>
                  {quarry.monsterData.name} ({quarry.monsterData.node})
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
              <Label
                htmlFor="monster-ai-deck-a"
                className="text-xs text-center block">
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
                    setSelectedMonsterAIDeckACards(
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-b"
                className="text-xs text-center block">
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
                    setSelectedMonsterAIDeckBCards(
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-l"
                className="text-xs text-center block">
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
                    setSelectedMonsterAIDeckLCards(
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className="text-center no-spinners"
                />
              </NumericInput>
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-o"
                className="text-xs text-center block">
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
                    setSelectedMonsterAIDeckOCards(
                      parseInt(e.target.value) || 0
                    )
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

        {/* Survivor Selection */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Survivors
          </h3>
        </div>

        {/* Survivors */}
        <SurvivorSelectionDrawer
          title="Select Hunt Party"
          description="Up to 4 survivors may embark on a hunt."
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

        {/* Begin Hunt Button */}
        <Button
          onClick={handleCreateHunt}
          disabled={
            !selectedMonsterName ||
            !selectedMonsterType ||
            availableSurvivors.length === 0 ||
            selectedSurvivors.length === 0 ||
            (selectedSettlement?.usesScouts && !selectedScout)
          }
          className="w-full mt-2">
          Begin Hunt
        </Button>
      </CardContent>
    </Card>
  )
}
