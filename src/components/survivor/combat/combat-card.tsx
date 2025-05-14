'use client'

import { ArmsCard } from '@/components/survivor/combat/arms-card'
import { BodyCard } from '@/components/survivor/combat/body-card'
import { HeadCard } from '@/components/survivor/combat/head-card'
import { LegsCard } from '@/components/survivor/combat/legs-card'
import { WaistCard } from '@/components/survivor/combat/waist-card'
import { Card, CardContent } from '@/components/ui/card'
import { SurvivorType } from '@/lib/enums'
import { getSettlement } from '@/lib/utils'
import { SurvivorSchema } from '@/schemas/survivor'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Combat Card Component
 *
 * This component displays the survivor's combat/physical status. It includes
 * armor points, severe injuries, and light/heavy damage.
 *
 * @param form Form
 * @returns Combat Card Component
 */
export function CombatCard(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  // Get the survivor type from the settlement data.
  const [survivorType, setSurvivorType] = useState<SurvivorType | undefined>(
    undefined
  )

  // Set the survivor type when the component mounts.
  useEffect(() => {
    const settlement = getSettlement(form.getValues('settlementId'))
    setSurvivorType(settlement?.survivorType)
  }, [form])

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Card>
        <CardContent className="pt-2 pb-2">
          <HeadCard {...form} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-2 pb-2">
          <ArmsCard {...form} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-2 pb-2">
          <BodyCard {...form} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-2 pb-2">
          <WaistCard {...form} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-2 pb-2">
          <LegsCard {...form} />
        </CardContent>
      </Card>
    </div>
  )
}
