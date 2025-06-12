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
import { Crown } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Scout Selection Drawer Props
 */
interface ScoutSelectionDrawerProps {
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
  survivors,
  selectedScout,
  onSelectionChange,
  children
}: ScoutSelectionDrawerProps): ReactElement {
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
