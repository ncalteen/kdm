'use client'

import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Hunt, HuntSchema } from '@/schemas/hunt'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ZodError } from 'zod'

/**
 * Save Selected Hunt Custom Hook
 *
 * This hook provides a save function that automatically updates the selected
 * hunt context after saving data to localStorage, ensuring that the UI is
 * refreshed when active hunt data changes.
 */
export function useSelectedHuntSave(
  form: UseFormReturn<Hunt>,
  updateSelectedHunt: () => void
) {
  const { toast } = useToast()

  /**
   * Save Selected Hunt Data
   *
   * @param updateData Partial Selected Hunt Data
   * @param successMsg Optional Success Message
   */
  const saveSelectedHunt = useCallback(
    (updateData: Partial<Hunt>, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
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

        saveCampaignToLocalStorage({
          ...campaign,
          hunts: campaign.hunts?.map((h) =>
            h.id === formValues.id ? updatedHunt : h
          )
        })

        // Update the context to refresh the settlements list
        updateSelectedHunt()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Hunt Save Error:', error)

        if (error instanceof ZodError && error.issues[0]?.message)
          toast.error(error.issues[0].message)
        else toast.error(ERROR_MESSAGE())
      }
    },
    [form, toast, updateSelectedHunt]
  )

  return { saveSelectedHunt }
}
