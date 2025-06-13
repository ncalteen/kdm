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
import { getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Users } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Hunt Card Props
 */
interface CreateHuntCardProps {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Settlement */
  settlement: Settlement | null
  /** Function to Save Settlement Data */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Create Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function CreateHuntCard({
  form,
  settlement,
  saveSettlement
}: CreateHuntCardProps): ReactElement {
  const [selectedQuarry, setSelectedQuarry] = useState<string>('')
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

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

  // Typing workaround...the settlement is guaranteed to not have an active hunt
  if (settlement && settlement.activeHunt) return <></>

  // Handle hunt initiation
  const handleInitiateHunt = () => {
    if (!settlement || !selectedQuarry || selectedSurvivors.length === 0)
      return toast.error('The darkness swallows your words. Please try again.')

    // Validate scout selection if settlement uses scouts
    if (settlement.usesScouts && !selectedScout)
      return toast.error('A scout must be selected for the hunt.')

    const activeHunt = {
      quarryName: selectedQuarry,
      selectedSurvivors,
      selectedScout: selectedScout || undefined,
      startedAt: new Date()
    }

    saveSettlement(
      { activeHunt },
      `The hunt for ${selectedQuarry} begins. Survivors venture into the darkness.`
    )

    // Reset form
    setSelectedQuarry('')
    setSelectedSurvivors([])
    setSelectedScout(null)
  }

  return (
    <Card className="max-w-[500px] mt-10 mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Initiate Hunt
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        {/* Hunt Quarry */}
        <FormField
          control={form.control}
          name="activeHunt.quarryName"
          render={() => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                  Quarry
                </FormLabel>
                <FormControl>
                  <Select
                    value={selectedQuarry}
                    onValueChange={setSelectedQuarry}>
                    <SelectTrigger className="w-[165px]">
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
        {availableQuarries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No quarries available. Unlock quarries first.
          </p>
        )}

        {/* Survivors */}
        <div className="flex items-center justify-between">
          <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
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
              <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
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

        {/* Validation Messages */}
        {selectedQuarry && selectedSurvivors.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Select at least one survivor to begin the hunt.
          </p>
        )}
        {settlement?.usesScouts &&
          selectedQuarry &&
          selectedSurvivors.length > 0 &&
          !selectedScout && (
            <p className="text-sm text-muted-foreground text-center">
              This settlement uses scouts. Select a scout to continue.
            </p>
          )}
      </CardContent>
    </Card>
  )
}
