'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSurvivor } from '@/contexts/survivor-context'
import { useTab } from '@/contexts/tab-context'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { UserIcon } from 'lucide-react'
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
  const watchedSettlementId = form.watch('id')
  const watchedSurvivorType = form.watch('survivorType')
  const settlementId = useMemo(() => watchedSettlementId, [watchedSettlementId])
  const survivorType = useMemo(() => watchedSurvivorType, [watchedSurvivorType])

  const [survivors, setSurvivors] = useState<Survivor[]>([])
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  // Get context hooks for survivor and tab management
  const { setSelectedSurvivor } = useSurvivor()
  const { setSelectedTab } = useTab()

  // Tracks if Arc survivors are in use for this settlement.
  const isArcSurvivorType = survivorType === SurvivorType.ARC

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

        // Remove the survivor from the campaign
        campaign.survivors.splice(survivorIndex, 1)

        localStorage.setItem('campaign', JSON.stringify(campaign))
        setSurvivors(getSurvivors(settlementId))
        toast.success(
          `Darkness overtook ${survivorName}. A voice cried out, and was suddenly silenced.`
        )

        setDeleteId(undefined)
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error('Survivor Delete Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [settlementId]
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
  }, [settlementId])

  return (
    <Card className="p-0 pb-1 mt-2 border-0 gap-2 h-full">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1">
          <UserIcon className="h-4 w-4" />
          Survivors
        </CardTitle>
      </CardHeader>

      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          <div className="flex-1 overflow-hidden">
            {survivors.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                Silence echoes through the darkness. No survivors present.
              </div>
            ) : (
              <SurvivorDataTable
                columns={columns}
                data={survivors}
                settlementId={settlementId}
                initialColumnVisibility={columnVisibility}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
