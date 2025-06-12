'use client'

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
import { Survivor } from '@/schemas/survivor'
import { UsersIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { SurvivorSelectionCard } from './survivor-selection-card'

/**
 * Survivor Selection Drawer Props
 */
interface SurvivorSelectionDrawerProps {
  /** Drawer Title */
  title: string
  /** Drawer Description */
  description: string
  /** List of Survivors */
  survivors: Survivor[]
  /** Currently Selected Survivors */
  selectedSurvivors: number[]
  /** Callback for Selection Change */
  onSelectionChange: (survivorIds: number[]) => void
  /** Maximum Survivors */
  maxSelection: number
  /** Currently Selected Scout ID (to disable in survivor list) */
  selectedScout?: number | null
}

/**
 * Survivor Selection Drawer Component
 */
export function SurvivorSelectionDrawer({
  title,
  description,
  survivors,
  selectedSurvivors,
  onSelectionChange,
  maxSelection,
  selectedScout
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
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start w-[165px]">
          <UsersIcon className="h-4 w-4" />
          {selectedSurvivors.length > 0
            ? `${selectedSurvivors.length} survivor(s)`
            : 'Select survivors...'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[30vh] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {survivors.map((survivor) => (
              <SurvivorSelectionCard
                key={survivor.id}
                {...survivor}
                isSelectedAsScout={selectedScout === survivor.id}
                isDisabled={
                  selectedScout === survivor.id ||
                  (!tempSelection.includes(survivor.id) &&
                    tempSelection.length >= maxSelection)
                }
                handleSurvivorToggle={handleSurvivorToggle}
                tempSelection={tempSelection}
              />
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
