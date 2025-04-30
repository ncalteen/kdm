'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SettlementSchema } from '@/schemas/settlement'
import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface SquireSuspicionsCardProps {
  control: UseFormReturn<z.infer<typeof SettlementSchema>>['control']
  setValue: UseFormReturn<z.infer<typeof SettlementSchema>>['setValue']
  getValues: UseFormReturn<z.infer<typeof SettlementSchema>>['getValues']
}

export function SquireSuspicionsCard({
  setValue,
  getValues
}: SquireSuspicionsCardProps) {
  const suspicions = getValues('suspicions') || []

  const handleSuspicionChange = (
    squireName: string,
    level: number,
    checked: boolean
  ) => {
    const updatedSuspicions = suspicions.map((suspicion) => {
      if (suspicion.name === squireName) {
        // Make a copy of the suspicion
        const updatedSuspicion = { ...suspicion }

        // Update the specified level
        if (level === 1) updatedSuspicion.level1 = checked
        if (level === 2) updatedSuspicion.level2 = checked
        if (level === 3) updatedSuspicion.level3 = checked
        if (level === 4) updatedSuspicion.level4 = checked

        // If checking a higher level, also check all lower levels
        if (checked) {
          if (level >= 2) updatedSuspicion.level1 = true
          if (level >= 3) updatedSuspicion.level2 = true
          if (level >= 4) updatedSuspicion.level3 = true
        }

        // If unchecking a lower level, also uncheck all higher levels
        if (!checked) {
          if (level <= 1) updatedSuspicion.level2 = false
          if (level <= 2) updatedSuspicion.level3 = false
          if (level <= 3) updatedSuspicion.level4 = false
        }

        return updatedSuspicion
      }
      return suspicion
    })

    setValue('suspicions', updatedSuspicions)
  }

  return (
    <Card className="my-4 mx-0 p-2 relative">
      <CardHeader className="pb-4 text-left">
        <CardTitle className="text-2xl font-bold">Suspicions</CardTitle>
        <CardDescription>
          Fill these milestone boxes as the squires observe suspicious behavior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Squire</TableHead>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suspicions.map((suspicion, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{suspicion.name}</TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level1}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 1, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level2}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 2, !!checked)
                    }
                    disabled={!suspicion.level1}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level3}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 3, !!checked)
                    }
                    disabled={!suspicion.level2}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level4}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 4, !!checked)
                    }
                    disabled={!suspicion.level3}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={1} className="text-left"></TableCell>
              <TableCell colSpan={4} className="text-left">
                On <strong>Arrival</strong>, if the total suspicion is 8+, all
                survivors gain +3 insanity.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
