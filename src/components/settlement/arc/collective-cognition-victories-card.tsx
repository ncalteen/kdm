'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { TrophyIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Collective Cognition Victories Card Component
 *
 * Displays and manages the collective cognition victories tracking table.
 * Allows checking off victories and saves progress to localStorage.
 *
 * @param form Settlement form instance
 * @returns Collective Cognition Victories Card Component
 */
export function CollectiveCognitionVictoriesCard(
  form: UseFormReturn<Settlement>
): ReactElement {
  const quarries = form.watch('quarries') || []
  const nemeses = form.watch('nemeses') || []

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = saveTimeoutRef.current
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (successMsg?: string, immediate = false) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            campaign.settlements[settlementIndex].quarries = formValues.quarries
            campaign.settlements[settlementIndex].nemeses = formValues.nemeses
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('CC Victory Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) doSave()
      else saveTimeoutRef.current = setTimeout(doSave, 300)
    },
    [form]
  )

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
          <TrophyIcon className="h-4 w-4" /> Settlement Victories
        </CardTitle>
        <CardDescription className="text-left text-xs">
          After a victorious showdown, fill a box for the defeated
          monster&apos;s level.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Quarry</TableHead>
                  <TableHead className="text-center">
                    Prologue
                    <br />1 CC
                  </TableHead>
                  <TableHead className="text-center">
                    Lvl 1<br />1 CC
                  </TableHead>
                  <TableHead className="text-center" colSpan={2}>
                    Lvl 2<br />2 CC
                  </TableHead>
                  <TableHead className="text-center" colSpan={3}>
                    Lvl 3+
                    <br />3 CC
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarries.map((quarry, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left pl-5">
                      {quarry.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {index === 0 && (
                        <FormField
                          control={form.control}
                          name={`quarries.${index}.ccPrologue`}
                          render={({ field }) => (
                            <FormItem className="flex justify-center">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    if (checked !== 'indeterminate') {
                                      field.onChange(checked)
                                      saveToLocalStorageDebounced(
                                        "The settlement's legacy grows stronger.",
                                        true
                                      )
                                    }
                                  }}
                                  id={`quarries-${index}-ccPrologue`}
                                  name={`quarries.${index}.ccPrologue`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`quarries.${index}.ccLevel1`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    field.onChange(checked)
                                    saveToLocalStorageDebounced(
                                      "The settlement's legacy grows stronger.",
                                      true
                                    )
                                  }
                                }}
                                id={`quarries-${index}-ccLevel1`}
                                name={`quarries.${index}.ccLevel1`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center" colSpan={2}>
                      <div className="flex flex-row justify-center gap-2">
                        {(quarry.ccLevel2 || [false, false]).map(
                          (checked, lvl2Index) => (
                            <FormField
                              key={`ccLevel2-${lvl2Index}`}
                              control={form.control}
                              name={`quarries.${index}.ccLevel2.${lvl2Index}`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        if (checked !== 'indeterminate') {
                                          field.onChange(checked)
                                          saveToLocalStorageDebounced()
                                        }
                                      }}
                                      id={`quarries-${index}-ccLevel2-${lvl2Index}`}
                                      name={`quarries.${index}.ccLevel2.${lvl2Index}`}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center" colSpan={3}>
                      <div className="flex flex-row justify-center gap-2">
                        {(quarry.ccLevel3 || [false, false, false]).map(
                          (checked, lvl3Index) => (
                            <FormField
                              key={`ccLevel3-${lvl3Index}`}
                              control={form.control}
                              name={`quarries.${index}.ccLevel3.${lvl3Index}`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        if (checked !== 'indeterminate') {
                                          field.onChange(checked)
                                          saveToLocalStorageDebounced()
                                        }
                                      }}
                                      id={`quarries-${index}-ccLevel3-${lvl3Index}`}
                                      name={`quarries.${index}.ccLevel3.${lvl3Index}`}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="pt-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Nemesis</TableHead>
                  <TableHead className="text-center">
                    Lvl 1<br />3 CC
                  </TableHead>
                  <TableHead className="text-center">
                    Lvl 2<br />3 CC
                  </TableHead>
                  <TableHead className="text-center">
                    Lvl 3+
                    <br />3 CC
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nemeses.map((nemesis, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left pl-5">
                      {nemesis.name || 'Unnamed Nemesis'}
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemeses.${index}.ccLevel1`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    field.onChange(checked)
                                    saveToLocalStorageDebounced()
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel1`}
                                name={`nemesis.${index}.ccLevel1`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemeses.${index}.ccLevel2`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    field.onChange(checked)
                                    saveToLocalStorageDebounced()
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel2`}
                                name={`nemesis.${index}.ccLevel2`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemeses.${index}.ccLevel3`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    field.onChange(checked)
                                    saveToLocalStorageDebounced()
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel3`}
                                name={`nemesis.${index}.ccLevel3`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
