'use client'

import { ScoutSelectionDrawer } from '@/components/showdown/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/showdown/survivor-selection/survivor-selection-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AmbushType, ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
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
  const [selectedMonster, setSelectedMonster] = useState<string>('')
  const [selectedMonsterLevel, setSelectedMonsterLevel] =
    useState<MonsterLevel>(MonsterLevel.LEVEL_1)
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

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
      !selectedMonster ||
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

    const survivorColors = selectedSurvivors.map((survivorId) => ({
      id: survivorId,
      color: ColorChoice.SLATE
    }))

    if (selectedScout)
      survivorColors.push({
        id: selectedScout,
        color: ColorChoice.SLATE
      })

    // Save as partial data that will be merged by the hook
    const showdownData: Showdown = {
      // TODO FIX THIS
      ambush: AmbushType.NONE,
      id: getNextShowdownId(),
      monsterName: selectedMonster,
      monsterLevel: selectedMonsterLevel,
      // TODO FIX THIS
      monsterType: MonsterType.QUARRY,
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorColors,
      survivors: selectedSurvivors
    }

    saveSelectedShowdown(
      showdownData,
      `The showdown against ${selectedMonster} begins. ${showdownData.monsterType === MonsterType.QUARRY ? 'Survivors prepare themselves.' : 'Survivors must defend their home.'}`
    )

    // Reset form
    setSelectedMonster('')
    setSelectedMonsterLevel(MonsterLevel.LEVEL_1)
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
        {/* Showdown Monster */}
        <div className="flex items-center justify-between">
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Monster
          </label>
          <Select value={selectedMonster} onValueChange={setSelectedMonster}>
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
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Level
          </label>
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

        {[...availableQuarries, ...availableNemeses].length === 0 && (
          <p className="text-sm text-muted-foreground">
            No monsters available. Unlock monsters first.
          </p>
        )}

        {/* Survivors */}
        <div className="flex items-center justify-between">
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Survivors
          </label>
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
            <label className="text-left whitespace-nowrap min-w-[80px]">
              Scout
            </label>
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
            !selectedMonster ||
            availableSurvivors.length === 0 ||
            selectedSurvivors.length === 0 ||
            (selectedSettlement?.usesScouts && !selectedScout)
          }
          className="w-full">
          Begin Showdown
        </Button>
      </CardContent>
    </Card>
  )
}
