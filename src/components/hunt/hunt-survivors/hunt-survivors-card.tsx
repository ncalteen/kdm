'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import { Card, CardContent } from '@/components/ui/card'
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
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
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
  setSurvivors,
  survivors,
  updateSelectedSurvivor
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
      <CardContent className="flex flex-wrap gap-2 justify-start">
        {survivors
          ?.filter((s) => huntSurvivors.includes(s.id))
          .map((survivor) => (
            <HuntSurvivorCard
              key={survivor.id}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
              setSurvivors={setSurvivors}
              survivor={survivor}
              survivors={survivors}
              updateSelectedSurvivor={updateSelectedSurvivor}
            />
          ))}
      </CardContent>
    </Card>
  )
}
