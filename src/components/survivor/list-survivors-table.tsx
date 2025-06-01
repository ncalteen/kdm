'use client'

import { getCampaign, getSurvivors } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { useRouter } from 'next/navigation'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { createColumns } from './list-survivors/columns'
import { SurvivorsDataTable } from './list-survivors/data-table'

/**
 * List Survivors Table Component
 *
 * Displays a table of survivors with options to view and delete them.
 * Each survivors can be viewed in detail or deleted.
 *
 * @returns List Settlements Table
 */
export function ListSurvivorsTable(): ReactElement {
  const router = useRouter()

  const [survivors, setSurvivors] = useState<Survivor[]>([])
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  // Fetch survivors from localStorage when the component mounts.
  useEffect(() => setSurvivors(getSurvivors()), [])

  /**
   * Navigates to the survivor details page.
   *
   * @param survivorId Survivor ID
   */
  const handleViewSurvivor = useCallback(
    (survivorId: number) => router.push(`/survivor?survivorId=${survivorId}`),
    [router]
  )

  /**
   * Deletes a survivor from the campaign data.
   *
   * @param survivorId Survivor ID
   */
  const handleDeleteSurvivor = useCallback((survivorId: number) => {
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
      setSurvivors(campaign.survivors)
      toast.success(
        `Darkness overtook ${survivorName}. A voice cried out, and was suddenly silenced.`
      )

      setDeleteId(undefined)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Survivor Delete Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }, [])

  // Create columns with required functions
  const columns = useMemo(
    () =>
      createColumns({
        deleteId,
        isDeleteDialogOpen,
        handleViewSurvivor,
        handleDeleteSurvivor,
        setDeleteId,
        setIsDeleteDialogOpen
      }),
    [
      deleteId,
      isDeleteDialogOpen,
      handleViewSurvivor,
      handleDeleteSurvivor,
      setDeleteId,
      setIsDeleteDialogOpen
    ]
  )

  return (
    <div className="rounded-md">
      <SurvivorsDataTable columns={columns} data={survivors} />
    </div>
  )
}
