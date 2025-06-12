'use client'

import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Custom hook for saving survivor data with automatic context updates
 *
 * This hook provides a save function that automatically updates the survivor
 * context after saving data to localStorage, ensuring that the
 * SettlementSurvivorsCard table is refreshed when survivor data changes.
 */
export function useSurvivorSave(
  form: UseFormReturn<Survivor>,
  updateSelectedSurvivor: () => void
) {
  /**
   * Save survivor data to localStorage and update context
   *
   * @param updateData Partial survivor data to update
   * @param successMsg Optional success message to display
   */
  const saveSurvivor = useCallback(
    (updateData: Partial<Survivor>, successMsg?: string) => {
      try {
        const campaign = getCampaign()

        // For new survivors, updateData should contain the complete survivor data including ID
        // For existing survivors, we merge with form values
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
        if (isNewSurvivor) {
          campaign.survivors.push(survivorToSave)
        } else {
          campaign.survivors = campaign.survivors.map((s) =>
            s.id === survivorToSave.id ? survivorToSave : s
          )
        }

        saveCampaignToLocalStorage(campaign)

        // Update the context to refresh the survivors table
        updateSelectedSurvivor()

        // Dispatch custom event to notify other components about survivor changes
        window.dispatchEvent(new CustomEvent('survivorsUpdated'))

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Survivor Save Error:', error)

        if (error instanceof ZodError && error.errors[0]?.message)
          toast.error(error.errors[0].message)
        else toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form, updateSelectedSurvivor]
  )

  return { saveSurvivor }
}
