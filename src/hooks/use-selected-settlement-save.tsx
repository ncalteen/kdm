'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Settlement Custom Hook
 *
 * This hook provides a save function that automatically updates the settlement
 * context after saving data to localStorage, ensuring that the UI is
 * refreshed when settlement data changes.
 *
 * @param campaign Campaign
 * @param form Settlement Form
 * @param updateSelectedSettlement Callback to Update Selected Settlement Context
 * @param updateCampaign Callback to Update Campaign Context
 */
export function useSelectedSettlementSave(
  campaign: Campaign,
  form: UseFormReturn<Settlement>,
  updateSelectedSettlement: () => void,
  updateCampaign: (campaign: Campaign) => void
) {
  const { toast } = useToast(campaign)

  /**
   * Save Selected Settlement Data
   *
   * @param updateData Partial Settlement Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedSettlement = (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
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

      updateCampaign({
        ...campaign,
        settlements: campaign.settlements.map((s) =>
          s.id === formValues.id ? updatedSettlement : s
        )
      })
      updateSelectedSettlement()

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Settlement Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  return { saveSelectedSettlement }
}
