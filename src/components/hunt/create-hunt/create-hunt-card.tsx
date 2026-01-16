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
import { ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_BEGINS_MESSAGE,
  SCOUT_CONFLICT_MESSAGE,
  SCOUT_REQUIRED_MESSAGE,
  SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE
} from '@/lib/messages'
import { QUARRIES } from '@/lib/monsters'
import { getNextHuntId, getQuarryDataByName } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { HuntSurvivorDetails } from '@/schemas/hunt-survivor-details'
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
  const [selectedScout, setSelectedScout] = useState<number | null>(null)
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedQuarryData, setSelectedQuarryData] = useState<
    QuarryMonsterData | undefined
  >(undefined)

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

  // Handle monster selection and auto-populate form
  const handleMonsterSelection = (quarryName: string) => {
    const quarryData = getQuarryDataByName(campaign, quarryName)

    if (!quarryData) {
      console.error(
        'CreateHuntCard: Monster Data Not Found for Quarry:',
        quarryName
      )
      toast.error(
        'The darkness swallows this quarry. Its details cannot be found — check your custom monster data and try again.'
      )
      return
    }

    setSelectedQuarryData(quarryData)

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

    if (!levelToUse) return
    setSelectedMonsterLevel(levelToUse)
  }

  const handleCreateHunt = () => {
    if (
      selectedShowdown &&
      selectedShowdown.settlementId === selectedSettlement?.id
    )
      return toast.error(SHOWDOWN_ALREADY_ACTIVE_ERROR_MESSAGE())

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

    const survivorDetails: HuntSurvivorDetails[] = selectedSurvivors.map(
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

    const levelData = selectedQuarryData[selectedMonsterLevel]

    if (!levelData) {
      console.error(
        'CreateHuntCard: Level Data Not Found for Quarry:',
        selectedQuarryData.name,
        selectedMonsterLevel
      )
      toast.error(
        'The darkness swallows this quarry. Its level details cannot be found — check your custom monster data and try again.'
      )
      return
    }

    // Save as partial data that will be merged by the hook
    const huntData: Hunt = {
      huntBoard: selectedQuarryData.huntBoard,
      id: getNextHuntId(campaign),
      level: selectedMonsterLevel,
      monsters:
        selectedQuarryData[selectedMonsterLevel]?.map((quarry) => ({
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
          // For multi-monster encounters, use each sub-monster's name. Or, use
          // the main monster name.
          name: quarry.name ?? selectedQuarryData.name,
          notes: '',
          speed: quarry.speed,
          speedTokens: quarry.speedTokens,
          strength: quarry.strength,
          strengthTokens: quarry.strengthTokens,
          toughness: quarry.toughness,
          traits: quarry.traits,
          type: MonsterType.QUARRY,
          wounds: 0
        })) ?? [],
      monsterPosition:
        selectedQuarryData[selectedMonsterLevel]?.[selectedHuntMonsterIndex]
          ?.huntPos ?? 12,
      scout: selectedScout ?? undefined,
      settlementId: selectedSettlement.id,
      survivorDetails,
      survivorPosition:
        selectedQuarryData[selectedMonsterLevel]?.[selectedHuntMonsterIndex]
          ?.survivorHuntPos ?? 12,
      survivors: selectedSurvivors
    }

    saveSelectedHunt(huntData, HUNT_BEGINS_MESSAGE(selectedQuarryData.name))

    // Reset form
    setSelectedQuarryData(undefined)
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
    setAvailableLevels([])
    setSelectedSurvivors([])
    setSelectedSurvivor(null)
    setSelectedScout(null)
    setSelectedHunt(huntData)
  }

  const setSelectedMonsterAIDeckACards = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].aiDeck.advanced =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterAIDeckBCards = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].aiDeck.basic = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterAIDeckLCards = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].aiDeck.legendary =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterAIDeckOCards = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].aiDeck.overtone =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterMovement = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].movement = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterToughness = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].toughness = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterSpeed = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].speed = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterDamage = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].damage = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterMovementTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].movementTokens =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterSpeedTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].speedTokens = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterDamageTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].damageTokens = value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterAccuracyTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].accuracyTokens =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterStrengthTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].strengthTokens =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterEvasionTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].evasionTokens =
      value
    setSelectedQuarryData(updated)
  }

  const setSelectedMonsterLuckTokens = (value: number) => {
    const updated = Object.assign({}, selectedQuarryData)
    if (!updated[selectedMonsterLevel]) return
    updated[selectedMonsterLevel][selectedHuntMonsterIndex].luckTokens = value
    setSelectedQuarryData(updated)
  }

  const handlePrevious = () => {
    const length = selectedQuarryData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex - 1 + length) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

  const handleNext = () => {
    const length = selectedQuarryData?.[selectedMonsterLevel]?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex + 1) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

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
              setSelectedMonsterLevel(value as MonsterLevel)
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

        <Separator className="my-2" />

        {selectedQuarryData &&
          selectedQuarryData[selectedMonsterLevel] &&
          selectedQuarryData[selectedMonsterLevel].length > 1 && (
            <div>
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground text-center">
                  {
                    selectedQuarryData[selectedMonsterLevel][
                      selectedHuntMonsterIndex
                    ].name
                  }
                </h3>
              </div>

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
            </div>
          )}

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
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
                  ].aiDeck.advanced ?? 0
                }
                onChange={setSelectedMonsterAIDeckACards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-a"
                  type="number"
                  value={
                    selectedQuarryData?.[selectedMonsterLevel]?.[
                      selectedHuntMonsterIndex
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
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
                  ].aiDeck.basic ?? 0
                }
                onChange={setSelectedMonsterAIDeckBCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-b"
                  type="number"
                  value={
                    selectedQuarryData?.[selectedMonsterLevel]?.[
                      selectedHuntMonsterIndex
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
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
                  ].aiDeck.legendary ?? 0
                }
                onChange={setSelectedMonsterAIDeckLCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-l"
                  type="number"
                  value={
                    selectedQuarryData?.[selectedMonsterLevel]?.[
                      selectedHuntMonsterIndex
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
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
                  ].aiDeck.overtone ?? 0
                }
                onChange={setSelectedMonsterAIDeckOCards}
                min={0}
                readOnly={false}>
                <Input
                  id="monster-ai-deck-o"
                  type="number"
                  value={
                    selectedQuarryData?.[selectedMonsterLevel]?.[
                      selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].movement ?? 0
              }
              onChange={setSelectedMonsterMovement}
              min={0}
              readOnly={false}>
              <Input
                id="monster-movement"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].toughness ?? 0
              }
              onChange={setSelectedMonsterToughness}
              min={0}
              readOnly={false}>
              <Input
                id="monster-toughness"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].speed ?? 0
              }
              onChange={setSelectedMonsterSpeed}
              min={0}
              readOnly={false}>
              <Input
                id="monster-speed"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].damage ?? 0
              }
              onChange={setSelectedMonsterDamage}
              min={0}
              readOnly={false}>
              <Input
                id="monster-damage"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].movementTokens ?? 0
              }
              onChange={setSelectedMonsterMovementTokens}
              readOnly={false}>
              <Input
                id="monster-movement-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].speedTokens ?? 0
              }
              onChange={setSelectedMonsterSpeedTokens}
              readOnly={false}>
              <Input
                id="monster-speed-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].damageTokens ?? 0
              }
              onChange={setSelectedMonsterDamageTokens}
              readOnly={false}>
              <Input
                id="monster-damage-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].accuracyTokens ?? 0
              }
              onChange={setSelectedMonsterAccuracyTokens}
              readOnly={false}>
              <Input
                id="monster-accuracy-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].strengthTokens ?? 0
              }
              onChange={setSelectedMonsterStrengthTokens}
              readOnly={false}>
              <Input
                id="monster-strength-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].evasionTokens ?? 0
              }
              onChange={setSelectedMonsterEvasionTokens}
              readOnly={false}>
              <Input
                id="monster-evasion-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
                selectedQuarryData?.[selectedMonsterLevel]?.[
                  selectedHuntMonsterIndex
                ].luckTokens ?? 0
              }
              onChange={setSelectedMonsterLuckTokens}
              readOnly={false}>
              <Input
                id="monster-luck-tokens"
                type="number"
                value={
                  selectedQuarryData?.[selectedMonsterLevel]?.[
                    selectedHuntMonsterIndex
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
