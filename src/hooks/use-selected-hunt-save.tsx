'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Hunt, HuntSchema } from '@/schemas/hunt'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Hunt Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * hunt context after saving data to localStorage, ensuring that the UI is
 * refreshed when active hunt data changes.
 *
 * @param campaign Campaign
 * @param form React Hook Form Instance for Hunt
 * @param updateSelectedHunt Callback to Update Selected Hunt Context
 * @param updateCampaign Callback to Update Campaign Data
 */
export function useSelectedHuntSave(
  campaign: Campaign,
  form: UseFormReturn<Hunt>,
  updateSelectedHunt: () => void,
  updateCampaign: (campaign: Campaign) => void
) {
  const { toast } = useToast(campaign)

  /**
   * Save Selected Hunt Data
   *
   * @param updateData Partial Selected Hunt Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedHunt = (updateData: Partial<Hunt>, successMsg?: string) => {
    try {
      const formValues = form.getValues()
      const existingHunt = campaign.hunts?.find(
        (h) => h.id === campaign.selectedHuntId
      )

      const updatedHunt = existingHunt
        ? {
            ...existingHunt,
            ...updateData
          }
        : { ...formValues, ...updateData }

      // Validate the updated hunt data
      HuntSchema.parse(updatedHunt)

      // If this is a new hunt, add them to the campaign
      if (!existingHunt) campaign.hunts?.push(updatedHunt)

      updateCampaign({
        ...campaign,
        hunts: campaign.hunts?.map((h) =>
          h.id === formValues.id ? updatedHunt : h
        )
      })
      updateSelectedHunt()

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Hunt Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  return { saveSelectedHunt }
}
