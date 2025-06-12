'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { Crown, UserCheck, Users } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * Hunt Card Props
 */
interface HuntCardProps {
  settlement: Settlement | null
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Survivor Selection Drawer Props
 */
interface SurvivorSelectionDrawerProps {
  title: string
  description: string
  survivors: Survivor[]
  selectedSurvivors: number[]
  onSelectionChange: (survivorIds: number[]) => void
  maxSelection: number
  children: React.ReactNode
}

/**
 * Survivor Selection Drawer Component
 */
function SurvivorSelectionDrawer({
  title,
  description,
  survivors,
  selectedSurvivors,
  onSelectionChange,
  maxSelection,
  children
}: SurvivorSelectionDrawerProps): ReactElement {
  const [tempSelection, setTempSelection] =
    useState<number[]>(selectedSurvivors)

  const handleSurvivorToggle = (survivorId: number) => {
    setTempSelection((prev) => {
      if (prev.includes(survivorId))
        return prev.filter((id) => id !== survivorId)
      else if (prev.length < maxSelection) return [...prev, survivorId]
      return prev
    })
  }

  const handleConfirm = () => onSelectionChange(tempSelection)

  const handleCancel = () => setTempSelection(selectedSurvivors)

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            {survivors.map((survivor) => (
              <Button
                key={survivor.id}
                variant={
                  tempSelection.includes(survivor.id) ? 'default' : 'outline'
                }
                className="justify-start h-auto p-3"
                onClick={() => handleSurvivorToggle(survivor.id)}
                disabled={
                  !tempSelection.includes(survivor.id) &&
                  tempSelection.length >= maxSelection
                }>
                <div className="flex items-center gap-2">
                  {tempSelection.includes(survivor.id) && (
                    <UserCheck className="h-4 w-4" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{survivor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {survivor.gender} • Hunt XP: {survivor.huntXP}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button onClick={handleConfirm}>
                Confirm Selection ({tempSelection.length}/{maxSelection})
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Scout Selection Drawer Component
 */
function ScoutSelectionDrawer({
  survivors,
  selectedScout,
  onSelectionChange,
  children
}: {
  survivors: Survivor[]
  selectedScout: number | null
  onSelectionChange: (scoutId: number | null) => void
  children: React.ReactNode
}): ReactElement {
  const [tempSelection, setTempSelection] = useState<number | null>(
    selectedScout
  )

  const handleConfirm = () => onSelectionChange(tempSelection)

  const handleCancel = () => setTempSelection(selectedScout)

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Scout</DrawerTitle>
          <DrawerDescription>
            Choose a survivor to act as scout for this hunt.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            {survivors.map((survivor) => (
              <Button
                key={survivor.id}
                variant={tempSelection === survivor.id ? 'default' : 'outline'}
                className="justify-start h-auto p-3"
                onClick={() =>
                  setTempSelection(
                    tempSelection === survivor.id ? null : survivor.id
                  )
                }>
                <div className="flex items-center gap-2">
                  {tempSelection === survivor.id && (
                    <Crown className="h-4 w-4" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{survivor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {survivor.gender} • Hunt XP: {survivor.huntXP}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button onClick={handleConfirm}>
                Confirm Scout ({tempSelection ? '1' : '0'}/1)
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function HuntCard({
  settlement,
  saveSettlement
}: HuntCardProps): ReactElement {
  const [selectedQuarry, setSelectedQuarry] = useState<string>('')
  const [selectedSurvivors, setSelectedSurvivors] = useState<number[]>([])
  const [selectedScout, setSelectedScout] = useState<number | null>(null)

  // Get available survivors for this settlement
  const availableSurvivors = useMemo(
    () =>
      settlement?.id
        ? getSurvivors(settlement.id).filter((survivor) => !survivor.dead)
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

  // Check if settlement has active hunt or showdown
  const hasActiveExpedition =
    settlement?.activeHunt || settlement?.activeShowdown

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
      'The hunt begins. Survivors venture into the darkness.'
    )

    // Reset form
    setSelectedQuarry('')
    setSelectedSurvivors([])
    setSelectedScout(null)
  }

  // Show current expedition status if one exists
  if (hasActiveExpedition) {
    const expedition = settlement.activeHunt || settlement.activeShowdown
    const expeditionType = settlement.activeHunt ? 'Hunt' : 'Showdown'
    const targetName = settlement.activeHunt
      ? settlement.activeHunt.quarryName
      : settlement.activeShowdown?.monsterName

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active {expeditionType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">
                {expeditionType} in Progress
              </p>
              <p className="text-muted-foreground">Target: {targetName}</p>
              <p className="text-sm text-muted-foreground">
                Started: {expedition?.toString()}
              </p>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Complete the current {expeditionType.toLowerCase()} before
              starting a new one.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Initiate Hunt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quarry Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Quarry</label>
            <Select value={selectedQuarry} onValueChange={setSelectedQuarry}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a quarry to hunt..." />
              </SelectTrigger>
              <SelectContent>
                {availableQuarries.map((quarry) => (
                  <SelectItem key={quarry.name} value={quarry.name}>
                    {quarry.name} ({quarry.node})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableQuarries.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No quarries available. Unlock quarries first.
              </p>
            )}
          </div>

          {/* Survivor Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Survivors</label>
            <SurvivorSelectionDrawer
              title="Select Hunt Party"
              description="Choose up to 4 survivors to embark on this hunt. Their courage will be tested in the darkness."
              survivors={availableSurvivors}
              selectedSurvivors={selectedSurvivors}
              onSelectionChange={setSelectedSurvivors}
              maxSelection={4}>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4" />
                {selectedSurvivors.length > 0
                  ? `${selectedSurvivors.length} survivor(s) selected`
                  : 'Select survivors...'}
              </Button>
            </SurvivorSelectionDrawer>
            {availableSurvivors.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No survivors available. Create survivors first.
              </p>
            )}
          </div>

          {/* Scout Selection (if settlement uses scouts) */}
          {settlement?.usesScouts && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Scout</label>
              <ScoutSelectionDrawer
                survivors={availableSurvivors}
                selectedScout={selectedScout}
                onSelectionChange={setSelectedScout}>
                <Button variant="outline" className="w-full justify-start">
                  <Crown className="h-4 w-4" />
                  {selectedScout
                    ? `Scout: ${
                        availableSurvivors.find((s) => s.id === selectedScout)
                          ?.name
                      }`
                    : 'Select scout...'}
                </Button>
              </ScoutSelectionDrawer>
            </div>
          )}

          {/* Initiate Hunt Button */}
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
        </div>
      </CardContent>
    </Card>
  )
}
