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
import { Settlement } from '@/schemas/settlement'
import { TrophyIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Collective Cognition Victories Card Properties
 */
interface CollectiveCognitionVictoriesCardProps {
  /** Settlement Form */
  form: UseFormReturn<Settlement>
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Collective Cognition Victories Card Component
 *
 * Displays and manages the collective cognition victories tracking table.
 * Allows checking off victories and saves progress to localStorage.
 *
 * @param props Collective Cognition Victories Card Properties
 * @returns Collective Cognition Victories Card Component
 */
export function CollectiveCognitionVictoriesCard({
  form,
  saveSelectedSettlement,
  selectedSettlement
}: CollectiveCognitionVictoriesCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (successMsg?: string) => {
    // Get the current form values which include all updates
    const formValues = form.getValues()

    const updateData: Partial<Settlement> = {
      quarries: formValues.quarries,
      nemeses: formValues.nemeses
    }

    saveSelectedSettlement(updateData, successMsg)
  }

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
                {(selectedSettlement?.quarries || []).map((quarry, index) => (
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
                                      saveToLocalStorage(
                                        "The settlement's legacy grows stronger."
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
                                    saveToLocalStorage(
                                      "The settlement's legacy grows stronger."
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
                                          saveToLocalStorage(
                                            "The settlement's legacy grows stronger."
                                          )
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
                                          saveToLocalStorage(
                                            "The settlement's legacy grows stronger."
                                          )
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
                {(selectedSettlement?.nemeses || []).map((nemesis, index) => (
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
                                    saveToLocalStorage(
                                      "The settlement's legacy grows stronger."
                                    )
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel1`}
                                name={`nemeses.${index}.ccLevel1`}
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
                                    saveToLocalStorage(
                                      "The settlement's legacy grows stronger."
                                    )
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel2`}
                                name={`nemeses.${index}.ccLevel2`}
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
                                    saveToLocalStorage(
                                      "The settlement's legacy grows stronger."
                                    )
                                  }
                                }}
                                id={`nemesis-${index}-ccLevel3`}
                                name={`nemeses.${index}.ccLevel3`}
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
