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
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { EyeIcon } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Squire Suspicions Card
 */
export function SquireSuspicionsCard(
  props: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const form = props
  const suspicions = form.watch('suspicions') || []

  // Calculate total suspicion level
  const totalSuspicion = suspicions.reduce((total, suspicion) => {
    let suspicionLevel = 0
    if (suspicion.level1) suspicionLevel += 1
    if (suspicion.level2) suspicionLevel += 1
    if (suspicion.level3) suspicionLevel += 1
    if (suspicion.level4) suspicionLevel += 1
    return total + suspicionLevel
  }, 0)

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

    form.setValue('suspicions', updatedSuspicions)

    // Save to localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex].suspicions = updatedSuspicions
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Suspicion updated!')
      }
    } catch (error) {
      console.error('Error saving suspicion:', error)
      toast.error('Failed to update suspicion')
    }
  }

  return (
    <Card className="my-4 mx-0 p-2 relative">
      <CardHeader className="pb-0 text-left">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-md flex items-center gap-1">
              <EyeIcon className="h-4 w-4" /> Suspicions
            </CardTitle>
            <CardDescription>
              Fill these milestone boxes as the squires observe suspicious
              behavior. Each checked box increases the suspicion level.
            </CardDescription>
          </div>

          <div className="flex items-center">
            <FormItem className="flex-1 flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <FormControl>
                  <Input
                    type="number"
                    className={`w-12 text-center no-spinners ${
                      totalSuspicion >= 8
                        ? 'text-red-500 font-bold border-red-500'
                        : ''
                    }`}
                    value={totalSuspicion}
                    readOnly
                    disabled={false}
                  />
                </FormControl>
                <FormLabel className="text-center text-xs">
                  Total Suspicion
                </FormLabel>
              </div>
            </FormItem>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow className="border-b">
              <TableCell className="font-medium text-left pl-5">
                Squire
              </TableCell>
            </TableRow>
            {suspicions.map((suspicion, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-left pl-5">
                  {suspicion.name}&apos;s Suspicion
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level1 || false}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 1, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level2 || false}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 2, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level3 || false}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 3, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={suspicion.level4 || false}
                    onCheckedChange={(checked) =>
                      handleSuspicionChange(suspicion.name, 4, checked === true)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <CardDescription>
          On <strong>Arrival</strong>, if the total suspicion is 8+, all
          survivors gain +3 insanity.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
