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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, getSurvivors } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { PencilIcon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

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

  // Tracks if Arc survivors are in use for this settlement.
  const isArcSurvivorType = survivorType === SurvivorType.ARC

  useEffect(() => {
    const fetchedSurvivors = getSurvivors(settlementId)

    setSurvivors(fetchedSurvivors)
  }, [settlementId])

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
  }

  return (
    <Card className="p-0 pb-1 mt-2 border-3">
      <CardHeader className="px-2 py-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex flex-row items-center gap-1">
            <UserIcon className="h-4 w-4" />
            Survivors
          </CardTitle>
          <Link href={`/survivor/create?settlementId=${settlementId}`}>
            <Button
              variant="outline"
              size="sm"
              title="Create new survivor"
              className="h-8">
              <PlusIcon className="h-4 w-4" />
              New Survivor
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-1 pb-0">
        {survivors.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Silence echoes through the darkness. No survivors present.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Gender</TableHead>
                <TableHead className="font-bold">Hunt XP</TableHead>
                {isArcSurvivorType && (
                  <TableHead className="font-bold">Philosophy</TableHead>
                )}
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {survivors.map((survivor) => (
                <TableRow key={survivor.id}>
                  <TableCell className="text-sm text-left">
                    {survivor.name}
                  </TableCell>
                  <TableCell className="text-sm text-left">
                    <Badge variant="outline">{survivor.gender}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-left">
                    <Badge variant="secondary" className="text-xs">
                      {survivor.huntXP}
                    </Badge>
                  </TableCell>
                  {isArcSurvivorType && (
                    <TableCell className="text-sm text-left">
                      {survivor.philosophy}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex gap-2">
                      {survivor.dead && (
                        <Badge variant="destructive" className="text-xs">
                          Dead
                        </Badge>
                      )}
                      {survivor.retired && (
                        <Badge variant="outline" className="text-xs">
                          Retired
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/survivor?settlementId=${settlementId}&survivorId=${survivor.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit survivor">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
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
                            }}
                            title="Delete survivor">
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Survivor</AlertDialogTitle>
                            <AlertDialogDescription>
                              The darkness hungers for {survivor.name}.{' '}
                              <strong>
                                Once consumed, they cannot return.
                              </strong>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
