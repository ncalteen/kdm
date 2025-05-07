'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { SettlementSchema } from '@/schemas/settlement'
import { EyeIcon } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface SquireSuspicionsCardProps {
  control: UseFormReturn<z.infer<typeof SettlementSchema>>['control']
  setValue: UseFormReturn<z.infer<typeof SettlementSchema>>['setValue']
  watch: UseFormReturn<z.infer<typeof SettlementSchema>>['watch']
}

/**
 * Squire Suspicions Card
 */
export function SquireSuspicionsCard({ watch }: SquireSuspicionsCardProps) {
  const suspicions = watch('suspicions') || []

  // TODO: Implement this in the settlement editor.
  // const handleSuspicionChange = (
  //   squireName: string,
  //   level: number,
  //   checked: boolean
  // ) => {
  //   const updatedSuspicions = suspicions.map((suspicion) => {
  //     if (suspicion.name === squireName) {
  //       // Make a copy of the suspicion
  //       const updatedSuspicion = { ...suspicion }

  //       // Update the specified level
  //       if (level === 1) updatedSuspicion.level1 = checked
  //       if (level === 2) updatedSuspicion.level2 = checked
  //       if (level === 3) updatedSuspicion.level3 = checked
  //       if (level === 4) updatedSuspicion.level4 = checked

  //       // If checking a higher level, also check all lower levels
  //       if (checked) {
  //         if (level >= 2) updatedSuspicion.level1 = true
  //         if (level >= 3) updatedSuspicion.level2 = true
  //         if (level >= 4) updatedSuspicion.level3 = true
  //       }

  //       // If unchecking a lower level, also uncheck all higher levels
  //       if (!checked) {
  //         if (level <= 1) updatedSuspicion.level2 = false
  //         if (level <= 2) updatedSuspicion.level3 = false
  //         if (level <= 3) updatedSuspicion.level4 = false
  //       }

  //       return updatedSuspicion
  //     }
  //     return suspicion
  //   })

  //   setValue('suspicions', updatedSuspicions)
  // }

  return (
    <Card className="my-4 mx-0 p-2 relative">
      <CardHeader className="pb-0 text-left">
        <CardTitle className="text-md flex items-center gap-1">
          <EyeIcon className="h-4 w-4" /> Suspicions
        </CardTitle>
        <CardDescription>
          Fill these milestone boxes as the squires observe suspicious behavior.
          <br />
          <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {suspicions.map((suspicion, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-left pl-5">
                  {suspicion.name}&apos;s Suspicion
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={false} disabled={true} />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={false} disabled={true} />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={false} disabled={true} />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={false} disabled={true} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          On <strong>Arrival</strong>, if the total suspicion is 8+, all
          survivors gain +3 insanity.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
