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
import { getSettlement } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon, SearchIcon, Trash2Icon } from 'lucide-react'

/**
 * Column Configuration Properties
 */
export interface ColumnProps {
  /** Delete ID */
  deleteId: number | undefined
  /** Is Delete Dialog Open */
  isDeleteDialogOpen: boolean
  /** Handle View Survivor */
  handleViewSurvivor: (survivorId: number) => void
  /** Handle Delete Survivor */
  handleDeleteSurvivor: (survivorId: number) => void
  /** Set Delete ID */
  setDeleteId: (id: number | undefined) => void
  /** Set Is Delete Dialog Open */
  setIsDeleteDialogOpen: (open: boolean) => void
}

/**
 * Creates column definitions for the survivors data table
 *
 * @param props Column Configuration Properties
 * @returns Column definitions
 */
export const createColumns = ({
  deleteId,
  isDeleteDialogOpen,
  handleViewSurvivor,
  handleDeleteSurvivor,
  setDeleteId,
  setIsDeleteDialogOpen
}: ColumnProps): ColumnDef<Survivor>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          type="button">
          Name
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'gender',
    header: () => <div className="font-bold text-left">Gender</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">
        <Badge variant="outline">{row.getValue('gender')}</Badge>
      </div>
    )
  },
  {
    accessorKey: 'settlementId',
    header: () => <div className="font-bold text-left">Settlement Name</div>,
    cell: ({ row }) => {
      const settlementId = row.getValue('settlementId') as number
      const settlement = getSettlement(settlementId)
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleViewSurvivor(row.original.id)}>
          {settlement?.name || 'Unknown Settlement'}
        </Button>
      )
    }
  },
  {
    accessorKey: 'huntXP',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          type="button">
          Hunt XP
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left">{row.getValue('huntXP')}</div>
  },
  {
    id: 'status',
    header: () => <div className="font-bold text-left">Status</div>,
    cell: ({ row }) => {
      const survivor = row.original
      return (
        <div className="flex gap-2">
          {survivor.dead ? (
            <Badge variant="destructive" className="text-xs">
              Dead
            </Badge>
          ) : (
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
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const survivor = row.original
      return (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSurvivor(survivor.id)}
            title="View survivor">
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
        </div>
      )
    }
  }
]
