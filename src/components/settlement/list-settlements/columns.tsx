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
import { getCurrentYear } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
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
  /** Handle View Settlement */
  handleViewSettlement: (settlementId: number) => void
  /** Handle Delete Settlement */
  handleDeleteSettlement: (settlementId: number) => void
  /** Set Delete ID */
  setDeleteId: (id: number | undefined) => void
  /** Set Is Delete Dialog Open */
  setIsDeleteDialogOpen: (open: boolean) => void
}

/**
 * Creates column definitions for the settlements data table
 *
 * @param props Column Configuration Properties
 * @returns Column definitions
 */
export const createColumns = ({
  deleteId,
  isDeleteDialogOpen,
  handleViewSettlement,
  handleDeleteSettlement,
  setDeleteId,
  setIsDeleteDialogOpen
}: ColumnProps): ColumnDef<Settlement>[] => [
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
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'campaignType',
    header: () => <div className="font-bold text-left">Campaign Type</div>,
    cell: ({ row }) => (
      <div className="text-left">
        <Badge variant="secondary">{row.getValue('campaignType')}</Badge>
      </div>
    )
  },
  {
    accessorKey: 'timeline',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          type="button">
          Lantern Year
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-left">
        {getCurrentYear(row.getValue('timeline'))}
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const yearA = getCurrentYear(rowA.getValue('timeline'))
      const yearB = getCurrentYear(rowB.getValue('timeline'))
      return yearA - yearB
    }
  },
  {
    accessorKey: 'population',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          type="button">
          Population
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('population')}</div>
    )
  },
  {
    accessorKey: 'deathCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          type="button">
          Deaths
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('deathCount')}</div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const settlement = row.original
      return (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSettlement(settlement.id)}
            title="View settlement">
            <SearchIcon className="h-4 w-4" />
          </Button>
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
                }}
                title="Delete settlement">
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                <AlertDialogDescription>
                  The darkness hungers for {settlement.name}.{' '}
                  <strong>
                    Once consumed, all who dwelled within will be forgotten.
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
        </div>
      )
    }
  }
]
