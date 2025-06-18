'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

/**
 * Data Table Properties
 */
interface DataTableProps<TData, TValue> {
  /** Column Definitions */
  columns: ColumnDef<TData, TValue>[]
  /** Data */
  data: TData[]
  /** Initial Column Visibility */
  initialColumnVisibility?: VisibilityState
  /** On New Survivor Callback */
  onNewSurvivor?: () => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Survivor Data Table Component
 *
 * @param props DataTableProps
 * @returns Survivor Data Table Component
 */
export function SurvivorDataTable<TData, TValue>({
  columns,
  data,
  initialColumnVisibility = {},
  onNewSurvivor
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  )
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const { rows } = table.getRowModel()

  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <div className="flex items-center pb-2 gap-2">
        <Input
          placeholder="Filter survivors..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          variant="outline"
          size="sm"
          title="Create new survivor"
          className="h-9"
          onClick={onNewSurvivor}>
          <PlusIcon className="h-4 w-4" />
          New Survivor
        </Button>
      </div>

      <div className="overflow-y-auto h-[300px] w-full rounded-md border">
        <table className="w-full">
          <thead className="sticky top-0 bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="text-left p-2 font-bold text-sm">
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler()
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-muted/50 transition-colors">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="p-2 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
