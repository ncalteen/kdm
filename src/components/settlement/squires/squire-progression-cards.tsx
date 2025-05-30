'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { SquireCardData } from '@/lib/common'
import { ReactElement } from 'react'

/**
 * Squire Progression Card Component Properties
 */
interface SquireProgressionCardProps {
  /** Squire Data */
  squire: (typeof SquireCardData)[0]
}

/**
 * Squire Progression Card Component
 *
 * Individual card for each squire's progression data. This is static data for
 * reference and does not change.
 *
 * @param props Squire Progression Card Component Properties
 * @returns Squire Progression Card Component
 */
const SquireProgressionCard = ({
  squire
}: SquireProgressionCardProps): ReactElement => {
  return (
    <Card className="p-0 pb-1 border-3">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          {squire.name}
        </CardTitle>
        <CardDescription className="text-xs text-left">
          Gain the following in addition to <strong>Age</strong>.
        </CardDescription>
      </CardHeader>

      {/* Card Content with Squire Stats */}
      <CardContent className="p-1 pb-0">
        <Table>
          <TableBody className="text-xs">
            {squire.rows.map((stat, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="text-left font-bold">
                  {stat.name}
                </TableCell>
                <TableCell className="text-left py-2 whitespace-normal break-words">
                  {stat.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/**
 * Squire Progression Cards Component
 */
export function SquireProgressionCards(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {SquireCardData.map((squire, index) => (
        <SquireProgressionCard key={index} squire={squire} />
      ))}
    </div>
  )
}
