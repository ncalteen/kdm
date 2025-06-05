'use client'

import { useSurvivor } from '@/contexts/survivor-context'
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
export function useSurvivorSave(form: UseFormReturn<Survivor>) {
  const { updateSelectedSurvivor } = useSurvivor()

  /**
   * Save survivor data to localStorage and update context
   *
   * @param updateData Partial survivor data to update
   * @param successMsg Optional success message to display
   */
  const saveSurvivor = useCallback(
    (updateData: Partial<Survivor>, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const existingSurvivor = campaign.survivors.find(
          (s) => s.id === formValues.id
        )

        const updatedSurvivor = existingSurvivor
          ? {
              ...existingSurvivor,
              ...updateData
            }
          : { ...formValues, ...updateData }

        // Validate the updated survivor data
        SurvivorSchema.parse(updatedSurvivor)

        // If this is a new survivor, add them to the campaign
        if (!existingSurvivor) campaign.survivors.push(updatedSurvivor)

        saveCampaignToLocalStorage({
          ...campaign,
          survivors: campaign.survivors.map((s) =>
            s.id === formValues.id ? updatedSurvivor : s
          )
        })

        // Update the context to refresh the survivors table
        updateSelectedSurvivor()

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
