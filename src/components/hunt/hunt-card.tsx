'use client'

import { ActiveHuntCard } from '@/components/hunt/active-hunt/active-hunt-card'
import { CreateHuntCard } from '@/components/hunt/create-hunt/create-hunt-card'
import { ActiveHunt } from '@/schemas/active-hunt'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hunt Card Props
 */
interface HuntCardProps {
  /** Active Hunt Form Data */
  form: UseFormReturn<ActiveHunt>
  /** Selected Active Hunt */
  activeHunt: ActiveHunt | null
  /** Function to Save Active Hunt */
  saveActiveHunt: (updateData: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Hunt Card Component
 *
 * Displays hunt initiation interface when no active hunt or showdown exists.
 * Allows selection of quarry, survivors, and scout (if settlement uses scouts).
 */
export function HuntCard({
  form,
  activeHunt,
  saveActiveHunt
}: HuntCardProps): ReactElement {
  return activeHunt ? (
    <ActiveHuntCard
      form={form}
      activeHunt={activeHunt}
      saveActiveHunt={saveActiveHunt}
    />
  ) : (
    <CreateHuntCard form={form} saveActiveHunt={saveActiveHunt} />
  )
}
