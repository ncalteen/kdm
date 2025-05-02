'use client'

import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../table'

export function CcVictoriesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  // Use quarries array from the form instead of ccQuarryVictories
  const quarries = form.watch('quarries') || []
  const nemeses = form.watch('nemesis') || []

  // Handle quarry victory toggle (update quarries array)
  const handleQuarryToggle = (
    quarryIndex: number,
    property: 'ccPrologue' | 'ccLevel1' | string,
    value: boolean
  ) => {
    const updatedQuarries = [...quarries]
    if (property === 'ccPrologue' || property === 'ccLevel1') {
      updatedQuarries[quarryIndex] = {
        ...updatedQuarries[quarryIndex],
        [property]: value
      }
    } else {
      // Handle ccLevel2[0], ccLevel2[1], ccLevel3[0], etc.
      const [ccLevel, indexStr] = property.split('[')
      const index = parseInt(indexStr.replace(']', ''))
      if (ccLevel === 'ccLevel2') {
        const updatedCcLevel2 = [
          ...(updatedQuarries[quarryIndex].ccLevel2 || [false, false])
        ]
        updatedCcLevel2[index] = value
        updatedQuarries[quarryIndex] = {
          ...updatedQuarries[quarryIndex],
          ccLevel2: updatedCcLevel2
        }
      } else if (ccLevel === 'ccLevel3') {
        const updatedCcLevel3 = [
          ...(updatedQuarries[quarryIndex].ccLevel3 || [false, false, false])
        ]
        updatedCcLevel3[index] = value
        updatedQuarries[quarryIndex] = {
          ...updatedQuarries[quarryIndex],
          ccLevel3: updatedCcLevel3
        }
      }
    }
    form.setValue('quarries', updatedQuarries)
  }

  // Handle nemesis victory toggle (update nemesis array)
  const handleNemesisToggle = (
    nemesisIndex: number,
    ccLevel: 'ccLevel1' | 'ccLevel2' | 'ccLevel3',
    value: boolean
  ) => {
    const updatedNemeses = [...nemeses]
    updatedNemeses[nemesisIndex] = {
      ...updatedNemeses[nemesisIndex],
      [ccLevel]: value
    }

    form.setValue('nemesis', updatedNemeses)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Settlement Victories
        </CardTitle>
        <CardDescription className="text-left">
          After a victorious showdown, fill a box for the defeated
          monster&apos;s level.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        <div className="space-y-4">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarry</TableHead>
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
                    <TableCell>{quarry.name || 'Unnamed Quarry'}</TableCell>
                    <TableCell className="text-center">
                      {index === 0 && (
                        <FormField
                          control={form.control}
                          name={`quarries.${index}.ccPrologue`}
                          render={() => (
                            <FormItem className="flex justify-center">
                              <FormControl>
                                <Checkbox
                                  checked={quarry.ccPrologue}
                                  onCheckedChange={(value) =>
                                    handleQuarryToggle(
                                      index,
                                      'ccPrologue',
                                      !!value
                                    )
                                  }
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
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={quarry.ccLevel1}
                                onCheckedChange={(value) =>
                                  handleQuarryToggle(index, 'ccLevel1', !!value)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    {(quarry.ccLevel2 || [false, false]).map(
                      (checked, lvl2Index) => (
                        <TableCell
                          key={`ccLevel2-${lvl2Index}`}
                          className="text-center">
                          <FormField
                            control={form.control}
                            name={`quarries.${index}.ccLevel2.${lvl2Index}`}
                            render={() => (
                              <FormItem className="flex justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                      handleQuarryToggle(
                                        index,
                                        `ccLevel2[${lvl2Index}]`,
                                        !!value
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      )
                    )}
                    {(quarry.ccLevel3 || [false, false, false]).map(
                      (checked, lvl3Index) => (
                        <TableCell
                          key={`ccLevel3-${lvl3Index}`}
                          className="text-center">
                          <FormField
                            control={form.control}
                            name={`quarries.${index}.ccLevel3.${lvl3Index}`}
                            render={() => (
                              <FormItem className="flex justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                      handleQuarryToggle(
                                        index,
                                        `ccLevel3[${lvl3Index}]`,
                                        !!value
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nemesis</TableHead>
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
                    <TableCell>{nemesis.name || 'Unnamed Nemesis'}</TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemesis.${index}.ccLevel1`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.ccLevel1}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(
                                    index,
                                    'ccLevel1',
                                    !!value
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemesis.${index}.ccLevel2`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.ccLevel2}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(
                                    index,
                                    'ccLevel2',
                                    !!value
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`nemesis.${index}.ccLevel3`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.ccLevel3}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(
                                    index,
                                    'ccLevel3',
                                    !!value
                                  )
                                }
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
