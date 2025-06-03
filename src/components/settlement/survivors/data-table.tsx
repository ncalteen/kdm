'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

/**
 * DataTableProps Interface
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  settlementId: number
  initialColumnVisibility?: VisibilityState
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
  settlementId,
  initialColumnVisibility = {}
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  )
  const [rowSelection, setRowSelection] = useState({})

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5
  })

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

        <Link href={`/survivor/create?settlementId=${settlementId}`}>
          <Button
            variant="outline"
            size="sm"
            title="Create new survivor"
            className="h-9">
            <PlusIcon className="h-4 w-4" />
            New Survivor
          </Button>
        </Link>
      </div>

      <div
        className="container relative overflow-auto h-[250px] w-full rounded-md border-1"
        ref={tableContainerRef}>
        <table className="grid w-full">
          <thead className="grid sticky top-0 z-1 w-full bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="flex items-center font-bold text-sm">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className="flex w-full">
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
          <tbody
            className="grid relative w-full"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`
            }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Survivor>

              return (
                <tr
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  className="flex absolute w-full py-1 items-center hover:bg-muted/50 transition-colors"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`
                  }}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="flex w-full">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
