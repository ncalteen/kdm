'use client'

import { Button } from '@/components/ui/button'
import { Survivor } from '@/schemas/survivor'
import { UserCheckIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Survivor Selection Card Props
 */
interface SurvivorSelectionCardProps extends Survivor {
  /** Survivor Selected as Scout */
  isSelectedAsScout: boolean
  /** Survivor is Disabled */
  isDisabled: boolean
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Temporary Selection State */
  tempSelection: number[]
}

/**
 * Survivor Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function SurvivorSelectionCard({
  handleSurvivorToggle,
  isSelectedAsScout,
  isDisabled,
  tempSelection,
  ...survivor
}: SurvivorSelectionCardProps): ReactElement {
  return (
    <Button
      key={survivor.id}
      variant={tempSelection.includes(survivor.id) ? 'default' : 'outline'}
      className="justify-start h-auto p-3"
      onClick={() => handleSurvivorToggle(survivor.id)}
      disabled={isDisabled}>
      <div className="flex items-center gap-2">
        {tempSelection.includes(survivor.id) && (
          <UserCheckIcon className="h-4 w-4" />
        )}
        <div className="text-left">
          <div className="font-medium">
            {survivor.name}
            {isSelectedAsScout && (
              <span className="text-xs text-muted-foreground ml-1">
                (Scout)
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
