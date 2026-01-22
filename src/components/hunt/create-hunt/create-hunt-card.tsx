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
import { MonsterLevel, MonsterType, MonsterVersion } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_BEGINS_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE
} from '@/lib/messages'
import { QUARRIES } from '@/lib/monsters'
import {
  getNextHuntId,
  getQuarryDataByName,
  isVignetteMonsterUnlocked
} from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { HuntSurvivorDetails } from '@/schemas/hunt-survivor-details'
import { QuarryMonsterLevel } from '@/schemas/monster-level'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PawPrintIcon,
  SkullIcon
} from 'lucide-react'
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
  /** Selected Hunt Monster Index */
  selectedHuntMonsterIndex: number
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Hunt Monster Index */
  setSelectedHuntMonsterIndex: (index: number) => void
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
  selectedHuntMonsterIndex,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  setSelectedHuntMonsterIndex,
  setSelectedSurvivor
}: CreateHuntCardProps): ReactElement {
  const [availableLevels, setAvailableLevels] = useState<MonsterLevel[]>([])
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedMonsterVersion, setSelectedMonsterVersion] =
    useState<MonsterVersion>(MonsterVersion.ORIGINAL)
  const [selectedScout, setSelectedScout] = useState<number | null>(null)
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedQuarryData, setSelectedQuarryData] = useState<
    QuarryMonsterData | undefined
  >(undefined)

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
   * When a monster is selected from available quarries, get its data from the
   * built-in or custom monsters. Then, map the available levels for the monster
   * (not all monsters have all 4 levels). Additionally, reset the version to
   * the original/default monster.
   *
   * @param quarryName Quarry Name
   */
  const handleMonsterSelection = (quarryName: string) => {
    const quarryData = getQuarryDataByName(campaign, quarryName)

    if (!quarryData) {
      console.error(
        'CreateHuntCard: Monster Data Not Found for Quarry:',
        quarryName
      )
      return toast.error(ERROR_MESSAGE())
    }

    // Determine which levels are available for this monster.
    const levels: MonsterLevel[] = []
    if (MonsterLevel.LEVEL_1 in quarryData && quarryData.level1)
      levels.push(MonsterLevel.LEVEL_1)
    if (MonsterLevel.LEVEL_2 in quarryData && quarryData.level2)
      levels.push(MonsterLevel.LEVEL_2)
    if (MonsterLevel.LEVEL_3 in quarryData && quarryData.level3)
      levels.push(MonsterLevel.LEVEL_3)
    if (MonsterLevel.LEVEL_4 in quarryData && quarryData.level4)
      levels.push(MonsterLevel.LEVEL_4)
    setAvailableLevels(levels)

    // Set to first available level or keep current if valid
    const currentLevelValid =
      selectedMonsterLevel && levels.includes(selectedMonsterLevel)
    const levelToUse = currentLevelValid ? selectedMonsterLevel : levels[0]

    setSelectedQuarryData(quarryData)
    setSelectedMonsterLevel(levelToUse)
    setSelectedMonsterVersion(MonsterVersion.ORIGINAL)
    setSelectedHuntMonsterIndex(0)
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
    setSelectedHuntMonsterIndex(0)

    if (
      selectedMonsterVersion === MonsterVersion.ALTERNATE &&
      !(level in (selectedQuarryData?.alternate ?? {}))
    )
      setSelectedMonsterVersion(MonsterVersion.ORIGINAL)

    if (
      selectedMonsterVersion === MonsterVersion.VIGNETTE &&
      !(level in (selectedQuarryData?.vignette ?? {}))
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
    setSelectedHuntMonsterIndex(0)
  }

  /**
   * Handle Hunt Creation
   *
   * Validates the current selections and creates a new hunt if valid.
   */
  const handleCreateHunt = () => {
    // Check if there is an active showdown already and prevent hunt creation
    if (
      selectedShowdown &&
      selectedShowdown.settlementId === selectedSettlement?.id
    )
      return toast.error(SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE())

    // Validate required selections
    if (
      !selectedSettlement ||
      !selectedQuarryData ||
      !selectedMonsterLevel ||
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

    // Create the survivor details for the hunt
    const survivorDetails: HuntSurvivorDetails[] = selectedSurvivors.map(
      (survivorId) => ({
        accuracyTokens: 0,
        evasionTokens: 0,
        id: survivorId,
        insanityTokens: 0,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })
    )

    if (selectedScout)
      survivorDetails.push({
        accuracyTokens: 0,
        evasionTokens: 0,
        id: selectedScout,
        insanityTokens: 0,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      })

    // Get the selected quarry level data (this will depend on the version)
    const levelData =
      selectedMonsterVersion === MonsterVersion.ORIGINAL
        ? selectedQuarryData[selectedMonsterLevel]
        : selectedMonsterVersion === MonsterVersion.ALTERNATE
          ? selectedQuarryData.alternate?.[selectedMonsterLevel]
          : selectedQuarryData.vignette?.[selectedMonsterLevel]

    if (!levelData) {
      console.error(
        'CreateHuntCard: Level Data Not Found for Quarry:',
        selectedQuarryData.name,
        selectedMonsterVersion,
        selectedMonsterLevel
      )
      return toast.error(ERROR_MESSAGE())
    }

    // Select the monster name based on the version and encounter type (multi-
    // or single-monster)
    const monsterName =
      selectedMonsterVersion === MonsterVersion.ALTERNATE
        ? selectedQuarryData.alternate?.name
        : selectedMonsterVersion === MonsterVersion.VIGNETTE
          ? selectedQuarryData.vignette?.name
          : undefined

    const huntData: Hunt = {
      huntBoard: selectedQuarryData.huntBoard,
      id: getNextHuntId(campaign),
      level: selectedMonsterLevel,
      monsters: levelData.map((quarry) => ({
        accuracy: quarry.accuracy,
        accuracyTokens: quarry.accuracyTokens,
        aiDeck: quarry.aiDeck,
        aiDeckRemaining: quarry.aiDeckRemaining,
        damage: quarry.damage,
        damageTokens: quarry.damageTokens,
        evasion: quarry.evasion,
        evasionTokens: quarry.evasionTokens,
        knockedDown: false,
        luck: quarry.luck,
        luckTokens: quarry.luckTokens,
        moods: quarry.moods,
        movement: quarry.movement,
        movementTokens: quarry.movementTokens,
        // If monsterName isn't defined, use the default quarry name (multi-
        // monster), or the quarry data name (single monster)
        name: monsterName ?? quarry.name ?? selectedQuarryData.name,
        notes: '',
        speed: quarry.speed,
        speedTokens: quarry.speedTokens,
        strength: quarry.strength,
        strengthTokens: quarry.strengthTokens,
        toughness: quarry.toughness,
        traits: quarry.traits,
        type: MonsterType.QUARRY,
        wounds: 0
      })),
      monsterPosition:
        (levelData as QuarryMonsterLevel[])[selectedHuntMonsterIndex].huntPos ??
        12,
      scout: selectedScout ?? undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivorPosition:
        (levelData as QuarryMonsterLevel[])[selectedHuntMonsterIndex]
          .survivorHuntPos ?? 12,
      survivors: selectedSurvivors
    }

    saveSelectedHunt(huntData, HUNT_BEGINS_MESSAGE(selectedQuarryData.name))

    // Reset form
    setSelectedQuarryData(undefined)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setSelectedMonsterVersion(MonsterVersion.ORIGINAL)
    setAvailableLevels([])
    setSelectedSurvivors([])
    setSelectedSurvivor(null)
    setSelectedScout(null)
    setSelectedHunt(huntData)
  }

  /**
   * Updates a Selected Monster Property
   *
   * Handles both direct properties (e.g., 'movement') and nested properties
   * (e.g., ['aiDeck', 'advanced']). Automatically selects the correct data
   * location based on the current monster version (original, alternate, or
   * vignette).
   *
   * @param path Property Path (string or array)
   * @param value New Value
   */
  const updateSelectedMonsterProperty = <T,>(
    path: string | string[],
    value: T
  ) => {
    if (!selectedQuarryData) return

    const updated = { ...selectedQuarryData }

    // Get the monster to update based on selected version
    const monster: QuarryMonsterLevel | null =
      selectedMonsterVersion === MonsterVersion.ORIGINAL &&
      updated[selectedMonsterLevel]?.[selectedHuntMonsterIndex]
        ? (updated[selectedMonsterLevel][
            selectedHuntMonsterIndex
          ] as QuarryMonsterLevel)
        : selectedMonsterVersion === MonsterVersion.ALTERNATE &&
            updated.alternate?.[selectedMonsterLevel]?.[
              selectedHuntMonsterIndex
            ]
          ? (updated.alternate[selectedMonsterLevel][
              selectedHuntMonsterIndex
            ] as QuarryMonsterLevel)
          : selectedMonsterVersion === MonsterVersion.VIGNETTE &&
              updated.vignette?.[selectedMonsterLevel]?.[
                selectedHuntMonsterIndex
              ]
            ? (updated.vignette[selectedMonsterLevel][
                selectedHuntMonsterIndex
              ] as QuarryMonsterLevel)
            : null

    if (!monster) return

    // Handle nested path (e.g., ['aiDeck', 'advanced']) vs direct property
    if (Array.isArray(path)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let target: any = monster
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]]
        if (target === undefined) return
      }
      target[path[path.length - 1]] = value
    } else (monster as { [key: string]: unknown })[path] = value

    setSelectedQuarryData(updated)
  }

  /**
   * Gets a Selected Monster Property
   *
   * Handles both direct properties (e.g., 'movement') and nested properties
   * (e.g., ['aiDeck', 'advanced']). Automatically selects the correct data
   * location based on the current monster version (original, alternate, or
   * vignette).
   *
   * @param path Property Path (string or array)
   * @returns Property Value
   */
  const getSelectedMonsterProperty = (path: string | string[]) => {
    if (!selectedQuarryData) return

    // Get the monster to update based on selected version
    const monster: QuarryMonsterLevel | null =
      selectedMonsterVersion === MonsterVersion.ORIGINAL &&
      selectedQuarryData[selectedMonsterLevel]?.[selectedHuntMonsterIndex]
        ? (selectedQuarryData[selectedMonsterLevel][
            selectedHuntMonsterIndex
          ] as QuarryMonsterLevel)
        : selectedMonsterVersion === MonsterVersion.ALTERNATE &&
            selectedQuarryData.alternate?.[selectedMonsterLevel]?.[
              selectedHuntMonsterIndex
            ]
          ? (selectedQuarryData.alternate[selectedMonsterLevel][
              selectedHuntMonsterIndex
            ] as QuarryMonsterLevel)
          : selectedMonsterVersion === MonsterVersion.VIGNETTE &&
              selectedQuarryData.vignette?.[selectedMonsterLevel]?.[
                selectedHuntMonsterIndex
              ]
            ? (selectedQuarryData.vignette[selectedMonsterLevel][
                selectedHuntMonsterIndex
              ] as QuarryMonsterLevel)
            : null

    if (!monster) return

    // Handle nested path (e.g., ['aiDeck', 'advanced']) vs direct property
    if (Array.isArray(path)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let target: any = monster
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]]
        if (target === undefined) return
      }
      return target[path[path.length - 1]]
    } else return (monster as { [key: string]: unknown })[path]
  }

  /**
   * Handle Previous Monster in Multi-Monster Encounter
   */
  const handlePrevious = () => {
    const length = selectedQuarryData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex - 1 + length) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

  /**
   * Handle Next Monster in Multi-Monster Encounter
   */
  const handleNext = () => {
    const length = selectedQuarryData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex + 1) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

  /**
   * Handle Dot Click in Multi-Monster Encounter
   *
   * @param index Clicked Dot Index
   */
  const handleDotClick = (index: number) => {
    if (!selectedQuarryData?.[selectedMonsterLevel]?.[index]) return

    setSelectedHuntMonsterIndex(index)
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

          {availableQuarries.length > 0 ? (
            <Select
              value={selectedQuarryData?.name ?? ''}
              onValueChange={handleMonsterSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a quarry..." />
              </SelectTrigger>

              <SelectContent>
                {availableQuarries.map((quarry) => (
                  <SelectItem key={quarry.name} value={quarry.name}>
                    {quarry.monsterData?.name} ({quarry.monsterData?.node})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">
              No available/unlocked quarries
            </p>
          )}
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
            disabled={
              availableQuarries.length === 0 || availableLevels.length === 0
            }>
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

        {/*
         * Monster Version
         *
         * Only show if the selected monster has alternate or vignette versions
         * for the selected level.
         */}
        {selectedQuarryData &&
          (selectedQuarryData.alternate?.[selectedMonsterLevel] ||
            (selectedQuarryData.vignette?.[selectedMonsterLevel] &&
              isVignetteMonsterUnlocked(
                campaign,
                selectedQuarryData.vignette?.name
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
                    {selectedQuarryData.name}
                  </SelectItem>
                  {selectedQuarryData.alternate && (
                    <SelectItem value={MonsterVersion.ALTERNATE}>
                      {selectedQuarryData.alternate.name} (Alternate)
                    </SelectItem>
                  )}
                  {selectedQuarryData.vignette && (
                    <SelectItem value={MonsterVersion.VIGNETTE}>
                      {selectedQuarryData.vignette.name} (Vignette)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

        <Separator className="my-2" />

        {selectedQuarryData &&
          selectedQuarryData.multiMonster &&
          selectedQuarryData[selectedMonsterLevel] && (
            <h3 className="text-sm font-semibold text-muted-foreground text-center">
              {getSelectedMonsterProperty('name') ?? 'Unknown Monster'}
            </h3>
          )}

        {selectedQuarryData &&
          selectedQuarryData.multiMonster &&
          selectedQuarryData[selectedMonsterLevel] && (
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
                {selectedQuarryData[selectedMonsterLevel].map(
                  (monster, index) => {
                    const isSelected = index === selectedHuntMonsterIndex

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

        {selectedQuarryData &&
          selectedQuarryData.multiMonster &&
          selectedQuarryData[selectedMonsterLevel] && (
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
                value={getSelectedMonsterProperty(['aiDeck', 'advanced']) ?? 0}
                onChange={(value) =>
                  updateSelectedMonsterProperty(['aiDeck', 'advanced'], value)
                }
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-a"
                  type="number"
                  value={
                    getSelectedMonsterProperty(['aiDeck', 'advanced']) ?? 0
                  }
                  onChange={(e) =>
                    updateSelectedMonsterProperty(
                      ['aiDeck', 'advanced'],
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
                value={getSelectedMonsterProperty(['aiDeck', 'basic']) ?? 0}
                onChange={(value) =>
                  updateSelectedMonsterProperty(['aiDeck', 'basic'], value)
                }
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-b"
                  type="number"
                  value={getSelectedMonsterProperty(['aiDeck', 'basic']) ?? 0}
                  onChange={(e) =>
                    updateSelectedMonsterProperty(
                      ['aiDeck', 'basic'],
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
                value={getSelectedMonsterProperty(['aiDeck', 'legendary']) ?? 0}
                onChange={(value) =>
                  updateSelectedMonsterProperty(['aiDeck', 'legendary'], value)
                }
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-l"
                  type="number"
                  value={
                    getSelectedMonsterProperty(['aiDeck', 'legendary']) ?? 0
                  }
                  onChange={(e) =>
                    updateSelectedMonsterProperty(
                      ['aiDeck', 'legendary'],
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
                value={getSelectedMonsterProperty(['aiDeck', 'overtone']) ?? 0}
                onChange={(value) =>
                  updateSelectedMonsterProperty(['aiDeck', 'overtone'], value)
                }
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-o"
                  type="number"
                  value={
                    getSelectedMonsterProperty(['aiDeck', 'overtone']) ?? 0
                  }
                  onChange={(e) =>
                    updateSelectedMonsterProperty(
                      ['aiDeck', 'overtone'],
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
              value={getSelectedMonsterProperty('movement') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('movement', value)
              }
              min={0}
              readOnly={false}>
              <Input
                id="monster-movement"
                type="number"
                value={getSelectedMonsterProperty('movement') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'movement',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('toughness') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('toughness', value)
              }
              min={0}
              readOnly={false}>
              <Input
                id="monster-toughness"
                type="number"
                value={getSelectedMonsterProperty('toughness') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'toughness',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('speed') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('speed', value)
              }
              min={0}
              readOnly={false}>
              <Input
                id="monster-speed"
                type="number"
                value={getSelectedMonsterProperty('speed') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'speed',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('damage') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('damage', value)
              }
              min={0}
              readOnly={false}>
              <Input
                id="monster-damage"
                type="number"
                value={getSelectedMonsterProperty('damage') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'damage',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('movementTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('movementTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-movement-tokens"
                type="number"
                value={getSelectedMonsterProperty('movementTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'movementTokens',
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
              value={getSelectedMonsterProperty('speedTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('speedTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-speed-tokens"
                type="number"
                value={getSelectedMonsterProperty('speedTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'speedTokens',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('damageTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('damageTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-damage-tokens"
                type="number"
                value={getSelectedMonsterProperty('damageTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'damageTokens',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('accuracyTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('accuracyTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-accuracy-tokens"
                type="number"
                value={getSelectedMonsterProperty('accuracyTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'accuracyTokens',
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
              value={getSelectedMonsterProperty('strengthTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('strengthTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-strength-tokens"
                type="number"
                value={getSelectedMonsterProperty('strengthTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'strengthTokens',
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
              value={getSelectedMonsterProperty('evasionTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('evasionTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-evasion-tokens"
                type="number"
                value={getSelectedMonsterProperty('evasionTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'evasionTokens',
                    parseInt(e.target.value) ?? 0
                  )
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
              value={getSelectedMonsterProperty('luckTokens') ?? 0}
              onChange={(value) =>
                updateSelectedMonsterProperty('luckTokens', value)
              }
              readOnly={false}>
              <Input
                id="monster-luck-tokens"
                type="number"
                value={getSelectedMonsterProperty('luckTokens') ?? 0}
                onChange={(e) =>
                  updateSelectedMonsterProperty(
                    'luckTokens',
                    parseInt(e.target.value) ?? 0
                  )
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
            !selectedQuarryData ||
            !selectedMonsterLevel ||
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
