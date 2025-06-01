'use client'

import { createColumns } from '@/components/settlement/list-settlements/columns'
import { SettlementsDataTable } from '@/components/settlement/list-settlements/data-table'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { useRouter } from 'next/navigation'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

/**
 * List Settlements Table Component
 *
 * Displays a table of settlements with options to view and delete them.
 * Each settlement can be viewed in detail or deleted, which will also remove
 * all associated survivors.
 *
 * @returns List Settlements Table
 */
export function ListSettlementsTable(): ReactElement {
  const router = useRouter()

  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  // Fetch settlements from localStorage when the component mounts.
  useEffect(() => setSettlements(getCampaign().settlements), [])

  /**
   * Navigates to the settlement details page.
   *
   * @param settlementId Settlement ID
   */
  const handleViewSettlement = useCallback(
    (settlementId: number) =>
      router.push(`/settlement?settlementId=${settlementId}`),
    [router]
  )

  /**
   * Deletes a settlement and all associated survivors from the campaign data.
   *
   * @param settlementId Settlement ID
   */
  const handleDeleteSettlement = useCallback((settlementId: number) => {
    const campaign = getCampaign()
    const settlementIndex = campaign.settlements.findIndex(
      (s) => s.id === settlementId
    )

    if (settlementIndex === -1) return toast.error('Settlement not found!')

    const settlementName = campaign.settlements[settlementIndex].name

    campaign.settlements.splice(settlementIndex, 1)
    campaign.survivors = campaign.survivors.filter(
      (s) => s.settlementId !== settlementId
    )

    localStorage.setItem('campaign', JSON.stringify(campaign))
    setSettlements(campaign.settlements)
    toast.success(
      `Darkness overtook ${settlementName}. Voices cried out, and were suddenly silenced.`
    )

    setDeleteId(undefined)
    setIsDeleteDialogOpen(false)
  }, [])

  // Create columns with required functions
  const columns = useMemo(
    () =>
      createColumns({
        deleteId,
        isDeleteDialogOpen,
        handleViewSettlement,
        handleDeleteSettlement,
        setDeleteId,
        setIsDeleteDialogOpen
      }),
    [
      deleteId,
      isDeleteDialogOpen,
      handleViewSettlement,
      handleDeleteSettlement,
      setDeleteId,
      setIsDeleteDialogOpen
    ]
  )

  return (
    <div className="rounded-md">
      <SettlementsDataTable columns={columns} data={settlements} />
    </div>
  )
}
