'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useMemo } from 'react'

/**
 * Hunt Survivors Card Properties
 */
interface HuntSurvivorsCardProps {
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
  /** Update Survivors */
  updateSurvivors: (survivors: Survivor[]) => void
}

/**
 * Hunt Survivors Card Component
 *
 * @param props Hunt Survivors Card Properties
 * @returns Hunt Survivors Card Component
 */
export function HuntSurvivorsCard({
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  survivors,
  updateSelectedSurvivor,
  updateSurvivors
}: HuntSurvivorsCardProps): ReactElement {
  const huntSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedHunt?.survivors) s = [...s, ...selectedHunt.survivors]
    if (selectedHunt?.scout) s = [...s, selectedHunt.scout]

    return s
  }, [selectedHunt?.survivors, selectedHunt?.scout])

  if (huntSurvivors.length === 0 || !selectedSettlement) return <></>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hunt Party</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {survivors
            ?.filter((s) => huntSurvivors.includes(s.id))
            .map((survivor) => (
              <HuntSurvivorCard
                key={survivor.id}
                selectedSettlement={selectedSettlement}
                selectedSurvivor={selectedSurvivor}
                survivor={survivor}
                survivors={survivors}
                updateSelectedSurvivor={updateSelectedSurvivor}
                updateSurvivors={updateSurvivors}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
