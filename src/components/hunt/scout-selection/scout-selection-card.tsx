'use client'

import { Button } from '@/components/ui/button'
import { Survivor } from '@/schemas/survivor'
import { UserCheckIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Scout Selection Card Props
 */
interface ScoutSelectionCardProps extends Survivor {
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Survivor Selected as Scout */
  isCurrentlySelected: boolean
  /** Survivor is Selected for Hunt Party */
  isSelectedAsSurvivor: boolean
}

/**
 * Scout Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function ScoutSelectionCard({
  handleSurvivorToggle,
  isCurrentlySelected,
  isSelectedAsSurvivor,
  ...survivor
}: ScoutSelectionCardProps): ReactElement {
  return (
    <Button
      key={survivor.id}
      variant={isCurrentlySelected ? 'default' : 'outline'}
      className="justify-start h-auto p-3"
      onClick={() => handleSurvivorToggle(survivor.id)}
      disabled={isSelectedAsSurvivor}>
      <div className="flex items-center gap-2">
        {isCurrentlySelected && <UserCheckIcon className="h-4 w-4" />}
        <div className="text-left">
          <div className="font-medium">
            {survivor.name}
            {isSelectedAsSurvivor && (
              <span className="text-xs text-muted-foreground ml-1">
                (In Hunt Party)
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {survivor.gender} • Hunt XP: {survivor.huntXP}
          </div>
        </div>
      </div>
    </Button>
  )
}
