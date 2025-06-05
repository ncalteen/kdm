'use client'

import { useSurvivor } from '@/contexts/survivor-context'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { useCallback } from 'react'
import { toast } from 'sonner'

/**
 * Custom hook for saving campaign data with automatic context updates
 *
 * This hook provides a save function that automatically updates the survivor
 * context after saving data to localStorage, ensuring that components that
 * depend on campaign data are refreshed when campaign data changes.
 */
export function useCampaignSave() {
  const { updateSelectedSurvivor } = useSurvivor()

  /**
   * Save campaign data to localStorage and update context
   *
   * @param updateData Partial campaign data to update
   * @param successMsg Optional success message to display
   */
  const saveCampaign = useCallback(
    (updateData: Partial<Campaign>, successMsg?: string) => {
      try {
        const campaign = getCampaign()
        const updatedCampaign = {
          ...campaign,
          ...updateData
        }

        saveCampaignToLocalStorage(updatedCampaign)

        // Update the context to refresh dependent components
        updateSelectedSurvivor()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Campaign Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [updateSelectedSurvivor]
  )

  return { saveCampaign }
}
