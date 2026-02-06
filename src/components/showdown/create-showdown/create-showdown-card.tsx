'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { ScoutSelectionDrawer } from '@/components/survivor/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/survivor/survivor-selection/survivor-selection-drawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AmbushType, MonsterLevel, MonsterVersion, TurnType } from '@/lib/enums'
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
  getQuarryDataByName,
  isVignetteMonsterUnlocked
} from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import {
  NemesisMonsterLevel,
  QuarryMonsterLevel
} from '@/schemas/monster-level'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { ShowdownSurvivorDetails } from '@/schemas/showdown-survivor-details'
import { Survivor } from '@/schemas/survivor'
import _ from 'lodash'
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
  const [selectedMonsterVersion, setSelectedMonsterVersion] =
    useState<MonsterVersion>(MonsterVersion.ORIGINAL)
  const [selectedScout, setSelectedScout] = useState<number | null>(null)
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedMonsterData, setSelectedMonsterData] = useState<
    QuarryMonsterData | NemesisMonsterData | undefined
  >(undefined)
  const [startingTurn, setStartingTurn] = useState<TurnType>(TurnType.MONSTER)

  /** Available Survivors (Excluding Dead/Retired) */
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

  /** All Settlement Survivors (Including Dead/Retired) */
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

  /** Available Nemeses (Unlocked) */
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

  /** Available Quarries (Unlocked) */
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

  /**
   * Handle Monster Selection
   *
   * When a monster is selected from available quarries/nemeses, get its data
   * from the built-in or custom monsters. Then, map the available levels for
   * the monster (not all monsters have all 4 levels). Additionally, reset the
   * version to the original/default monster.
   *
   * @param monsterName Monster Name
   */
  const handleMonsterSelection = (monsterName: string) => {
    const monsterData =
      getQuarryDataByName(campaign, monsterName) ??
      getNemesisDataByName(campaign, monsterName)

    if (!monsterData) {
      console.error(
        'CreateShowdownCard: Monster Data Not Found for Monster:',
        monsterName
      )
      return toast.error(ERROR_MESSAGE())
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
    setSelectedMonsterVersion(MonsterVersion.ORIGINAL)
    setSelectedShowdownMonsterIndex(0)
  }

  /**
   * Handle Monster Level Selection
   *
   * Sets the chosen level for the monster. Also resets the selected monster
   * index to 0 (in case of switching between single/multi-monster levels). If
   * the chosen level is not available for the current version (alternate or
   * vignette), reset to original version.
   *
   * @param level Level Selection
   */
  const handleMonsterLevelSelection = (level: MonsterLevel) => {
    setSelectedMonsterLevel(level)
    setSelectedShowdownMonsterIndex(0)

    if (
      selectedMonsterVersion === MonsterVersion.ALTERNATE &&
      'alternate' in (selectedMonsterData ?? {}) &&
      !(level in ((selectedMonsterData as QuarryMonsterData)?.alternate ?? {}))
    )
      setSelectedMonsterVersion(MonsterVersion.ORIGINAL)

    if (
      selectedMonsterVersion === MonsterVersion.VIGNETTE &&
      !(level in (selectedMonsterData?.vignette ?? {}))
    )
      setSelectedMonsterVersion(MonsterVersion.ORIGINAL)
  }

  /**
   * Handle Monster Version Selection
   *
   * Sets the chosen version for the monster. Nothing else should be required
   * (the level should already be valid for this version).
   *
   * @param version Version Selection
   */
  const handleMonsterVersionSelection = (version: MonsterVersion) => {
    setSelectedMonsterVersion(version)
    setSelectedShowdownMonsterIndex(0)
  }

  /**
   * Handle Showdown Creation
   *
   * Validates the current selections and creates a new showdown if valid.
   */
  const handleCreateShowdown = () => {
    // Check if there is an active hunt already and prevent showdown creation
    if (selectedHunt && selectedHunt.settlementId === selectedSettlement?.id)
      return toast.error(HUNT_ALREADY_ACTIVE_ERROR_MESSAGE())

    // Validate required selections
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

    // Create the survivor details for the hunt
    const survivorDetails: ShowdownSurvivorDetails[] = selectedSurvivors.map(
      (survivorId) => ({
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
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

    // Get the selected quarry level data (this will depend on the version)
    const levelData =
      selectedMonsterVersion === MonsterVersion.ORIGINAL
        ? selectedMonsterData[selectedMonsterLevel]
        : selectedMonsterVersion === MonsterVersion.ALTERNATE
          ? (selectedMonsterData as QuarryMonsterData).alternate?.[
              selectedMonsterLevel
            ]
          : selectedMonsterData.vignette?.[selectedMonsterLevel]

    if (!levelData) {
      console.error(
        'CreateShowdownCard: Level Data Not Found for Monster:',
        selectedMonsterData.name,
        selectedMonsterVersion,
        selectedMonsterLevel
      )
      return toast.error(ERROR_MESSAGE())
    }

    // Select the monster name based on the version and encounter type (multi-
    // or single-monster)
    const monsterName =
      selectedMonsterVersion === MonsterVersion.ALTERNATE
        ? (selectedMonsterData as QuarryMonsterData).alternate?.name
        : selectedMonsterVersion === MonsterVersion.VIGNETTE
          ? selectedMonsterData.vignette?.name
          : undefined

    // Save as partial data that will be merged by the hook
    const showdownData: Showdown = {
      ambush: AmbushType.NONE,
      id: getNextShowdownId(campaign),
      level: selectedMonsterLevel,
      monsters: levelData.map((monster) => ({
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
        // If monsterName isn't defined, use the default quarry name (multi-
        // monster), or the quarry data name (single monster)
        name: monsterName ?? monster.name ?? selectedMonsterData.name,
        notes: '',
        speed: monster.speed,
        speedTokens: monster.speedTokens,
        strength: monster.strength,
        strengthTokens: monster.strengthTokens,
        toughness: monster.toughness,
        traits: monster.traits,
        type: selectedMonsterData.type,
        wounds: 0
      })),
      scout: selectedScout ?? undefined,
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
    setSelectedMonsterVersion(MonsterVersion.ORIGINAL)
    setAvailableLevels([])
    setSelectedSurvivors([])
    setSelectedSurvivor(null)
    setSelectedScout(null)
    setSelectedShowdown(showdownData)
    setStartingTurn(TurnType.MONSTER)
  }

  /**
   * Get the Monster Data
   *
   * Automatically selects the correct data location based on the current
   * monster version (original, alternate, or vignette).
   *
   * @returns Monster Data
   */
  const getMonsterLevelData = ():
    | NemesisMonsterLevel
    | QuarryMonsterLevel
    | undefined => {
    if (!selectedMonsterData) return undefined

    // Get the monster to update based on selected version
    return selectedMonsterVersion === MonsterVersion.ORIGINAL &&
      selectedMonsterData[selectedMonsterLevel]?.[selectedShowdownMonsterIndex]
      ? (selectedMonsterData[selectedMonsterLevel][
          selectedShowdownMonsterIndex
        ] as NemesisMonsterLevel | QuarryMonsterLevel)
      : selectedMonsterVersion === MonsterVersion.ALTERNATE &&
          (selectedMonsterData as QuarryMonsterData).alternate?.[
            selectedMonsterLevel
          ]?.[selectedShowdownMonsterIndex]
        ? ((selectedMonsterData as QuarryMonsterData).alternate?.[
            selectedMonsterLevel
          ]?.[selectedShowdownMonsterIndex] as
            | NemesisMonsterLevel
            | QuarryMonsterLevel)
        : selectedMonsterVersion === MonsterVersion.VIGNETTE &&
            selectedMonsterData.vignette?.[selectedMonsterLevel]?.[
              selectedShowdownMonsterIndex
            ]
          ? (selectedMonsterData.vignette[selectedMonsterLevel][
              selectedShowdownMonsterIndex
            ] as NemesisMonsterLevel | QuarryMonsterLevel)
          : undefined
  }

  /**
   * Updates a Selected Monster Property
   *
   * Automatically selects the correct data location based on the current
   * monster version (original, alternate, or vignette).
   *
   * @param path Property Path
   * @param value New Value
   */
  const updateProp = (path: string[], value: number) => {
    if (!selectedMonsterData) return

    const monster = getMonsterLevelData()
    if (!monster) return

    const updated = { ...selectedMonsterData }

    _.set(monster, path, value)

    // If the AI deck values are updated, update AI deck remaining as well
    if (path[0] === 'aiDeck')
      monster.aiDeckRemaining =
        monster.aiDeck.advanced +
        monster.aiDeck.basic +
        monster.aiDeck.legendary +
        (monster.aiDeck.overtone ?? 0)

    updated[selectedMonsterLevel] = updated[selectedMonsterLevel]?.map((m) =>
      m === monster ? monster : m
    )

    setSelectedMonsterData(updated)
  }

  /**
   * Handle Previous Monster in Multi-Monster Encounter
   */
  const handlePrevious = () => {
    const length = selectedMonsterData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex - 1 + length) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  /**
   * Handle Next Monster in Multi-Monster Encounter
   */
  const handleNext = () => {
    const length = selectedMonsterData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex + 1) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  /**
   * Handle Dot Click in Multi-Monster Encounter
   *
   * @param index Clicked Dot Index
   */
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
              handleMonsterLevelSelection(value as MonsterLevel)
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
            {selectedMonsterData?.type ?? 'Select a monster'}
          </div>
        </div>

        {/*
         * Monster Version
         *
         * Only show if the selected monster has alternate or vignette versions
         * for the selected level.
         */}
        {selectedMonsterData &&
          ((selectedMonsterData as QuarryMonsterData).alternate?.[
            selectedMonsterLevel
          ] ||
            (selectedMonsterData.vignette?.[selectedMonsterLevel] &&
              isVignetteMonsterUnlocked(
                campaign,
                selectedMonsterData.vignette?.name
              ))) && (
            <div className="flex items-center justify-between">
              <Label className="text-left whitespace-nowrap min-w-[90px]">
                Version
              </Label>

              <Select
                value={selectedMonsterVersion}
                onValueChange={(value) =>
                  handleMonsterVersionSelection(value as MonsterVersion)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose version..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={MonsterVersion.ORIGINAL}>
                    {selectedMonsterData.name}
                  </SelectItem>
                  {(selectedMonsterData as QuarryMonsterData).alternate && (
                    <SelectItem value={MonsterVersion.ALTERNATE}>
                      {
                        (selectedMonsterData as QuarryMonsterData).alternate
                          ?.name
                      }{' '}
                      (Alternate)
                    </SelectItem>
                  )}
                  {selectedMonsterData.vignette && (
                    <SelectItem value={MonsterVersion.VIGNETTE}>
                      {selectedMonsterData.vignette.name} (Vignette)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

        <Separator className="my-2" />

        {selectedMonsterData &&
          selectedMonsterData.multiMonster &&
          selectedMonsterData[selectedMonsterLevel] && (
            <h3 className="text-sm font-semibold text-muted-foreground text-center">
              {getMonsterLevelData()?.name ?? 'Unknown Monster'}
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
                value={getMonsterLevelData()?.aiDeck.advanced ?? 0}
                onChange={(value) => updateProp(['aiDeck', 'advanced'], value)}
                min={0}
                disabled={selectedMonsterData === undefined}
              />
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-b"
                className="text-xs text-center block">
                B Cards
              </Label>
              <NumericInput
                label="B Cards"
                value={getMonsterLevelData()?.aiDeck.basic ?? 0}
                onChange={(value) => updateProp(['aiDeck', 'basic'], value)}
                min={0}
                disabled={selectedMonsterData === undefined}
              />
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-l"
                className="text-xs text-center block">
                L Cards
              </Label>
              <NumericInput
                label="L Cards"
                value={getMonsterLevelData()?.aiDeck.legendary ?? 0}
                onChange={(value) => updateProp(['aiDeck', 'legendary'], value)}
                min={0}
                disabled={selectedMonsterData === undefined}
              />
            </div>

            <div className="flex-1 space-y-1">
              <Label
                htmlFor="monster-ai-deck-o"
                className="text-xs text-center block">
                O Cards
              </Label>
              <NumericInput
                label="O Cards"
                value={getMonsterLevelData()?.aiDeck.overtone ?? 0}
                onChange={(value) => updateProp(['aiDeck', 'overtone'], value)}
                min={0}
                disabled={selectedMonsterData === undefined}
              />
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
              value={getMonsterLevelData()?.movement ?? 0}
              onChange={(value) => updateProp(['movement'], value)}
              min={0}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.toughness ?? 0}
              onChange={(value) => updateProp(['toughness'], value)}
              min={0}
              disabled={selectedMonsterData === undefined}
            />
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <Label htmlFor="monster-speed" className="text-xs justify-center">
              Speed
            </Label>
            <NumericInput
              label="Speed"
              value={getMonsterLevelData()?.speed ?? 0}
              onChange={(value) => updateProp(['speed'], value)}
              min={0}
              disabled={selectedMonsterData === undefined}
            />
          </div>

          {/* Damage */}
          <div className="space-y-1">
            <Label htmlFor="monster-damage" className="text-xs justify-center">
              Damage
            </Label>
            <NumericInput
              label="Damage"
              value={getMonsterLevelData()?.damage ?? 0}
              onChange={(value) => updateProp(['damage'], value)}
              min={0}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.movementTokens ?? 0}
              onChange={(value) => updateProp(['movementTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.speedTokens ?? 0}
              onChange={(value) => updateProp(['speedTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.damageTokens ?? 0}
              onChange={(value) => updateProp(['damageTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.accuracyTokens ?? 0}
              onChange={(value) => updateProp(['accuracyTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.strengthTokens ?? 0}
              onChange={(value) => updateProp(['strengthTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.evasionTokens ?? 0}
              onChange={(value) => updateProp(['evasionTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
              value={getMonsterLevelData()?.luckTokens ?? 0}
              onChange={(value) => updateProp(['luckTokens'], value)}
              disabled={selectedMonsterData === undefined}
            />
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
