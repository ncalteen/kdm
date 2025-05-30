'use client'

import { ArmsCard } from '@/components/survivor/combat/arms-card'
import { BodyCard } from '@/components/survivor/combat/body-card'
import { HeadCard } from '@/components/survivor/combat/head-card'
import { LegsCard } from '@/components/survivor/combat/legs-card'
import { WaistCard } from '@/components/survivor/combat/waist-card'
import { Card, CardContent } from '@/components/ui/card'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Combat Card Component
 *
 * This component displays the survivor's combat/physical status. It includes
 * armor points, severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Combat Card Component
 */
export function CombatCard({ ...form }: UseFormReturn<Survivor>): ReactElement {
  return (
    <div className="flex flex-col gap-1 mt-1">
      <Card className="border-0">
        <CardContent className="p-2 min-h-[80px]">
          <HeadCard {...form} />
        </CardContent>
      </Card>
      <hr />
      <Card className="border-0">
        <CardContent className="p-2 min-h-[80px]">
          <ArmsCard {...form} />
        </CardContent>
      </Card>
      <hr />
      <Card className="border-0">
        <CardContent className="p-2 min-h-[80px]">
          <BodyCard {...form} />
        </CardContent>
      </Card>
      <hr />
      <Card className="border-0">
        <CardContent className="p-2 min-h-[80px]">
          <WaistCard {...form} />
        </CardContent>
      </Card>
      <hr />
      <Card className="border-0">
        <CardContent className="p-2 min-h-[80px]">
          <LegsCard {...form} />
        </CardContent>
      </Card>
    </div>
  )
}
