'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settlement } from '@/schemas/settlement'
import { Users } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Active Hunt Card Props
 */
interface ActiveHuntCardProps {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Settlement */
  settlement: Settlement
  /** Function to Save Settlement Data */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function ActiveHuntCard({
  form,
  settlement,
  saveSettlement
}: ActiveHuntCardProps): ReactElement {
  // Typing workaround...the settlement is guaranteed to have an active hunt
  if (!settlement.activeHunt) return <></>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Active Hunt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">Hunt in Progress</p>
            <p className="text-muted-foreground">
              Target: {settlement.activeHunt.quarryName}
            </p>
            <p className="text-sm text-muted-foreground">
              Started: {settlement.activeHunt.toString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
