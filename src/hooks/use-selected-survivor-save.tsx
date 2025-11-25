'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Selected Survivor Save Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * survivor context after saving data to localStorage, ensuring that the
 * SettlementSurvivorsCard table is refreshed when survivor data changes.
 */
export function useSelectedSurvivorSave(
  form: UseFormReturn<Survivor>,
  updateSelectedSurvivor: () => void
) {
  const { toast } = useToast()

  /**
   * Save Selected Survivor
   *
   * @param updateData Partial Survivor Update Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedSurvivor = useCallback(
    (updateData: Partial<Survivor>, successMsg?: string) => {
      try {
        const campaign = getCampaign()

        // For new survivors, updateData should contain the complete survivor
        // data including ID. For existing survivors, we merge with form values.
        let survivorToSave: Survivor
        let isNewSurvivor = false

        if ('id' in updateData && updateData.id) {
          // Check if this survivor already exists
          const existingSurvivor = campaign.survivors.find(
            (s) => s.id === updateData.id
          )

          if (existingSurvivor) {
            // Existing survivor - merge the update data
            survivorToSave = {
              ...existingSurvivor,
              ...updateData
            }
          } else {
            // New survivor with full data provided
            survivorToSave = updateData as Survivor
            isNewSurvivor = true
          }
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

        // Update the campaign survivors array
        if (isNewSurvivor) campaign.survivors.push(survivorToSave)
        else
          campaign.survivors = campaign.survivors.map((s) =>
            s.id === survivorToSave.id ? survivorToSave : s
          )

        saveCampaignToLocalStorage(campaign)

        // Update the context to refresh the survivors table
        updateSelectedSurvivor()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Survivor Save Error:', error)

        if (error instanceof ZodError && error.errors[0]?.message)
          toast.error(error.errors[0].message)
        else toast.error(ERROR_MESSAGE())
      }
    },
    [form, toast, updateSelectedSurvivor]
  )

  return { saveSelectedSurvivor }
}
