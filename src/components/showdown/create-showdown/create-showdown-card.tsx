'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { ScoutSelectionDrawer } from '@/components/showdown/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/showdown/survivor-selection/survivor-selection-drawer'
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
import {
  AmbushType,
  ColorChoice,
  MonsterLevel,
  MonsterType,
  TurnType
} from '@/lib/enums'
import { getNextShowdownId } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { SkullIcon } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * Create Showdown Card Properties
 */
interface CreateShowdownCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Create Showdown Card Component
 *
 * @param props Create Showdown Card Properties
 * @returns Create Showdown Card Component
 */
export function CreateShowdownCard({
  saveSelectedShowdown,
  selectedSettlement,
  setSelectedShowdown,
  survivors
}: CreateShowdownCardProps): ReactElement {
  const [selectedMonsterAccuracy, setSelectedMonsterAccuracy] =
    useState<number>(0)
  const [selectedMonsterAIDeckSize, setSelectedMonsterAIDeckSize] =
    useState<number>(0)
  const [selectedMonsterEvasion, setSelectedMonsterEvasion] =
    useState<number>(0)
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedMonsterLuck, setSelectedMonsterLuck] = useState<number>(0)
  const [selectedMonsterMoods, setSelectedMonsterMoods] = useState<string[]>([])
  const [selectedMonsterMovement, setSelectedMonsterMovement] =
    useState<number>(6)
  const [selectedMonsterName, setSelectedMonsterName] = useState<string>('')
  const [selectedMonsterSpeed, setSelectedMonsterSpeed] = useState<number>(0)
  const [selectedMonsterStrength, setSelectedMonsterStrength] =
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
  const availableQuarries = useMemo(
    () =>
      selectedSettlement?.quarries
        ? selectedSettlement.quarries.filter((quarry) => quarry.unlocked)
        : [],
    [selectedSettlement?.quarries]
  )

  // Get available nemeses (unlocked ones)
  const availableNemeses = useMemo(
    () =>
      selectedSettlement?.nemeses
        ? selectedSettlement.nemeses.filter((nemesis) => nemesis.unlocked)
        : [],
    [selectedSettlement?.nemeses]
  )

  // Create Showdown
  const handleCreateShowdown = () => {
    if (
      !selectedSettlement ||
      !selectedMonsterName ||
      !selectedMonsterType ||
      selectedSurvivors.length === 0
    )
      return toast.error('The darkness swallows your words. Please try again.')

    // Validate scout selection if settlement uses scouts
    if (selectedSettlement.usesScouts && !selectedScout)
      return toast.error('A scout must be selected for the showdown.')

    // Validate that scout is not also a selected survivor
    if (
      selectedSettlement.usesScouts &&
      selectedScout &&
      selectedSurvivors.includes(selectedScout)
    )
      return toast.error(
        'The selected scout cannot also be one of the selected survivors for the showdown.'
      )

    const survivorDetails = selectedSurvivors.map((survivorId) => ({
      id: survivorId,
      color: ColorChoice.SLATE,
      notes: ''
    }))

    if (selectedScout)
      survivorDetails.push({
        id: selectedScout,
        color: ColorChoice.SLATE,
        notes: ''
      })

    // Save as partial data that will be merged by the hook
    const showdownData: Showdown = {
      ambush: AmbushType.NONE,
      id: getNextShowdownId(),
      monster: {
        accuracy: selectedMonsterAccuracy,
        aiDeckSize: selectedMonsterAIDeckSize,
        evasion: selectedMonsterEvasion,
        knockedDown: false,
        level: selectedMonsterLevel,
        luck: selectedMonsterLuck,
        moods: selectedMonsterMoods,
        movement: selectedMonsterMovement,
        name: selectedMonsterName,
        speed: selectedMonsterSpeed,
        strength: selectedMonsterStrength,
        toughness: selectedMonsterToughness,
        traits: selectedMonsterTraits,
        type: selectedMonsterType,
        wounds: selectedMonsterWounds
      },
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivors: selectedSurvivors,
      turn: {
        currentTurn: TurnType.MONSTER,
        round: 1,
        survivorStates: []
      }
    }

    saveSelectedShowdown(
      showdownData,
      `The showdown against ${selectedMonsterName} begins. ${selectedMonsterType === MonsterType.QUARRY ? 'Survivors prepare themselves.' : 'Survivors must defend their home.'}`
    )

    // Reset form
    setSelectedMonsterAccuracy(0)
    setSelectedMonsterAIDeckSize(0)
    setSelectedMonsterEvasion(0)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setSelectedMonsterLuck(0)
    setSelectedMonsterMoods([])
    setSelectedMonsterMovement(6)
    setSelectedMonsterName('')
    setSelectedMonsterSpeed(0)
    setSelectedMonsterStrength(0)
    setSelectedMonsterToughness(6)
    setSelectedMonsterTraits([])
    setSelectedMonsterType(undefined)
    setSelectedMonsterWounds(0)
    setSelectedSurvivors([])
    setSelectedScout(null)
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
        {/* Monster Selection */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Monster Selection
          </h3>
        </div>

        {/* Showdown Monster */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[90px]">
            Monster
          </Label>
          <Select
            value={selectedMonsterName}
            onValueChange={handleMonsterSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a monster..." />
            </SelectTrigger>
            <SelectContent>
              {[...availableQuarries, ...availableNemeses].map((monster) => (
                <SelectItem key={monster.name} value={monster.name}>
                  {monster.name}
                  {'node' in monster && ` (${monster.node})`}
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

        {/* Monster Type (Read-only, auto-set) */}
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
            Monster Attributes
          </h3>
        </div>

        {/* Monster Attributes Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Movement */}
          <div className="space-y-1">
            <Label htmlFor="monster-movement" className="text-xs">
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
            <Label htmlFor="monster-toughness" className="text-xs">
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
            <Label htmlFor="monster-speed" className="text-xs">
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

          {/* Strength */}
          <div className="space-y-1">
            <Label htmlFor="monster-strength" className="text-xs">
              Damage
            </Label>
            <NumericInput
              label="Damage"
              value={selectedMonsterStrength}
              onChange={setSelectedMonsterStrength}
              min={0}
              readOnly={false}>
              <Input
                id="monster-strength"
                type="number"
                value={selectedMonsterStrength}
                onChange={(e) =>
                  setSelectedMonsterStrength(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Accuracy */}
          <div className="space-y-1">
            <Label htmlFor="monster-accuracy" className="text-xs">
              Accuracy
            </Label>
            <NumericInput
              label="Accuracy"
              value={selectedMonsterAccuracy}
              onChange={setSelectedMonsterAccuracy}
              min={0}
              readOnly={false}>
              <Input
                id="monster-accuracy"
                type="number"
                value={selectedMonsterAccuracy}
                onChange={(e) =>
                  setSelectedMonsterAccuracy(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Evasion */}
          <div className="space-y-1">
            <Label htmlFor="monster-evasion" className="text-xs">
              Evasion
            </Label>
            <NumericInput
              label="Evasion"
              value={selectedMonsterEvasion}
              onChange={setSelectedMonsterEvasion}
              min={0}
              readOnly={false}>
              <Input
                id="monster-evasion"
                type="number"
                value={selectedMonsterEvasion}
                onChange={(e) =>
                  setSelectedMonsterEvasion(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>

          {/* Luck */}
          <div className="space-y-1">
            <Label htmlFor="monster-luck" className="text-xs">
              Luck
            </Label>
            <NumericInput
              label="Luck"
              value={selectedMonsterLuck}
              onChange={setSelectedMonsterLuck}
              min={0}
              readOnly={false}>
              <Input
                id="monster-luck"
                type="number"
                value={selectedMonsterLuck}
                onChange={(e) =>
                  setSelectedMonsterLuck(parseInt(e.target.value) || 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Survivor Selection */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Survivor Selection
          </h3>
        </div>

        {/* Survivors */}
        <div className="flex items-center justify-between">
          <Label className="text-left whitespace-nowrap min-w-[80px]">
            Survivors
          </Label>
          <SurvivorSelectionDrawer
            title="Select Showdown Party"
            description="Choose up to 4 survivors to embark on this showdown."
            survivors={availableSurvivors}
            selectedSurvivors={selectedSurvivors}
            selectedScout={selectedScout}
            onSelectionChange={setSelectedSurvivors}
            maxSelection={4}
          />
        </div>

        {/* Scout */}
        {selectedSettlement?.usesScouts && (
          <div className="flex items-center justify-between">
            <Label className="text-left whitespace-nowrap min-w-[80px]">
              Scout
            </Label>
            <ScoutSelectionDrawer
              title="Select Scout"
              description="Choose a single scout. Their skills will help navigate the dangers ahead."
              survivors={availableSurvivors}
              selectedSurvivors={selectedSurvivors}
              selectedScout={selectedScout}
              onSelectionChange={setSelectedScout}
            />
          </div>
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
            !selectedMonsterName ||
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
