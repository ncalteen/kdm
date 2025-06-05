'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSurvivor } from '@/contexts/survivor-context'
import { useTab } from '@/contexts/tab-context'
import { useCampaignSave } from '@/hooks/use-campaign-save'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { createColumns } from './columns'
import { SurvivorDataTable } from './data-table'

/**
 * Settlement Survivors Card Component
 *
 * Displays the list of survivors for a given settlement in a table format.
 * Shows survivor details including name, gender, hunt experience, philosophy
 * (for Arc survivors), status, and edit/delete buttons to navigate to the
 * survivor page or remove them from the settlement.
 */
export function SettlementSurvivorsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const { saveCampaign } = useCampaignSave()

  const watchedSettlementId = form.watch('id')
  const watchedSurvivorType = form.watch('survivorType')
  const settlementId = useMemo(() => watchedSettlementId, [watchedSettlementId])
  const survivorType = useMemo(() => watchedSurvivorType, [watchedSurvivorType])

  const [survivors, setSurvivors] = useState<Survivor[]>([])
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  // Get context hooks for survivor and tab management
  const { setSelectedSurvivor, setIsCreatingNewSurvivor, selectedSurvivor } =
    useSurvivor()
  const { setSelectedTab } = useTab()

  // Tracks if Arc survivors are in use for this settlement.
  const isArcSurvivorType = survivorType === SurvivorType.ARC

  /**
   * Handles creating a new survivor
   */
  const handleNewSurvivor = useCallback(() => {
    // Clear any selected survivor
    setSelectedSurvivor(null)
    // Set creating mode to true
    setIsCreatingNewSurvivor(true)
  }, [setSelectedSurvivor, setIsCreatingNewSurvivor])

  /**
   * Save to Local Storage
   *
   * @param updatedSurvivors Updated Survivors
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (updatedSurvivors: Survivor[], successMsg?: string) =>
      saveCampaign({ survivors: updatedSurvivors }, successMsg),
    [saveCampaign]
  )

  /**
   * Deletes a survivor from the campaign data.
   *
   * @param survivorId Survivor ID
   */
  const handleDeleteSurvivor = useCallback(
    (survivorId: number) => {
      try {
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s) => s.id === survivorId
        )

        if (survivorIndex === -1)
          return toast.error(
            'The darkness swallows your words. Please try again.'
          )

        const survivorName = campaign.survivors[survivorIndex].name
        const updatedSurvivors = [...campaign.survivors]
        updatedSurvivors.splice(survivorIndex, 1)

        // Clear selected survivor if the deleted survivor is currently selected
        if (selectedSurvivor?.id === survivorId) setSelectedSurvivor(null)

        saveToLocalStorage(
          updatedSurvivors,
          `Darkness overtook ${survivorName}. A voice cried out, and was suddenly silenced.`
        )
        setSurvivors(getSurvivors(settlementId))

        // Dispatch custom event to notify other components about survivor changes
        window.dispatchEvent(new CustomEvent('survivorsUpdated'))

        setDeleteId(undefined)
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error('Survivor Delete Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [saveToLocalStorage, settlementId, selectedSurvivor, setSelectedSurvivor]
  )

  // Create columns with the required props
  const columns = useMemo(
    () =>
      createColumns({
        deleteId,
        isDeleteDialogOpen,
        handleDeleteSurvivor,
        setDeleteId,
        setIsDeleteDialogOpen,
        setSelectedSurvivor,
        setSelectedTab
      }),
    [
      deleteId,
      isDeleteDialogOpen,
      handleDeleteSurvivor,
      setSelectedSurvivor,
      setSelectedTab
    ]
  )

  // Configure column visibility based on survivor type
  const columnVisibility = useMemo(
    () => ({
      philosophy: isArcSurvivorType
    }),
    [isArcSurvivorType]
  )

  useEffect(() => {
    const fetchedSurvivors = getSurvivors(settlementId)
    setSurvivors(fetchedSurvivors)
  }, [settlementId, selectedSurvivor])

  return (
    <Card className="p-0 pb-2 mt-2 border-0">
      <CardContent className="p-0">
        {survivors.length === 0 ? (
          <div className="flex flex-col gap-2 justify-center items-center p-4">
            <div className="text-center text-muted-foreground py-4">
              Silence echoes through the darkness. No survivors present.
            </div>
            <Button
              variant="outline"
              size="sm"
              title="Create new survivor"
              className="h-9 w-50"
              onClick={handleNewSurvivor}>
              <PlusIcon className="h-4 w-4" />
              New Survivor
            </Button>
          </div>
        ) : (
          <SurvivorDataTable
            columns={columns}
            data={survivors}
            initialColumnVisibility={columnVisibility}
            onNewSurvivor={handleNewSurvivor}
          />
        )}
      </CardContent>
    </Card>
  )
}
