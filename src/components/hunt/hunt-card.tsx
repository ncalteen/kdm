// https://ui.shadcn.com/docs/components/skeleton for selecting survivors

'use client'

import { Settlement } from '@/schemas/settlement'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hunt Card Props
 */
interface HuntCardProps {
  settlement: Settlement | null
  settlementForm: UseFormReturn<Settlement>
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
export function HuntCard({
  settlement,
  settlementForm,
  saveSettlement
}: HuntCardProps): ReactElement {
  return <>THIS IS THE HUNT CARD</>
}
