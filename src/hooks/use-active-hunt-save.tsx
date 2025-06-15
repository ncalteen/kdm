'use client'

import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { ActiveHunt, ActiveHuntSchema } from '@/schemas/active-hunt'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Custom hook for saving active hunt data with automatic context updates
 *
 * This hook provides a save function that automatically updates the active hunt
 * context after saving data to localStorage, ensuring that the UI is
 * refreshed when active hunt data changes.
 */
export function useActiveHuntSave(
  form: UseFormReturn<ActiveHunt>,
  updateSelectedActiveHunt: () => void,
  updateSelectedSettlement?: () => void
) {
  /**
   * Save active hunt data to localStorage and update context
   *
   * @param updateData Partial active hunt data to update
   * @param successMsg Optional success message to display
   */
  const saveActiveHunt = useCallback(
    (updateData: Partial<ActiveHunt>, successMsg?: string) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const existingSurvivors = campaign.survivors
        const existingSettlement = campaign.settlements.find(
          (s) => s.id === campaign.selectedSettlementId
        )

        if (!existingSettlement)
          throw new Error('No existing settlement found!')

        const quarryName =
          updateData.quarryName ||
          existingSettlement.hunt?.quarryName ||
          formValues.quarryName
        const quarryLevel =
          updateData.quarryLevel ||
          existingSettlement.hunt?.quarryLevel ||
          formValues.quarryLevel
        const survivorIds =
          updateData.survivors?.map((s) => s.id) ||
          existingSettlement.hunt?.survivors ||
          formValues.survivors.map((s) => s.id)
        const scoutId =
          updateData.scout?.id ||
          existingSettlement.hunt?.scout ||
          formValues.scout?.id
        const survivorPosition =
          updateData.survivorPosition ||
          existingSettlement.hunt?.survivorPosition ||
          formValues.survivorPosition
        const quarryPosition =
          updateData.quarryPosition ||
          existingSettlement.hunt?.quarryPosition ||
          formValues.quarryPosition
        const ambush =
          updateData.ambush ||
          existingSettlement.hunt?.ambush ||
          formValues.ambush

        // Update the settlement data
        const updatedSettlement = {
          ...existingSettlement,
          hunt: {
            quarryName,
            quarryLevel,
            survivors: survivorIds,
            scout: scoutId,
            survivorPosition,
            quarryPosition,
            ambush
          }
        }

        // Update the survivor data
        for (const survivorId of survivorIds) {
          const survivorIndex = existingSurvivors.findIndex(
            (s) => s.id === survivorId
          )

          if (survivorIndex === -1)
            throw new Error(`Survivor with ID ${survivorId} not found!`)

          existingSurvivors[survivorIndex] = {
            ...existingSurvivors[survivorIndex],
            ...(updateData.survivors?.find((s) => s.id === survivorId) || {})
          }
        }

        // Update the scout data
        if (scoutId) {
          const scoutIndex = existingSurvivors.findIndex(
            (s) => s.id === scoutId
          )

          if (scoutIndex === -1)
            throw new Error(`Scout with ID ${scoutId} not found!`)

          existingSurvivors[scoutIndex] = {
            ...existingSurvivors[scoutIndex],
            ...(updateData.scout || {})
          }
        }

        const updatedActiveHunt = {
          quarryName,
          quarryLevel,
          survivors: existingSurvivors.filter(
            (s) => s.id && survivorIds.includes(s.id)
          ),
          scout: existingSurvivors.find((s) => s.id === scoutId),
          survivorPosition,
          quarryPosition,
          ambush
        }

        // Validate the updated settlement data
        ActiveHuntSchema.parse(updatedActiveHunt)

        saveCampaignToLocalStorage({
          ...campaign,
          settlements: campaign.settlements.map((s) =>
            s.id === campaign.selectedSettlementId ? updatedSettlement : s
          ),
          survivors: existingSurvivors
        })

        // Update the context to refresh the settlements list
        updateSelectedActiveHunt()

        // Also update the settlement context so the SettlementSwitcher reflects
        // the new hunt state
        if (updateSelectedSettlement) updateSelectedSettlement()

        if (successMsg) toast.success(successMsg)
      } catch (error) {
        console.error('Active Hunt Save Error:', error)

        if (error instanceof ZodError && error.errors[0]?.message)
          toast.error(error.errors[0].message)
        else toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form, updateSelectedActiveHunt, updateSelectedSettlement]
  )

  return { saveActiveHunt }
}
