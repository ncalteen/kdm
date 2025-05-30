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
import { getCampaign, getSettlement, getSurvivors } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { SearchIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'

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

  // Fetch settlements from localStorage when the component mounts.
  useEffect(() => setSurvivors(getSurvivors()), [])

  /**
   * Navigates to the survivor details page.
   *
   * @param survivorId Survivor ID
   */
  const handleViewSurvivor = (survivorId: number) =>
    router.push(`/survivor?survivorId=${survivorId}`)

  /**
   * Deletes a survivor from the campaign data.
   *
   * @param survivorId Survivor ID
   */
  const handleDeleteSurvivor = (survivorId: number) => {
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
  }

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Settlement Name</TableHead>
            <TableHead>Hunt XP</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {survivors.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-4">
                The darkness remains unbroken. No lanterns light the way.
              </TableCell>
            </TableRow>
          )}
          {survivors.map((survivor) => (
            <TableRow key={survivor.id}>
              <TableCell className="text-sm text-left">
                {survivor.name}
              </TableCell>
              <TableCell className="text-sm text-left">
                <Badge variant="outline">{survivor.gender}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleViewSurvivor(survivor.id)}>
                  {getSettlement(survivor.settlementId)?.name}
                </Button>
              </TableCell>
              <TableCell>{survivor.huntXP}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {(survivor.dead && (
                    <Badge variant="destructive" className="text-xs">
                      Dead
                    </Badge>
                  )) || (
                    <Badge variant="secondary" className="text-xs">
                      Alive
                    </Badge>
                  )}
                  {survivor.retired && (
                    <Badge variant="outline" className="text-xs">
                      Retired
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSurvivor(survivor.id)}>
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <AlertDialog
                  open={isDeleteDialogOpen && deleteId === survivor.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setDeleteId(undefined)
                  }}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(survivor.id)
                        setIsDeleteDialogOpen(true)
                      }}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Survivor</AlertDialogTitle>
                      <AlertDialogDescription>
                        The darkness hungers for {survivor.name}.{' '}
                        <strong>Once consumed, they cannot return.</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSurvivor(survivor.id)}
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
