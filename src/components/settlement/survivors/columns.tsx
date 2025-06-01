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
import { Survivor } from '@/schemas/survivor'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDownIcon,
  PencilIcon,
  ShieldOffIcon,
  SkullIcon,
  Trash2Icon
} from 'lucide-react'
import Link from 'next/link'

/**
 * Column Configuration Properties
 */
export interface ColumnProps {
  /** Settlement ID */
  settlementId: number
  /** Delete ID */
  deleteId: number | undefined
  /** Is Delete Dialog Open */
  isDeleteDialogOpen: boolean
  /** Handle Delete Survivor */
  handleDeleteSurvivor: (survivorId: number) => void
  /** Set Delete ID */
  setDeleteId: (id: number | undefined) => void
  /** Set Is Delete Dialog Open */
  setIsDeleteDialogOpen: (open: boolean) => void
}

/**
 * Creates column definitions for the survivor data table
 *
 * @param props Column Configuration Properties
 * @returns Column definitions
 */
export const createColumns = ({
  settlementId,
  deleteId,
  isDeleteDialogOpen,
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
      <div className="text-left text-xs">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'gender',
    header: () => <div className="font-bold text-left">Gender</div>,
    cell: ({ row }) => (
      <div className="text-left text-xs">
        <Badge variant="outline">{row.getValue('gender')}</Badge>
      </div>
    )
  },
  {
    accessorKey: 'huntXP',
    header: () => <div className="font-bold text-left">Hunt XP</div>,
    cell: ({ row }) => (
      <div className="text-left text-xs">
        <Badge variant="outline">{row.getValue('huntXP')}</Badge>
      </div>
    )
  },
  {
    accessorKey: 'philosophy',
    header: () => <div className="font-bold text-left">Philosophy</div>,
    cell: ({ row }) => (
      <div className="text-left text-xs">{row.getValue('philosophy')}</div>
    )
  },
  {
    accessorKey: 'retired',
    header: () => <div className="font-bold text-left">Retired</div>,
    cell: ({}) => (
      <Badge variant="secondary" className="text-xs h-8 w-8">
        <ShieldOffIcon />
      </Badge>
    )
  },
  {
    accessorKey: 'dead',
    header: () => <div className="font-bold text-left">Dead</div>,
    cell: ({}) => (
      <Badge variant="destructive" className="text-xs h-8 w-8">
        <SkullIcon />
      </Badge>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const survivor = row.original
      return (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/survivor?settlementId=${settlementId}&survivorId=${survivor.id}`}>
            <Button variant="outline" size="sm" title="Edit survivor">
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
