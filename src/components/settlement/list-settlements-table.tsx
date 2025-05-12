'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Settlement } from '@/lib/types'
import { getCampaign, getCurrentYear } from '@/lib/utils'
import { SearchIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ListSettlementsTable() {
  const router = useRouter()

  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [deleteSettlementId, setDeleteSettlementId] = useState<number | null>(
    null
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch settlements from localStorage when the component mounts.
  useEffect(() => {
    setSettlements(getCampaign().settlements)
  }, [])

  /**
   * Navigates to the Settlement Page
   *
   * @param settlementId Settlement ID
   */
  const handleViewSettlement = (settlementId: number) =>
    router.push(`/settlement?settlementId=${settlementId}`)

  /**
   * Deletes a Settlement and Survivors
   *
   * @param settlementId Settlement ID
   */
  const handleDeleteSettlement = (settlementId: number) => {
    const campaign = getCampaign()

    const settlementIndex = campaign.settlements.findIndex(
      (s) => s.id === settlementId
    )

    if (settlementIndex === -1) return toast.error('Settlement Not Found')

    const settlementName = campaign.settlements[settlementIndex].name

    // Remove settlement from the array
    campaign.settlements.splice(settlementIndex, 1)

    // Remove any survivors associated with this settlement
    campaign.survivors = campaign.survivors.filter(
      (s) => s.settlementId !== settlementId
    )

    localStorage.setItem('campaign', JSON.stringify(campaign))
    setSettlements(campaign.settlements)

    toast.success(
      `Darkness overtook ${settlementName}. Voices cried out, and were suddenly silenced.`
    )

    setDeleteSettlementId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Lantern Year</TableHead>
            <TableHead>Population</TableHead>
            <TableHead>Deaths</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-4">
                No settlements added yet.
              </TableCell>
            </TableRow>
          )}
          {settlements.map((settlement) => (
            <TableRow key={settlement.id}>
              <TableCell className="font-medium">{settlement.name}</TableCell>
              <TableCell>{getCurrentYear(settlement.timeline)}</TableCell>
              <TableCell>{settlement.population}</TableCell>
              <TableCell>{settlement.deathCount}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSettlement(settlement.id)}>
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <AlertDialog
                  open={
                    isDeleteDialogOpen && deleteSettlementId === settlement.id
                  }
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setDeleteSettlementId(null)
                  }}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteSettlementId(settlement.id)
                        setIsDeleteDialogOpen(true)
                      }}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {settlement.name}? This
                        action cannot be undone, and all associated survivors
                        will also be removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSettlement(settlement.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
