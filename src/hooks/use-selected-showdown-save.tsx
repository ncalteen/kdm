'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Showdown, ShowdownSchema } from '@/schemas/showdown'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Showdown Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * showdown context after saving data to localStorage, ensuring that the UI is
 * refreshed when active showdown data changes.
 *
 * @param campaign Campaign
 * @param form React Hook Form Instance for Showdown
 * @param updateSelectedShowdown Callback to Update Selected Showdown Context
 * @param updateCampaign Callback to Update Campaign Context
 */
export function useSelectedShowdownSave(
  campaign: Campaign,
  form: UseFormReturn<Showdown>,
  updateSelectedShowdown: () => void,
  updateCampaign: (campaign: Campaign) => void
) {
  const { toast } = useToast(campaign)

  /**
   * Save Selected Showdown Data
   *
   * @param updateData Partial Selected Showdown Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedShowdown = (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
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

      updateCampaign({
        ...campaign,
        showdowns: campaign.showdowns?.map((h) =>
          h.id === formValues.id ? updatedShowdown : h
        )
      })
      updateSelectedShowdown()

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Showdown Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  return { saveSelectedShowdown }
}
