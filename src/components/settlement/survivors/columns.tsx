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
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TabType } from '@/lib/enums'
import { getColorStyle } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDownIcon,
  ShieldOffIcon,
  SkullIcon,
  Trash2Icon,
  UserRoundSearchIcon
} from 'lucide-react'

/**
 * Column Configuration Properties
 */
export interface ColumnProps {
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
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Hunt Data */
  selectedHunt: Hunt | null
  /** Showdown Data */
  selectedShowdown: Showdown | null
}

/**
 * Create Column Definitions for the Survivor Data Table
 *
 * @param props Column Configuration Properties
 * @returns Column definitions
 */
export const createColumns = ({
  deleteId,
  isDeleteDialogOpen,
  handleDeleteSurvivor,
  setDeleteId,
  setIsDeleteDialogOpen,
  setSelectedSurvivor,
  setSelectedTab,
  selectedHunt,
  selectedShowdown
}: ColumnProps): ColumnDef<Survivor>[] => {
  /**
   * Handle Edit Survivor
   *
   * @param survivor Survivor
   */
  const handleEditSurvivor = (survivor: Survivor) => {
    setSelectedSurvivor(survivor)
    setSelectedTab(TabType.SURVIVORS)
  }

  /**
   * Survivor is on Hunt or Showdown
   *
   * @param survivorId Survivor ID
   * @returns Survivor is on Hunt
   */
  const isSurvivorOnHuntOrShowdown = (survivorId: number): boolean => {
    if (selectedHunt?.scout === survivorId) return true
    if (selectedHunt?.survivors?.includes(survivorId)) return true
    if (selectedShowdown?.scout === survivorId) return true
    if (selectedShowdown?.survivors?.includes(survivorId)) return true

    return false
  }

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            type="button"
            className="font-bold">
            Name
            <ArrowUpDownIcon />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex gap-2 justify-start items-center">
          <Button
            variant="outline"
            size="sm"
            title="View survivor"
            onClick={() => handleEditSurvivor(row.original)}>
            <UserRoundSearchIcon className="h-4 w-4" />
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen && deleteId === row.original.id}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open)
              if (!open) setDeleteId(undefined)
            }}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isSurvivorOnHuntOrShowdown(row.original.id)}
                onClick={() => {
                  if (!isSurvivorOnHuntOrShowdown(row.original.id)) {
                    setDeleteId(row.original.id)
                    setIsDeleteDialogOpen(true)
                  }
                }}
                title={
                  isSurvivorOnHuntOrShowdown(row.original.id)
                    ? 'Cannot delete survivor - they are currently on a hunt'
                    : 'Delete survivor'
                }>
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Survivor</AlertDialogTitle>
                <AlertDialogDescription>
                  The darkness hungers for {row.original.name}.{' '}
                  <strong>Once consumed, they cannot return.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteSurvivor(row.original.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="text-left text-sm pl-2 flex gap-2 items-center">
            <Avatar
              className={`h-6 w-6 ${getColorStyle(row.original.color, 'bg')}`}
            />
            {row.getValue('name')}
          </div>
          {row.original.wanderer && (
            <Badge variant="outline" className="text-xs">
              Wanderer
            </Badge>
          )}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const nameA = rowA.getValue(columnId) as string
        const nameB = rowB.getValue(columnId) as string
        return nameA.toLowerCase().localeCompare(nameB.toLowerCase())
      }
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => (
        <div className="text-sm hidden md:block">
          <Badge variant="outline">{row.getValue('gender')}</Badge>
        </div>
      ),
      meta: {
        className: 'hidden md:table-cell'
      }
    },
    {
      accessorKey: 'huntXP',
      header: 'Hunt XP',
      cell: ({ row }) => {
        const huntXP = parseInt(row.getValue('huntXP'), 10)

        return (
          <div className="text-sm">
            <Badge variant="outline">{huntXP}</Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'philosophy',
      header: 'Philosophy',
      cell: ({ row }) => (
        <div className="text-left text-sm hidden md:block">
          {row.getValue('philosophy')}
        </div>
      ),
      meta: {
        className: 'hidden md:table-cell'
      }
    },
    {
      accessorKey: 'retired',
      header: 'Retired',
      cell: ({ row }) =>
        row.getValue('retired') && (
          <Badge variant="secondary" className="text-sm h-8 w-8">
            <ShieldOffIcon />
          </Badge>
        )
    },
    {
      accessorKey: 'dead',
      header: 'Dead',
      cell: ({ row }) =>
        row.getValue('dead') && (
          <Badge variant="destructive" className="text-sm h-8 w-8">
            <SkullIcon />
          </Badge>
        )
    }
  ]
}
