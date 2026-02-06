'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Selected Survivor Save Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * survivor context after saving data to localStorage, ensuring that the
 * SettlementSurvivorsCard table is refreshed when survivor data changes.
 *
 * @param campaign Campaign
 * @param form React Hook Form Return Object for Survivor
 * @param updateSelectedSurvivor Callback to Update Selected Survivor Context
 * @param updateCampaign Callback to Update Campaign Context
 */
export function useSelectedSurvivorSave(
  campaign: Campaign,
  form: UseFormReturn<Survivor>,
  updateSelectedSurvivor: () => void,
  updateCampaign: (campaign: Campaign) => void
) {
  const { toast } = useToast(campaign)

  /**
   * Save Selected Survivor
   *
   * @param updateData Partial Survivor Update Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedSurvivor = (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => {
    try {
      // For new survivors, updateData should contain the complete survivor data
      // including ID. For existing survivors, we merge with form values.
      let survivorToSave: Survivor
      let isNewSurvivor = false

      if ('id' in updateData && updateData.id) {
        // Check if this survivor already exists
        const existingSurvivor = campaign.survivors.find(
          (s) => s.id === updateData.id
        )
        if (!existingSurvivor) isNewSurvivor = true

        survivorToSave = existingSurvivor
          ? {
              ...existingSurvivor,
              ...updateData
            }
          : (updateData as Survivor)
      } else {
        // Partial update to existing survivor - use form values as base
        const formValues = form.getValues()
        const existingSurvivor = campaign.survivors.find(
          (s) => s.id === formValues.id
        )

        survivorToSave = existingSurvivor
          ? {
              ...existingSurvivor,
              ...updateData
            }
          : { ...formValues, ...updateData }
      }

      // Validate the updated survivor data
      SurvivorSchema.parse(survivorToSave)

      // Update the campaign survivors
      updateCampaign({
        ...campaign,
        survivors: isNewSurvivor
          ? [...campaign.survivors, survivorToSave]
          : campaign.survivors.map((s) =>
              s.id === survivorToSave.id ? survivorToSave : s
            )
      })
      updateSelectedSurvivor()

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Survivor Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  return { saveSelectedSurvivor }
}
