'use client'

import { ScoutSelectionDrawer } from '@/components/hunt/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/hunt/survivor-selection/survivor-selection-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ColorChoice, MonsterLevel } from '@/lib/enums'
import { getNextHuntId } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
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
  setSelectedHunt,
  survivors
}: CreateHuntCardProps): ReactElement {
  console.log(selectedSettlement)
  const [selectedQuarry, setSelectedQuarry] = useState<string>('')
  const [selectedQuarryLevel, setSelectedQuarryLevel] = useState<MonsterLevel>(
    MonsterLevel.LEVEL_1
  )
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

  // Create Hunt
  const handleCreateHunt = () => {
    if (
      !selectedSettlement ||
      !selectedQuarry ||
      selectedSurvivors.length === 0
    )
      return toast.error('The darkness swallows your words. Please try again.')

    // Validate scout selection if settlement uses scouts
    if (selectedSettlement.usesScouts && !selectedScout)
      return toast.error('A scout must be selected for the hunt.')

    // Validate that scout is not also a selected survivor
    if (
      selectedSettlement.usesScouts &&
      selectedScout &&
      selectedSurvivors.includes(selectedScout)
    )
      return toast.error(
        'The selected scout cannot also be one of the selected survivors for the hunt.'
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
    const huntData: Hunt = {
      ambush: false,
      id: getNextHuntId(),
      quarryName: selectedQuarry,
      quarryLevel: selectedQuarryLevel,
      quarryPosition: 12,
      scout: selectedScout || undefined,
      settlementId: selectedSettlement.id,
      survivorColors,
      survivorPosition: 0,
      survivors: selectedSurvivors
    }

    saveSelectedHunt(
      huntData,
      `The hunt for ${selectedQuarry} begins. Survivors venture into the darkness.`
    )

    // Reset form
    setSelectedQuarry('')
    setSelectedQuarryLevel(MonsterLevel.LEVEL_1)
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
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Quarry
          </label>
          <Select value={selectedQuarry} onValueChange={setSelectedQuarry}>
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

        {/* Quarry Level */}
        <div className="flex items-center justify-between">
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Level
          </label>
          <Select
            value={selectedQuarryLevel}
            onValueChange={(value: MonsterLevel) =>
              setSelectedQuarryLevel(value)
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

        {availableQuarries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No quarries available. Unlock quarries first.
          </p>
        )}

        {/* Survivors */}
        <div className="flex items-center justify-between">
          <label className="text-left whitespace-nowrap min-w-[80px]">
            Survivors
          </label>
          <SurvivorSelectionDrawer
            title="Select Hunt Party"
            description="Choose up to 4 survivors to embark on this hunt."
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

        {/* Begin Hunt Button */}
        <Button
          onClick={handleCreateHunt}
          disabled={
            !selectedQuarry ||
            availableSurvivors.length === 0 ||
            selectedSurvivors.length === 0 ||
            (selectedSettlement?.usesScouts && !selectedScout)
          }
          className="w-full">
          Begin Hunt
        </Button>
      </CardContent>
    </Card>
  )
}
