import { SurvivorType } from '@/lib/enums'
import { Survivor } from '@/lib/types'
import { getSurvivors } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '../badge'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../table'

export function SettlementSurvivorsCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const settlementId = form.watch('id')
  const survivorType = form.watch('survivorType')
  const [survivors, setSurvivors] = useState<Survivor[]>([])

  useEffect(() => {
    const fetchedSurvivors = getSurvivors(settlementId)
    setSurvivors(fetchedSurvivors)
  }, [settlementId])

  // Check if survivor type is Arc
  const isArcSurvivorType = survivorType === SurvivorType.ARC

  return (
    <Card className="mt-2">
      <CardHeader className="text-left">
        <CardTitle>Survivors</CardTitle>
      </CardHeader>

      <CardContent>
        {survivors.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No survivors found for this settlement.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Hunt XP</TableHead>
                {isArcSurvivorType && <TableHead>Philosophy</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {survivors.map((survivor) => (
                <TableRow key={survivor.id}>
                  <TableCell className="font-semibold">
                    {survivor.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {survivor.gender}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {survivor.huntXP}
                    </Badge>
                  </TableCell>
                  {isArcSurvivorType && (
                    <TableCell>
                      {survivor.philosophy && (
                        <div className="text-sm">
                          {survivor.philosophy}
                          {survivor.tenetKnowledgeObservationRank !==
                            undefined && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Rank: {survivor.tenetKnowledgeObservationRank}
                            </Badge>
                          )}
                        </div>
                      )}
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
                  <TableCell>
                    {survivor.notes && (
                      <div className="text-sm">{survivor.notes}</div>
                    )}
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
