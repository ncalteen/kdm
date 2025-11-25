'use client'

import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Save Selected Settlement Custom Hook
 *
 * This hook provides a save function that automatically updates the settlement
 * context after saving data to localStorage, ensuring that the UI is
 * refreshed when settlement data changes.
 */
export function useSelectedSettlementSave(
  form: UseFormReturn<Settlement>,
  updateSelectedSettlement: () => void
) {
  /**
   * Save Selected Settlement Data
   *
   * @param updateData Partial Settlement Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedSettlement = useCallback(
    (updateData: Partial<Settlement>, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const existingSettlement = campaign.settlements.find(
          (s) => s.id === formValues.id
        )

        const updatedSettlement = existingSettlement
          ? {
              ...existingSettlement,
              ...updateData
            }
          : { ...formValues, ...updateData }

        // Validate the updated settlement data
        SettlementSchema.parse(updatedSettlement)

        // If this is a new settlement, add them to the campaign
        if (!existingSettlement) campaign.settlements.push(updatedSettlement)

        saveCampaignToLocalStorage({
          ...campaign,
          settlements: campaign.settlements.map((s) =>
            s.id === formValues.id ? updatedSettlement : s
          )
        })

        // Update the context to refresh the settlements list
        updateSelectedSettlement()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Settlement Save Error:', error)

        if (error instanceof ZodError && error.errors[0]?.message)
          toast.error(error.errors[0].message)
        else toast.error(ERROR_MESSAGE())
      }
    },
    [form, updateSelectedSettlement]
  )

  return { saveSelectedSettlement }
}
