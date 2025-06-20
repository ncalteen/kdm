'use client'

import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Survivor } from '@/schemas/survivor'
import { useCallback } from 'react'
import { toast } from 'sonner'

/**
 * Save Campaign Data Custom Hook
 *
 * This hook provides a save function that automatically updates the campaign
 * context after saving data to localStorage, ensuring that components that
 * depend on campaign data are refreshed when campaign data changes.
 *
 * @param setSurvivors Set Survivors Function
 * @param survivors Survivors
 * @param updateSelectedHunt Update Selected Hunt Function
 * @param updateSelectedSettlement Update Selected Settlement Function
 * @param updateSelectedSurvivor Update Selected Survivor Function
 */
export function useCampaignSave(
  setSurvivors: (survivors: Survivor[]) => void,
  survivors: Survivor[] | null,
  updateSelectedHunt: () => void,
  updateSelectedSettlement: () => void,
  updateSelectedSurvivor: () => void
) {
  /**
   * Save Campaign Data
   *
   * @param updateData Partial Campaign Data
   * @param successMsg Optional Success Message
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
        updateSelectedHunt()
        updateSelectedSettlement()
        updateSelectedSurvivor()
        setSurvivors(survivors || [])

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Campaign Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [
      updateSelectedHunt,
      updateSelectedSettlement,
      updateSelectedSurvivor,
      setSurvivors,
      survivors
    ]
  )

  return { saveCampaign }
}
