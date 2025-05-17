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
 * Squire Progression Card Component
 *
 * Individual card for each squire's progression data. This is static data for
 * reference and does not change.
 */
const SquireProgressionCard = ({
  squire
}: {
  squire: (typeof SquireCardData)[0]
}): ReactElement => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-l text-left font-bold">
          {squire.name}
        </CardTitle>
        <CardDescription className="text-xs text-left">
          Gain the following in addition to <strong>Age</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody className="text-xs">
            {squire.rows.map((stat, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="text-left py-2">
                  <strong>{stat.name}</strong>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SquireCardData.map((squire, index) => (
        <SquireProgressionCard key={index} squire={squire} />
      ))}
    </div>
  )
}
