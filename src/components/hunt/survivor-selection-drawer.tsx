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
import { UserCheck } from 'lucide-react'
import { ReactElement, useState } from 'react'

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
  /** Children */
  children: React.ReactNode
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
