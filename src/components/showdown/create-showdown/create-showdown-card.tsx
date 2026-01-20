'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { ScoutSelectionDrawer } from '@/components/survivor/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/survivor/survivor-selection/survivor-selection-drawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { AmbushType, ColorChoice, MonsterLevel, TurnType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_ALREADY_ACTIVE_ERROR_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_CREATED_MESSAGE
} from '@/lib/messages'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import {
  getNemesisDataByName,
  getNextShowdownId,
  getQuarryDataByName
} from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { ShowdownSurvivorDetails } from '@/schemas/showdown-survivor-details'
import { Survivor } from '@/schemas/survivor'
import { ArrowLeftIcon, ArrowRightIcon, SkullIcon } from 'lucide-react'
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
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Showdown Monster Index */
  setSelectedShowdownMonsterIndex: (index: number) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
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
  selectedShowdownMonsterIndex,
  setSelectedShowdown,
  setSelectedShowdownMonsterIndex,
  setSelectedSurvivor
}: CreateShowdownCardProps): ReactElement {
  const [availableLevels, setAvailableLevels] = useState<MonsterLevel[]>([])
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedScout, setSelectedScout] = useState<number | null>(null)
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedMonsterData, setSelectedMonsterData] = useState<
    QuarryMonsterData | NemesisMonsterData | undefined
  >(undefined)
  const [startingTurn, setStartingTurn] = useState<TurnType>(TurnType.MONSTER)

  // Get available survivors for this settlement (exclude dead/retired)
  const availableSurvivors = useMemo(
    () =>
      campaign.survivors
        ? campaign.survivors
            .filter(
              (survivor) =>
                survivor.settlementId === selectedSettlement?.id &&
                !survivor.dead &&
                !survivor.retired &&
                !survivor.skipNextHunt
            )
            .sort((a, b) => {
              if (a.name === undefined && b.name === undefined) return 0
              if (a.name === undefined) return 1
              if (b.name === undefined) return -1

              return a.name.localeCompare(b.name)
            })
        : [],
    [campaign.survivors, selectedSettlement?.id]
  )

  // Get all survivors for this settlement (including dead ones) for messaging
  const allSettlementSurvivors = useMemo(
    () =>
      campaign.survivors
        ? campaign.survivors
            .filter(
              (survivor) => survivor.settlementId === selectedSettlement?.id
            )
            .sort((a, b) => {
              if (a.name === undefined && b.name === undefined) return 0
              if (a.name === undefined) return 1
              if (b.name === undefined) return -1

              return a.name.localeCompare(b.name)
            })
        : [],
    [campaign.survivors, selectedSettlement?.id]
  )

  // Get available nemeses (unlocked ones) and map to monster data
  const availableNemeses = useMemo(
    () =>
      selectedSettlement?.nemeses
        ? selectedSettlement.nemeses
            .filter((nemesis) => nemesis.unlocked)
            .map((nemesis) => ({
              ...nemesis,
              monsterData:
                Object.values(NEMESES).find((n) => n.name === nemesis.name) ??
                Object.values(campaign.customNemeses ?? {}).find(
                  (cn) => cn.name === nemesis.name
                )
            }))
            // Filter out any missing monster data
            .filter((nemesis) => nemesis.monsterData)
            .sort((a, b) => {
              if (
                a.monsterData!.name === undefined &&
                b.monsterData!.name === undefined
              )
                return 0
              if (a.monsterData!.name === undefined) return 1
              if (b.monsterData!.name === undefined) return -1
              return a.monsterData!.name.localeCompare(b.monsterData!.name)
            })
        : [],
    [campaign.customNemeses, selectedSettlement]
  )

  // Get available quarries (unlocked ones) and map to monster data
  const availableQuarries = useMemo(
    () =>
      selectedSettlement?.quarries
        ? selectedSettlement.quarries
            .filter((quarry) => quarry.unlocked)
            .map((quarry) => ({
              ...quarry,
              monsterData:
                Object.values(QUARRIES).find((q) => q.name === quarry.name) ??
                Object.values(campaign.customQuarries ?? {}).find(
                  (cq) => cq.name === quarry.name
                )
            }))
            // Filter out any missing monster data
            .filter((quarry) => quarry.monsterData)
            .sort((a, b) => {
              if (
                a.monsterData!.name === undefined &&
                b.monsterData!.name === undefined
              )
                return 0
              if (a.monsterData!.name === undefined) return 1
              if (b.monsterData!.name === undefined) return -1
              return a.monsterData!.name.localeCompare(b.monsterData!.name)
            })
        : [],
    [campaign.customQuarries, selectedSettlement]
  )

  // Handle monster selection and auto-set type
  const handleMonsterSelection = (monsterName: string) => {
    const monsterData =
      getQuarryDataByName(campaign, monsterName) ??
      getNemesisDataByName(campaign, monsterName)

    if (!monsterData) {
      console.error(
        'CreateShowdownCard: Monster Data Not Found for Monster:',
        monsterName
      )
      toast.error(
        'The darkness swallows this monster. Its details cannot be found — check your custom monster data and try again.'
      )
      return
    }

    // Determine which levels are available for this monster.
    const levels: MonsterLevel[] = []
    if (MonsterLevel.LEVEL_1 in monsterData && monsterData.level1)
      levels.push(MonsterLevel.LEVEL_1)
    if (MonsterLevel.LEVEL_2 in monsterData && monsterData.level2)
      levels.push(MonsterLevel.LEVEL_2)
    if (MonsterLevel.LEVEL_3 in monsterData && monsterData.level3)
      levels.push(MonsterLevel.LEVEL_3)
    if (MonsterLevel.LEVEL_4 in monsterData && monsterData.level4)
      levels.push(MonsterLevel.LEVEL_4)
    setAvailableLevels(levels)

    // Set to first available level or keep current if valid
    const currentLevelValid =
      selectedMonsterLevel && levels.includes(selectedMonsterLevel)
    const levelToUse = currentLevelValid ? selectedMonsterLevel : levels[0]

    setSelectedMonsterData(monsterData)
    setSelectedMonsterLevel(levelToUse ?? MonsterLevel.LEVEL_1)
    setSelectedShowdownMonsterIndex(0)
  }

  const handleCreateShowdown = () => {
    // Check if there's already an active hunt for this settlement
    if (selectedHunt && selectedHunt.settlementId === selectedSettlement?.id)
      return toast.error(HUNT_ALREADY_ACTIVE_ERROR_MESSAGE())

    if (
      !selectedSettlement ||
      !selectedMonsterData ||
      !selectedMonsterLevel ||
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

    const survivorDetails: ShowdownSurvivorDetails[] = selectedSurvivors.map(
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

    const levelData = selectedMonsterData[selectedMonsterLevel]

    if (!levelData) {
      console.error(
        'CreateShowdownCard: Level Data Not Found for Monster:',
        selectedMonsterData.name,
        selectedMonsterLevel
      )
      toast.error(
        'The darkness swallows this monster. Its level details cannot be found — check your custom monster data and try again.'
      )
      return
    }

    // Save as partial data that will be merged by the hook
    const showdownData: Showdown = {
      ambush: AmbushType.NONE,
      id: getNextShowdownId(campaign),
      level: selectedMonsterLevel,
      monsters:
        selectedMonsterData[selectedMonsterLevel]?.map((monster) => ({
          accuracy: monster.accuracy,
          accuracyTokens: monster.accuracyTokens,
          aiDeck: monster.aiDeck,
          aiDeckRemaining: monster.aiDeckRemaining,
          damage: monster.damage,
          damageTokens: monster.damageTokens,
          evasion: monster.evasion,
          evasionTokens: monster.evasionTokens,
          knockedDown: false,
          luck: monster.luck,
          luckTokens: monster.luckTokens,
          moods: monster.moods,
          movement: monster.movement,
          movementTokens: monster.movementTokens,
          // For multi-monster encounters, use each sub-monster's name. Or, use
          // the main monster name.
          name: monster.name ?? selectedMonsterData.name,
          notes: '',
          speed: monster.speed,
          speedTokens: monster.speedTokens,
          strength: monster.strength,
          strengthTokens: monster.strengthTokens,
          toughness: monster.toughness,
          traits: monster.traits,
          type: selectedMonsterData.type,
          wounds: 0
        })) ?? [],
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

    saveSelectedShowdown(
      showdownData,
      SHOWDOWN_CREATED_MESSAGE(
        selectedMonsterData.name,
        selectedMonsterData.type
      )
    )

    // Reset form
    setSelectedMonsterData(undefined)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setAvailableLevels([])
    setSelectedSurvivors([])
    setSelectedSurvivor(null)
    setSelectedScout(null)
    setSelectedShowdown(showdownData)
    setStartingTurn(TurnType.MONSTER)
  }

  const setSelectedMonsterAIDeckACards = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][
      selectedShowdownMonsterIndex
    ].aiDeck.advanced = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterAIDeckBCards = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].aiDeck.basic =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterAIDeckLCards = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][
      selectedShowdownMonsterIndex
    ].aiDeck.legendary = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterAIDeckOCards = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][
      selectedShowdownMonsterIndex
    ].aiDeck.overtone = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterMovement = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].movement = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterToughness = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].toughness =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterSpeed = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].speed = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterDamage = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].damage = value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterMovementTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].movementTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterSpeedTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].speedTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterDamageTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].damageTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterAccuracyTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].accuracyTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterStrengthTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].strengthTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterEvasionTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].evasionTokens =
      value
    setSelectedMonsterData(updated)
  }

  const setSelectedMonsterLuckTokens = (value: number) => {
    const updated = Object.assign({}, selectedMonsterData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedShowdownMonsterIndex].luckTokens =
      value
    setSelectedMonsterData(updated)
  }

  const handlePrevious = () => {
    const length = selectedMonsterData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex - 1 + length) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  const handleNext = () => {
    const length = selectedMonsterData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex + 1) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  const handleDotClick = (index: number) => {
    if (!selectedMonsterData?.[selectedMonsterLevel]?.[index]) return

    setSelectedShowdownMonsterIndex(index)
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
            value={selectedMonsterData?.name ?? ''}
            onValueChange={handleMonsterSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a monster..." />
            </SelectTrigger>
            <SelectContent>
              {[...availableNemeses, ...availableQuarries].map((monster) => (
                <SelectItem key={monster.name} value={monster.name}>
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
            onValueChange={(value) =>
              setSelectedMonsterLevel(value as MonsterLevel)
            }
            disabled={availableLevels.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose level..." />
            </SelectTrigger>

            <SelectContent>
              {availableLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  Level {level.replace('level', '')}
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
            {selectedMonsterData?.type || 'Select a monster'}
          </div>
        </div>

        <Separator className="my-2" />

        {selectedMonsterData &&
          selectedMonsterData.multiMonster &&
          selectedMonsterData[selectedMonsterLevel] && (
            <h3 className="text-sm font-semibold text-muted-foreground text-center">
              {
                selectedMonsterData[selectedMonsterLevel][
                  selectedShowdownMonsterIndex
                ].name
              }
            </h3>
          )}

        {selectedMonsterData &&
          selectedMonsterData.multiMonster &&
          selectedMonsterData[selectedMonsterLevel] && (
            <div className="monster_carousel_controls">
              <div className="monster_carousel_buttons">
                <Button
                  className="h-8 w-8"
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}>
                  <ArrowLeftIcon className="size-8" />
                </Button>

                <Button
                  className="h-8 w-8"
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}>
                  <ArrowRightIcon className="size-8" />
                </Button>
              </div>

              <div className="monster_carousel_dots">
                {selectedMonsterData[selectedMonsterLevel].map(
                  (monster, index) => {
                    const isSelected = index === selectedShowdownMonsterIndex

                    return (
                      <Avatar
                        key={index}
                        className={`monster_carousel_dot${isSelected ? ' monster_carousel_dot--selected' : ''} bg-red-500 items-center justify-center cursor-pointer`}
                        style={{
                          ['--dot-color' as string]: isSelected
                            ? 'hsl(var(--foreground))'
                            : 'transparent',
                          ['--dot-bg' as string]: 'hsl(var(--destructive))'
                        }}
                        onClick={() => handleDotClick(index)}>
                        <AvatarFallback className="bg-transparent">
                          <SkullIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )
                  }
                )}
              </div>
            </div>
          )}

        {selectedMonsterData &&
          selectedMonsterData.multiMonster &&
          selectedMonsterData[selectedMonsterLevel] && (
            <Separator className="my-2" />
          )}

        {/* AI Deck */}
        <h3 className="text-xs font-semibold text-muted-foreground text-center">
          AI Deck
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 w-full">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-a"
                className="text-xs text-center block">
                A Cards
              </Label>
              <NumericInput
                label="A Cards"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].aiDeck.advanced ?? 0
                }
                onChange={setSelectedMonsterAIDeckACards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-a"
                  type="number"
                  value={
                    selectedMonsterData?.[selectedMonsterLevel]?.[
                      selectedShowdownMonsterIndex
                    ].aiDeck.advanced ?? 0
                  }
                  onChange={(e) =>
                    setSelectedMonsterAIDeckACards(
                      parseInt(e.target.value) ?? 0
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
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].aiDeck.basic ?? 0
                }
                onChange={setSelectedMonsterAIDeckBCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-b"
                  type="number"
                  value={
                    selectedMonsterData?.[selectedMonsterLevel]?.[
                      selectedShowdownMonsterIndex
                    ].aiDeck.basic ?? 0
                  }
                  onChange={(e) =>
                    setSelectedMonsterAIDeckBCards(
                      parseInt(e.target.value) ?? 0
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
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].aiDeck.legendary ?? 0
                }
                onChange={setSelectedMonsterAIDeckLCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-l"
                  type="number"
                  value={
                    selectedMonsterData?.[selectedMonsterLevel]?.[
                      selectedShowdownMonsterIndex
                    ].aiDeck.legendary ?? 0
                  }
                  onChange={(e) =>
                    setSelectedMonsterAIDeckLCards(
                      parseInt(e.target.value) ?? 0
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
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].aiDeck.overtone ?? 0
                }
                onChange={setSelectedMonsterAIDeckOCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-o"
                  type="number"
                  value={
                    selectedMonsterData?.[selectedMonsterLevel]?.[
                      selectedShowdownMonsterIndex
                    ].aiDeck.overtone ?? 0
                  }
                  onChange={(e) =>
                    setSelectedMonsterAIDeckOCards(
                      parseInt(e.target.value) ?? 0
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
        <h3 className="text-xs font-semibold text-muted-foreground text-center">
          Attributes
        </h3>

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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].movement ?? 0
              }
              onChange={setSelectedMonsterMovement}
              min={0}
              readOnly={false}>
              <Input
                id="monster-movement"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].movement ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterMovement(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].toughness ?? 0
              }
              onChange={setSelectedMonsterToughness}
              min={0}
              readOnly={false}>
              <Input
                id="monster-toughness"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].toughness ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterToughness(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].speed ?? 0
              }
              onChange={setSelectedMonsterSpeed}
              min={0}
              readOnly={false}>
              <Input
                id="monster-speed"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].speed ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterSpeed(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].damage ?? 0
              }
              onChange={setSelectedMonsterDamage}
              min={0}
              readOnly={false}>
              <Input
                id="monster-damage"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].damage ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterDamage(parseInt(e.target.value) ?? 0)
                }
                min="0"
                className="text-center no-spinners"
              />
            </NumericInput>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Monster Tokens */}
        <h3 className="text-xs font-semibold text-muted-foreground text-center">
          Tokens
        </h3>

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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].movementTokens ?? 0
              }
              onChange={setSelectedMonsterMovementTokens}
              readOnly={false}>
              <Input
                id="monster-movement-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].movementTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterMovementTokens(
                    parseInt(e.target.value) ?? 0
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].speedTokens ?? 0
              }
              onChange={setSelectedMonsterSpeedTokens}
              readOnly={false}>
              <Input
                id="monster-speed-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].speedTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterSpeedTokens(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].damageTokens ?? 0
              }
              onChange={setSelectedMonsterDamageTokens}
              readOnly={false}>
              <Input
                id="monster-damage-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].damageTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterDamageTokens(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].accuracyTokens ?? 0
              }
              onChange={setSelectedMonsterAccuracyTokens}
              readOnly={false}>
              <Input
                id="monster-accuracy-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].accuracyTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterAccuracyTokens(
                    parseInt(e.target.value) ?? 0
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].strengthTokens ?? 0
              }
              onChange={setSelectedMonsterStrengthTokens}
              readOnly={false}>
              <Input
                id="monster-strength-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].strengthTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterStrengthTokens(
                    parseInt(e.target.value) ?? 0
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].evasionTokens ?? 0
              }
              onChange={setSelectedMonsterEvasionTokens}
              readOnly={false}>
              <Input
                id="monster-evasion-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].evasionTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterEvasionTokens(parseInt(e.target.value) ?? 0)
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
              value={
                selectedMonsterData?.[selectedMonsterLevel]?.[
                  selectedShowdownMonsterIndex
                ].luckTokens ?? 0
              }
              onChange={setSelectedMonsterLuckTokens}
              readOnly={false}>
              <Input
                id="monster-luck-tokens"
                type="number"
                value={
                  selectedMonsterData?.[selectedMonsterLevel]?.[
                    selectedShowdownMonsterIndex
                  ].luckTokens ?? 0
                }
                onChange={(e) =>
                  setSelectedMonsterLuckTokens(parseInt(e.target.value) ?? 0)
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
            !selectedMonsterData ||
            !selectedMonsterLevel ||
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
