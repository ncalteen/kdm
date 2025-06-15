'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActiveHunt } from '@/schemas/active-hunt'
import { ReactElement, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hunt Survivors Card Props
 */
interface HuntSurvivorsCardProps {
  /** Active Hunt Form */
  form: UseFormReturn<ActiveHunt>
  /** Active Hunt */
  activeHunt: ActiveHunt
  /** Function to Save Active Hunt */
  saveActiveHunt: (updateData: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Hunt Survivors Card Component
 *
 * Displays updatable information for all survivors in the active hunt
 */
export function HuntSurvivorsCard({
  form,
  activeHunt,
  saveActiveHunt
}: HuntSurvivorsCardProps): ReactElement {
  const huntSurvivors = useMemo(
    () => [
      ...activeHunt.survivors,
      ...(activeHunt.scout ? [activeHunt.scout] : [])
    ],
    [activeHunt.survivors, activeHunt.scout]
  )

  if (huntSurvivors.length === 0) return <></>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hunt Party</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {huntSurvivors.map((survivor) => (
            <HuntSurvivorCard
              key={survivor.id}
              survivor={survivor}
              saveActiveHunt={saveActiveHunt}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
