'use client'

import { ActiveHuntCard } from '@/components/hunt/active-hunt/active-hunt-card'
import { CreateHuntCard } from '@/components/hunt/create-hunt/create-hunt-card'
import { Settlement } from '@/schemas/settlement'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hunt Card Props
 */
interface HuntCardProps {
  /** Settlement form instance */
  form: UseFormReturn<Settlement>
  /** Settlement */
  settlement: Settlement | null
  /** Function to Save Settlement Data */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function HuntCard({
  form,
  settlement,
  saveSettlement
}: HuntCardProps): ReactElement {
  return settlement?.activeHunt ? (
    <ActiveHuntCard
      form={form}
      settlement={settlement}
      saveSettlement={saveSettlement}
    />
  ) : (
    <CreateHuntCard
      form={form}
      settlement={settlement}
      saveSettlement={saveSettlement}
    />
  )
}
