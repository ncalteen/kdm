'use client'

import { createColumns } from '@/components/settlement/survivors/columns'
import { SurvivorDataTable } from '@/components/settlement/survivors/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SurvivorType, TabType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  SURVIVOR_ON_HUNT_ERROR_MESSAGE,
  SURVIVOR_ON_SHOWDOWN_ERROR_MESSAGE
} from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
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
  /** Campaign */
  campaign: Campaign
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
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
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
  campaign,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  setIsCreatingNewSurvivor,
  setSelectedSurvivor,
  setSelectedTab,
  updateCampaign
}: SettlementSurvivorsCardProps): ReactElement {
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
      try {
        // Check if survivor is currently on an active hunt or showdown
        if (selectedShowdown?.survivors?.includes(survivorId))
          return toast.error(SURVIVOR_ON_SHOWDOWN_ERROR_MESSAGE())
        if (selectedHunt?.survivors?.includes(survivorId))
          return toast.error(SURVIVOR_ON_HUNT_ERROR_MESSAGE())

        const survivorIndex = campaign.survivors.findIndex(
          (s) => s.id === survivorId
        )

        if (survivorIndex === -1) return toast.error(ERROR_MESSAGE())

        const updatedSurvivors = [...campaign.survivors]
        updatedSurvivors.splice(survivorIndex, 1)

        // Clear selected survivor if the deleted survivor is currently selected
        if (selectedSurvivor?.id === survivorId) setSelectedSurvivor(null)

        updateCampaign({ ...campaign, survivors: updatedSurvivors })

        setDeleteId(undefined)
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error('Survivor Delete Error:', error)
        toast.error(ERROR_MESSAGE())
      }
    },
    [
      campaign,
      updateCampaign,
      selectedHunt,
      selectedSurvivor,
      selectedShowdown,
      setSelectedSurvivor
    ]
  )

  const columns = createColumns({
    deleteId,
    handleDeleteSurvivor,
    isDeleteDialogOpen,
    selectedHunt,
    selectedShowdown,
    setDeleteId,
    setIsDeleteDialogOpen,
    setSelectedSurvivor,
    setSelectedTab
  })

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
        {campaign.survivors.length === 0 ? (
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
              campaign.survivors.filter(
                (survivor) => survivor.settlementId === selectedSettlement?.id
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
