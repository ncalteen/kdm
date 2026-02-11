'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import {
  SettlementPhase,
  SettlementPhaseSchema
} from '@/schemas/settlement-phase'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Settlement Phase Custom Hook
 *
 * This hook provides a save function that automatically updates the settlement
 * phase context after saving data to localStorage, ensuring that the UI is
 * refreshed when settlement phase data changes.
 *
 * @param campaign Campaign
 * @param form Settlement Phase Form
 * @param updateSelectedSettlementPhase Callback to Update Selected Settlement Phase Context
 * @param updateCampaign Callback to Update Campaign Context
 */
export function useSelectedSettlementPhaseSave(
  campaign: Campaign,
  form: UseFormReturn<SettlementPhase>,
  updateSelectedSettlementPhase: () => void,
  updateCampaign: (campaign: Campaign) => void
) {
  const { toast } = useToast(campaign)

  /**
   * Save Selected Settlement Phase Data
   *
   * @param updateData Partial Settlement Phase Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedSettlementPhase = (
    updateData: Partial<SettlementPhase>,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const existingSettlementPhase = campaign.settlementPhases.find(
        (sP) => sP.id === formValues.id
      )

      const updatedSettlementPhase = existingSettlementPhase
        ? {
            ...existingSettlementPhase,
            ...updateData
          }
        : { ...formValues, ...updateData }

      // Validate the updated settlement phase data
      SettlementPhaseSchema.parse(updatedSettlementPhase)

      // If this is a new settlement phase, add them to the campaign
      if (!existingSettlementPhase)
        campaign.settlementPhases.push(updatedSettlementPhase)

      updateCampaign({
        ...campaign,
        settlementPhases: campaign.settlementPhases.map((sP) =>
          sP.id === formValues.id ? updatedSettlementPhase : sP
        )
      })
      updateSelectedSettlementPhase()

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Settlement Phase Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  return { saveSelectedSettlementPhase }
}
