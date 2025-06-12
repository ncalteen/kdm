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
import { UserCheckIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Scout Selection Drawer Props
 */
interface ScoutSelectionDrawerProps {
  /** Drawer Title */
  title: string
  /** Drawer Description */
  description: string
  /** List of Survivors */
  survivors: Survivor[]
  /** Currently Selected Scout */
  selectedScout: number | null
  /** Callback for Selection Change */
  onSelectionChange: (scoutId: number | null) => void
  /** Children */
  children: React.ReactNode
}

/**
 * Scout Selection Drawer Component
 */
export function ScoutSelectionDrawer({
  title,
  description,
  survivors,
  selectedScout,
  onSelectionChange,
  children
}: ScoutSelectionDrawerProps): ReactElement {
  const [tempSelection, setTempSelection] = useState<number | null>(
    selectedScout
  )

  const handleSurvivorToggle = (survivorId: number) =>
    setTempSelection(survivorId)

  const handleConfirm = () => onSelectionChange(tempSelection)

  const handleCancel = () => setTempSelection(selectedScout)

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
                variant={tempSelection === survivor.id ? 'default' : 'outline'}
                className="justify-start h-auto p-3"
                onClick={() => handleSurvivorToggle(survivor.id)}
                disabled={tempSelection === survivor.id}>
                <div className="flex items-center gap-2">
                  {tempSelection === survivor.id && (
                    <UserCheckIcon className="h-4 w-4" />
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
              <Button onClick={handleConfirm}>Confirm Scout</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
