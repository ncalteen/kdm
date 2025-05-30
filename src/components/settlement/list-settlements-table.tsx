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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getCampaign, getCurrentYear } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { SearchIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactElement, useEffect, useState } from 'react'
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
  const handleViewSettlement = (settlementId: number) =>
    router.push(`/settlement?settlementId=${settlementId}`)

  /**
   * Deletes a settlement and all associated survivors from the campaign data.
   *
   * @param settlementId Settlement ID
   */
  const handleDeleteSettlement = (settlementId: number) => {
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
  }

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Campaign Type</TableHead>
            <TableHead>Lantern Year</TableHead>
            <TableHead>Population</TableHead>
            <TableHead>Deaths</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-4">
                The darkness remains unbroken. No lanterns light the way.
              </TableCell>
            </TableRow>
          )}
          {settlements.map((settlement) => (
            <TableRow key={settlement.id}>
              {/* Settlment Name */}
              <TableCell className="font-medium">{settlement.name}</TableCell>

              {/* Campaign Type */}
              <TableCell>
                <Badge variant="secondary">{settlement.campaignType}</Badge>
              </TableCell>

              {/* Current Lantern Year */}
              <TableCell>{getCurrentYear(settlement.timeline)}</TableCell>

              {/* Population */}
              <TableCell>{settlement.population}</TableCell>

              {/* Death Count */}
              <TableCell>{settlement.deathCount}</TableCell>

              {/* Action Buttons */}
              <TableCell className="flex justify-end gap-2">
                {/* View Settlement */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSettlement(settlement.id)}>
                  <SearchIcon className="h-4 w-4" />
                </Button>

                {/* Delete Settlement */}
                <AlertDialog
                  open={isDeleteDialogOpen && deleteId === settlement.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setDeleteId(undefined)
                  }}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(settlement.id)
                        setIsDeleteDialogOpen(true)
                      }}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                      <AlertDialogDescription>
                        The darkness hungers for {settlement.name}.{' '}
                        <strong>
                          Once consumed, all who dwelled within will be
                          forgotten.
                        </strong>
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
