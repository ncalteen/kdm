'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Showdown, ShowdownSchema } from '@/schemas/showdown'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Showdown Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * showdown context after saving data to localStorage, ensuring that the UI is
 * refreshed when active showdown data changes.
 */
export function useSelectedShowdownSave(
  form: UseFormReturn<Showdown>,
  updateSelectedShowdown: () => void
) {
  const { toast } = useToast()

  /**
   * Save Selected Showdown Data
   *
   * @param updateData Partial Selected Showdown Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedShowdown = useCallback(
    (updateData: Partial<Showdown>, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const existingShowdown = campaign.showdowns?.find(
          (h) => h.id === campaign.selectedShowdownId
        )

        const updatedShowdown = existingShowdown
          ? {
              ...existingShowdown,
              ...updateData
            }
          : { ...formValues, ...updateData }

        // Validate the updated showdown data
        ShowdownSchema.parse(updatedShowdown)

        // If this is a new showdown, add them to the campaign
        if (!existingShowdown) campaign.showdowns?.push(updatedShowdown)

        saveCampaignToLocalStorage({
          ...campaign,
          showdowns: campaign.showdowns?.map((h) =>
            h.id === formValues.id ? updatedShowdown : h
          )
        })

        // Update the context to refresh the settlements list
        updateSelectedShowdown()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Showdown Save Error:', error)

        if (error instanceof ZodError && error.errors[0]?.message)
          toast.error(error.errors[0].message)
        else toast.error(ERROR_MESSAGE())
      }
    },
    [form, toast, updateSelectedShowdown]
  )

  return { saveSelectedShowdown }
}
