'use client'

import { ScoutSelectionCard } from '@/components/hunt/scout-selection/scout-selection-card'
import { SurvivorDetailsPanel } from '@/components/survivor/survivor-details-panel'
import { Button } from '@/components/ui/button'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { Survivor } from '@/schemas/survivor'
import { UserSearchIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Scout Selection Drawer Props
 */
interface ScoutSelectionDrawerProps {
  /** Drawer Description */
  description: string
  /** Callback for Selection Change */
  onSelectionChange: (scoutId: number | null) => void
  /** Currently Selected Scout */
  selectedScout: number | null
  /** Currently Selected Survivors (to disable in scout list) */
  selectedSurvivors?: number[]
  /** List of Survivors */
  survivors: Survivor[]
  /** Drawer Title */
  title: string
}

/**
 * Scout Selection Drawer Component
 */
export function ScoutSelectionDrawer({
  description,
  onSelectionChange,
  selectedScout,
  selectedSurvivors = [],
  survivors,
  title
}: ScoutSelectionDrawerProps): ReactElement {
  const isMobile = useIsMobile()

  const [tempSelection, setTempSelection] = useState<number | null>(
    selectedScout
  )
  const [hoveredSurvivor, setHoveredSurvivor] = useState<Survivor | null>(null)
  const [lastHoveredSurvivor, setLastHoveredSurvivor] =
    useState<Survivor | null>(null)

  const handleSurvivorToggle = (survivorId: number) =>
    // If clicking the currently selected scout, deselect them
    // Otherwise, select the clicked survivor as scout
    setTempSelection(tempSelection === survivorId ? null : survivorId)

  const handleSurvivorHover = (survivor: Survivor | null) => {
    setHoveredSurvivor(survivor)

    if (survivor) setLastHoveredSurvivor(survivor)
  }

  const handleConfirm = () => onSelectionChange(tempSelection)

  const handleCancel = () => setTempSelection(selectedScout)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          <UserSearchIcon className="h-4 w-4" />
          {selectedScout ? '1 scout' : 'Select scout...'}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 h-[60vh] flex gap-4">
          <div className="flex flex-wrap gap-2 overflow-y-auto min-w-[200px]">
            {survivors.map((survivor) => (
              <ScoutSelectionCard
                key={survivor.id}
                handleSurvivorToggle={handleSurvivorToggle}
                isCurrentlySelected={tempSelection === survivor.id}
                isSelectedAsSurvivor={selectedSurvivors.includes(survivor.id)}
                onHover={handleSurvivorHover}
                survivor={survivor}
              />
            ))}
          </div>

          {!isMobile && (
            <div className="w-[450px]">
              <SurvivorDetailsPanel
                survivor={hoveredSurvivor || lastHoveredSurvivor}
                survivors={survivors}
              />
            </div>
          )}
        </div>

        <DrawerFooter>
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button onClick={handleConfirm}>Confirm Selection</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
