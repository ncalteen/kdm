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
  // Watch for changes to nemesis and quarry victories for rendering
  const quarryVictories = form.watch('ccQuarryVictories') || []
  const nemesisVictories = form.watch('ccNemesisVictories') || []

  // Handle quarry victory toggle
  const handleQuarryToggle = (
    quarryIndex: number,
    property: 'prologue' | 'level1' | string,
    value: boolean
  ) => {
    const updatedQuarryVictories = [...quarryVictories]

    // Handle prologue and level1 which are direct booleans
    if (property === 'prologue' || property === 'level1') {
      updatedQuarryVictories[quarryIndex] = {
        ...updatedQuarryVictories[quarryIndex],
        [property]: value
      }
    } else {
      // Handle level2[0], level2[1], level3[0], etc.
      const [level, indexStr] = property.split('[')
      const index = parseInt(indexStr.replace(']', ''))

      if (level === 'level2') {
        const updatedLevel2 = [...updatedQuarryVictories[quarryIndex].level2]
        updatedLevel2[index] = value
        updatedQuarryVictories[quarryIndex] = {
          ...updatedQuarryVictories[quarryIndex],
          level2: updatedLevel2
        }
      } else if (level === 'level3') {
        const updatedLevel3 = [...updatedQuarryVictories[quarryIndex].level3]
        updatedLevel3[index] = value
        updatedQuarryVictories[quarryIndex] = {
          ...updatedQuarryVictories[quarryIndex],
          level3: updatedLevel3
        }
      }
    }

    form.setValue('ccQuarryVictories', updatedQuarryVictories)
  }

  // Handle nemesis victory toggle
  const handleNemesisToggle = (
    nemesisIndex: number,
    level: 'level1' | 'level2' | 'level3',
    value: boolean
  ) => {
    const updatedNemesisVictories = [...nemesisVictories]
    updatedNemesisVictories[nemesisIndex] = {
      ...updatedNemesisVictories[nemesisIndex],
      [level]: value
    }

    form.setValue('ccNemesisVictories', updatedNemesisVictories)
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
                {quarryVictories.map((quarry, index) => (
                  <TableRow key={index}>
                    <TableCell>{quarry.name || 'Unnamed Quarry'}</TableCell>
                    <TableCell className="text-center">
                      {quarry.prologue !== undefined && (
                        <FormField
                          control={form.control}
                          name={`ccQuarryVictories.${index}.prologue`}
                          render={() => (
                            <FormItem className="flex justify-center">
                              <FormControl>
                                <Checkbox
                                  checked={quarry.prologue}
                                  onCheckedChange={(value) =>
                                    handleQuarryToggle(
                                      index,
                                      'prologue',
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
                        name={`ccQuarryVictories.${index}.level1`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={quarry.level1}
                                onCheckedChange={(value) =>
                                  handleQuarryToggle(index, 'level1', !!value)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    {quarry.level2.map((checked, lvl2Index) => (
                      <TableCell
                        key={`level2-${lvl2Index}`}
                        className="text-center">
                        <FormField
                          control={form.control}
                          name={`ccQuarryVictories.${index}.level2.${lvl2Index}`}
                          render={() => (
                            <FormItem className="flex justify-center">
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) =>
                                    handleQuarryToggle(
                                      index,
                                      `level2[${lvl2Index}]`,
                                      !!value
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    ))}
                    {quarry.level3.map((checked, lvl3Index) => (
                      <TableCell
                        key={`level3-${lvl3Index}`}
                        className="text-center">
                        <FormField
                          control={form.control}
                          name={`ccQuarryVictories.${index}.level3.${lvl3Index}`}
                          render={() => (
                            <FormItem className="flex justify-center">
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) =>
                                    handleQuarryToggle(
                                      index,
                                      `level3[${lvl3Index}]`,
                                      !!value
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    ))}
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
                {nemesisVictories.map((nemesis, index) => (
                  <TableRow key={index}>
                    <TableCell>{nemesis.name || 'Unnamed Nemesis'}</TableCell>
                    <TableCell className="text-center">
                      <FormField
                        control={form.control}
                        name={`ccNemesisVictories.${index}.level1`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.level1}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(index, 'level1', !!value)
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
                        name={`ccNemesisVictories.${index}.level2`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.level2}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(index, 'level2', !!value)
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
                        name={`ccNemesisVictories.${index}.level3`}
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={nemesis.level3}
                                onCheckedChange={(value) =>
                                  handleNemesisToggle(index, 'level3', !!value)
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
