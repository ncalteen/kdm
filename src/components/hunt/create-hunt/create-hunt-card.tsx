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
import { ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_BEGINS_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE
} from '@/lib/messages'
import { getNextHuntId } from '@/lib/utils'
import { Hunt, SurvivorHuntDetails } from '@/schemas/hunt'
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
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Create Hunt Card Component
 *
 * @param props Create Hunt Card Properties
 * @returns Create Hunt Card Component
 */
export function CreateHuntCard({
  saveSelectedHunt,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  survivors
}: CreateHuntCardProps): ReactElement {
  const [selectedMonsterAccuracyTokens, setSelectedMonsterAccuracyTokens] =
    useState<number>(0)
  const [selectedMonsterAIDeckSize, setSelectedMonsterAIDeckSize] =
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
  const [selectedMonsterName, setSelectedMonsterName] = useState<string>('')
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

  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

  // Handle monster selection and auto-set type
  const handleMonsterSelection = (monsterName: string) => {
    setSelectedMonsterName(monsterName)

    // Determine if it's a quarry or nemesis
    const isQuarry = availableQuarries.some(
      (quarry) => quarry.name === monsterName
    )
    setSelectedMonsterType(isQuarry ? MonsterType.QUARRY : MonsterType.NEMESIS)
  }

  // Get available survivors for this settlement (exclude dead/retired)
  const availableSurvivors = useMemo(
    () =>
      survivors
        ? survivors.filter(
            (survivor) =>
              survivor.settlementId === selectedSettlement?.id &&
              !survivor.dead &&
              !survivor.retired
          )
        : [],
    [survivors, selectedSettlement?.id]
  )

  // Get all survivors for this settlement (including dead ones) for messaging
  const allSettlementSurvivors = useMemo(
    () =>
      survivors
        ? survivors.filter(
            (survivor) => survivor.settlementId === selectedSettlement?.id
          )
        : [],
    [survivors, selectedSettlement?.id]
  )

  // Get available quarries (unlocked ones)
  const availableQuarries = selectedSettlement?.quarries
    ? selectedSettlement.quarries.filter((quarry) => quarry.unlocked)
    : []

  // Create Hunt
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
      id: getNextHuntId(),
      monster: {
        accuracy: 0,
        accuracyTokens: selectedMonsterAccuracyTokens,
        aiDeckSize: selectedMonsterAIDeckSize,
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
      monsterPosition: 12,
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivorPosition: 0,
      survivors: selectedSurvivors
    }

    saveSelectedHunt(huntData, HUNT_BEGINS_MESSAGE(selectedMonsterName))

    // Reset form
    setSelectedMonsterAccuracyTokens(0)
    setSelectedMonsterAIDeckSize(0)
    setSelectedMonsterDamage(0)
    setSelectedMonsterDamageTokens(0)
    setSelectedMonsterEvasionTokens(0)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setSelectedMonsterLuckTokens(0)
    setSelectedMonsterMoods([])
    setSelectedMonsterMovement(6)
    setSelectedMonsterMovementTokens(0)
    setSelectedMonsterName('')
    setSelectedMonsterSpeed(0)
    setSelectedMonsterSpeedTokens(0)
    setSelectedMonsterStrengthTokens(0)
    setSelectedMonsterToughness(6)
    setSelectedMonsterTraits([])
    setSelectedMonsterType(undefined)
    setSelectedMonsterWounds(0)
    setSelectedSurvivors([])
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
            value={selectedMonsterName}
            onValueChange={handleMonsterSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a quarry..." />
            </SelectTrigger>

            <SelectContent>
              {availableQuarries.map((quarry) => (
                <SelectItem key={quarry.name} value={quarry.name}>
                  {quarry.name} ({quarry.node})
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
            onValueChange={(value: MonsterLevel) =>
              setSelectedMonsterLevel(value)
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose level..." />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
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

        {/* AI Deck Size */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            AI Deck Size
          </Label>

          <NumericInput
            label="AI Deck Size"
            value={selectedMonsterAIDeckSize}
            onChange={setSelectedMonsterAIDeckSize}
            min={0}
            readOnly={false}>
            <Input
              id="monster-ai-deck-size"
              type="number"
              value={selectedMonsterAIDeckSize}
              onChange={(e) =>
                setSelectedMonsterAIDeckSize(parseInt(e.target.value) || 0)
              }
              min="0"
              className="text-center no-spinners"
            />
          </NumericInput>
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
