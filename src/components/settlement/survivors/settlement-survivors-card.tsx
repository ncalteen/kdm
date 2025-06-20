'use client'

import { createColumns } from '@/components/settlement/survivors/columns'
import { SurvivorDataTable } from '@/components/settlement/survivors/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSelectedTab } from '@/contexts/selected-tab-context'
import { useCampaignSave } from '@/hooks/use-campaign-save'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, getSurvivors } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * Settlement Survivors Card Properties
 */
interface SettlementSurvivorsCardProps {
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Is Creating New Survivor */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Hunt */
  updateSelectedHunt: () => void
  /** Update Selected Settlement */
  updateSelectedSettlement: () => void
  /** Update Selected Survivor */
  updateSelectedSurvivor: () => void
}

/**
 * Settlement Survivors Card Component
 *
 * Displays the list of survivors for a given settlement in a table format.
 * Shows survivor details including name, gender, hunt experience, philosophy
 * (for Arc survivors), status, and edit/delete buttons to navigate to the
 * survivor page or remove them from the settlement.
 *
 * @param props Settlement Survivors Card Properties
 * @returns Settlement Survivors Card Component
 */
export function SettlementSurvivorsCard({
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  setIsCreatingNewSurvivor,
  setSelectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedHunt,
  updateSelectedSettlement,
  updateSelectedSurvivor
}: SettlementSurvivorsCardProps): ReactElement {
  // This component uses the campaign and tab contexts directly. They are not
  // passed down as props to avoid unnecessary re-renders and to keep the
  // component focused on survivor management.
  const { saveCampaign } = useCampaignSave(
    setSurvivors,
    survivors,
    updateSelectedHunt,
    updateSelectedSettlement,
    updateSelectedSurvivor
  )
  const { setSelectedTab } = useSelectedTab()

  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  /**
   * Handle New Survivor Creation
   *
   * Clears any selected survivor and sets the state to indicate that a new
   * survivor is being created.
   */
  const handleNewSurvivor = useCallback(() => {
    setSelectedSurvivor(null)
    setIsCreatingNewSurvivor(true)
  }, [setSelectedSurvivor, setIsCreatingNewSurvivor])

  /**
   * Handles Survivor Deletion
   *
   * @param survivorId Survivor ID
   */
  const handleDeleteSurvivor = useCallback(
    (survivorId: number) => {
      if (!selectedSettlement) return

      try {
        // Check if survivor is currently on an active hunt or showdown
        if (selectedShowdown?.survivors?.includes(survivorId))
          return toast.error(
            'The survivor cannot be erased while on a showdown.'
          )
        if (selectedHunt?.survivors?.includes(survivorId))
          return toast.error('The survivor cannot be erased while on a hunt.')

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

        saveCampaign(
          { survivors: updatedSurvivors },
          `Darkness overtook ${survivorName}. A voice cried out, and was suddenly silenced.`
        )
        setSurvivors(getSurvivors(selectedSettlement.id))

        setDeleteId(undefined)
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error('Survivor Delete Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [
      saveCampaign,
      selectedSettlement,
      selectedHunt,
      selectedSurvivor,
      selectedShowdown,
      setSelectedSurvivor,
      setSurvivors
    ]
  )

  const columns = useMemo(
    () =>
      createColumns({
        deleteId,
        handleDeleteSurvivor,
        isDeleteDialogOpen,
        selectedHunt,
        selectedShowdown,
        setDeleteId,
        setIsDeleteDialogOpen,
        setSelectedSurvivor,
        setSelectedTab
      }),
    [
      deleteId,
      handleDeleteSurvivor,
      isDeleteDialogOpen,
      selectedHunt,
      selectedShowdown,
      setDeleteId,
      setIsDeleteDialogOpen,
      setSelectedSurvivor,
      setSelectedTab
    ]
  )

  // Only show the philosophy column if the settlement uses Arc survivors
  const columnVisibility = useMemo(
    () => ({
      philosophy: selectedSettlement?.survivorType === SurvivorType.ARC
    }),
    [selectedSettlement?.survivorType]
  )

  return (
    <Card className="p-0 pb-2 mt-2 border-0">
      <CardContent className="p-0">
        {survivors?.length === 0 ? (
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
            data={
              survivors?.filter(
                (s) => s.settlementId === selectedSettlement?.id
              ) || []
            }
            initialColumnVisibility={columnVisibility}
            onNewSurvivor={handleNewSurvivor}
            selectedSettlement={selectedSettlement}
          />
        )}
      </CardContent>
    </Card>
  )
}
