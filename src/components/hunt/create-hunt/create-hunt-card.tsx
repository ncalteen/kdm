'use client'

import { ScoutSelectionDrawer } from '@/components/hunt/scout-selection/scout-selection-drawer'
import { SurvivorSelectionDrawer } from '@/components/hunt/survivor-selection/survivor-selection-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getSelectedSettlement, getSurvivors } from '@/lib/utils'
import { ActiveHunt } from '@/schemas/active-hunt'
import { PawPrintIcon } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Hunt Card Props
 */
interface CreateHuntCardProps {
  /** Active Hunt Form Data */
  form: UseFormReturn<ActiveHunt>
  /** Function to Save Active Hunt */
  saveActiveHunt: (updateData: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Create Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function CreateHuntCard({
  form,
  saveActiveHunt
}: CreateHuntCardProps): ReactElement {
  const [selectedQuarry, setSelectedQuarry] = useState<string>('')
  const [selectedQuarryLevel, setSelectedQuarryLevel] = useState<
    '1' | '2' | '3' | '4'
  >('1')
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

  // Get current settlement to access available quarries and survivors
  const settlement = getSelectedSettlement()

  // Get available survivors for this settlement
  const availableSurvivors = useMemo(
    () =>
      settlement?.id
        ? getSurvivors(settlement.id).filter(
            (survivor) => !survivor.dead && !survivor.retired
          )
        : [],
    [settlement?.id]
  )

  // Get available quarries (unlocked ones)
  const availableQuarries = useMemo(
    () =>
      settlement?.quarries
        ? settlement.quarries.filter((quarry) => quarry.unlocked)
        : [],
    [settlement?.quarries]
  )

  // Handle hunt initiation
  const handleInitiateHunt = () => {
    if (!settlement || !selectedQuarry || selectedSurvivors.length === 0)
      return toast.error('The darkness swallows your words. Please try again.')

    // Validate scout selection if settlement uses scouts
    if (settlement.usesScouts && !selectedScout)
      return toast.error('A scout must be selected for the hunt.')

    // Get full survivor objects for the selected survivors
    const allSurvivors = getSurvivors(settlement.id)
    const huntSurvivors = allSurvivors.filter((survivor) =>
      selectedSurvivors.includes(survivor.id)
    )
    const scoutSurvivor = selectedScout
      ? allSurvivors.find((survivor) => survivor.id === selectedScout)
      : undefined

    // Save as partial data that will be merged by the hook
    const huntData: Partial<ActiveHunt> = {
      quarryName: selectedQuarry,
      quarryLevel: selectedQuarryLevel,
      survivors: huntSurvivors,
      scout: scoutSurvivor,
      survivorPosition: 0,
      quarryPosition: 12,
      ambush: false
    }

    saveActiveHunt(
      huntData,
      `The hunt for ${selectedQuarry} begins. Survivors venture into the darkness.`
    )

    // Reset form
    setSelectedQuarry('')
    setSelectedQuarryLevel('1')
    setSelectedSurvivors([])
    setSelectedScout(null)
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
        <FormField
          control={form.control}
          name="quarryName"
          render={() => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-left whitespace-nowrap min-w-[80px]">
                  Quarry
                </FormLabel>
                <FormControl>
                  <Select
                    value={selectedQuarry}
                    onValueChange={setSelectedQuarry}>
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
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Quarry Level */}
        <FormField
          control={form.control}
          name="quarryLevel"
          render={() => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-left whitespace-nowrap min-w-[80px]">
                  Level
                </FormLabel>
                <FormControl>
                  <Select
                    value={selectedQuarryLevel}
                    onValueChange={(value: '1' | '2' | '3' | '4') =>
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
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {availableQuarries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No quarries available. Unlock quarries first.
          </p>
        )}

        {/* Survivors */}
        <div className="flex items-center justify-between">
          <FormLabel className="text-left whitespace-nowrap min-w-[80px]">
            Survivors
          </FormLabel>
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
        {availableSurvivors.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No survivors available. Create survivors first.
          </p>
        )}

        {/* Scout */}
        {settlement?.usesScouts && (
          <>
            <div className="flex items-center justify-between">
              <FormLabel className="text-left whitespace-nowrap min-w-[80px]">
                Scout
              </FormLabel>
              <ScoutSelectionDrawer
                title="Select Scout"
                description="Choose a single scout. Their skills will help navigate the dangers ahead."
                survivors={availableSurvivors}
                selectedSurvivors={selectedSurvivors}
                selectedScout={selectedScout}
                onSelectionChange={setSelectedScout}
              />
            </div>
            {availableSurvivors.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No survivors available. Create survivors first.
              </p>
            )}
          </>
        )}

        {/* Begin Hunt Button */}
        <Button
          onClick={handleInitiateHunt}
          disabled={
            !selectedQuarry ||
            selectedSurvivors.length === 0 ||
            (settlement?.usesScouts && !selectedScout)
          }
          className="w-full">
          Begin Hunt
        </Button>
      </CardContent>
    </Card>
  )
}
