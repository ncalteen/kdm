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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { EyeIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Squire Suspicions Card Component
 */
export function SquireSuspicionsCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedSuspicions = form.watch('suspicions')
  const suspicions = useMemo(() => watchedSuspicions || [], [watchedSuspicions])

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [])

  // Calculate total suspicion level
  const totalSuspicion = suspicions.reduce((total, suspicion) => {
    let suspicionLevel = 0

    if (suspicion.level1) suspicionLevel += 1
    if (suspicion.level2) suspicionLevel += 1
    if (suspicion.level3) suspicionLevel += 1
    if (suspicion.level4) suspicionLevel += 1

    return total + suspicionLevel
  }, 0)

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedSuspicions Updated Suspicions
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedSuspicions: typeof suspicions,
      successMsg?: string,
      immediate = false
    ) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.suspicions.parse(updatedSuspicions)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].suspicions = updatedSuspicions
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Suspicion Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        doSave()
      } else {
        saveTimeoutRef.current = setTimeout(doSave, 300)
      }
    },
    [form]
  )

  /**
   * Handles the change of suspicion levels for a squire.
   *
   * @param squireName Squire Name
   * @param level Suspicion Level
   * @param checked Checked State
   */
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

    saveToLocalStorageDebounced(
      updatedSuspicions,
      `${squireName}'s doubt grows deeper.`
    )
  }

  return (
    <Card className="p-0 pb-1 border-0">
      <CardHeader className="px-2 py-1">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-md flex items-center gap-1">
              <EyeIcon className="h-4 w-4" /> Suspicions
            </CardTitle>
            <CardDescription className="text-xs">
              Fill these milestone boxes as the squires observe suspicious
              behavior. Each checked box increases the suspicion level.
            </CardDescription>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Input
              type="number"
              className={`w-12 h-12 text-center no-spinners ${
                totalSuspicion >= 8
                  ? 'text-red-500 font-bold border-red-500'
                  : ''
              }`}
              value={totalSuspicion}
              readOnly
              disabled={false}
            />
            <Label className="text-center text-xs">Suspicion Level</Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-1 pb-0">
        <div className="flex flex-col">
          <Table>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="font-medium text-left pl-5">
                  Squire
                </TableCell>
                <TableCell className="text-center" />
                <TableCell className="text-center" />
                <TableCell className="text-center" />
                <TableCell className="text-center" />
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
                        handleSuspicionChange(
                          suspicion.name,
                          1,
                          checked === true
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={suspicion.level2 || false}
                      onCheckedChange={(checked) =>
                        handleSuspicionChange(
                          suspicion.name,
                          2,
                          checked === true
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={suspicion.level3 || false}
                      onCheckedChange={(checked) =>
                        handleSuspicionChange(
                          suspicion.name,
                          3,
                          checked === true
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={suspicion.level4 || false}
                      onCheckedChange={(checked) =>
                        handleSuspicionChange(
                          suspicion.name,
                          4,
                          checked === true
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-2">
        <CardDescription className="text-xs">
          On <strong>Arrival</strong>, if the total suspicion is 8+, all
          survivors gain +3 insanity.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
