'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE } from '@/lib/messages'
import { Nemesis, Quarry, Settlement } from '@/schemas/settlement'
import { TrophyIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Collective Cognition Victories Card Properties
 */
interface CollectiveCognitionVictoriesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
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
  saveSelectedSettlement,
  selectedSettlement
}: CollectiveCognitionVictoriesCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    quarries: Quarry[] | null,
    nemeses: Nemesis[] | null,
    successMsg?: string
  ) =>
    saveSelectedSettlement(
      {
        quarries: quarries || selectedSettlement?.quarries || [],
        nemeses: nemeses || selectedSettlement?.nemeses || []
      },
      successMsg
    )

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <TrophyIcon className="h-4 w-4" /> Settlement Victories
        </CardTitle>
      </CardHeader>

      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-bold">Quarry</TableHead>
                  <TableHead className="text-center text-xs">
                    Prologue
                    <br />1 CC
                  </TableHead>
                  <TableHead className="text-center text-xs">
                    Lvl 1<br />1 CC
                  </TableHead>
                  <TableHead className="text-center text-xs" colSpan={2}>
                    Lvl 2<br />2 CC
                  </TableHead>
                  <TableHead className="text-center text-xs" colSpan={3}>
                    Lvl 3+
                    <br />3 CC
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedSettlement?.quarries || []).map((quarry, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm text-left pl-5">
                      {quarry.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {index === 0 && (
                        <div className="flex justify-center">
                          <Checkbox
                            checked={
                              selectedSettlement?.quarries?.[index]
                                ?.ccPrologue || false
                            }
                            onCheckedChange={(checked) => {
                              if (checked !== 'indeterminate') {
                                const updatedQuarries = [
                                  ...(selectedSettlement?.quarries || [])
                                ]
                                updatedQuarries[index] = {
                                  ...updatedQuarries[index],
                                  ccPrologue: checked
                                }
                                saveToLocalStorage(
                                  updatedQuarries,
                                  null,
                                  COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                    !!checked
                                  )
                                )
                              }
                            }}
                            id={`quarries-${index}-ccPrologue`}
                            name={`quarries.${index}.ccPrologue`}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={
                            selectedSettlement?.quarries?.[index]?.ccLevel1 ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              const updatedQuarries = [
                                ...(selectedSettlement?.quarries || [])
                              ]
                              updatedQuarries[index] = {
                                ...updatedQuarries[index],
                                ccLevel1: checked
                              }
                              saveToLocalStorage(
                                updatedQuarries,
                                null,
                                COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                  !!checked
                                )
                              )
                            }
                          }}
                          id={`quarries-${index}-ccLevel1`}
                          name={`quarries.${index}.ccLevel1`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center" colSpan={2}>
                      <div className="flex flex-row justify-center gap-2">
                        {(quarry.ccLevel2 || [false, false]).map(
                          (checked, lvl2Index) => (
                            <div
                              className="flex justify-center"
                              key={`ccLevel2-${lvl2Index}`}>
                              <Checkbox
                                checked={
                                  selectedSettlement?.quarries?.[index]
                                    ?.ccLevel2?.[lvl2Index] || false
                                }
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    const updatedQuarries = [
                                      ...(selectedSettlement?.quarries || [])
                                    ]
                                    const updatedCcLevel2 = [
                                      ...(updatedQuarries[index]?.ccLevel2 || [
                                        false,
                                        false
                                      ])
                                    ]
                                    updatedCcLevel2[lvl2Index] = checked
                                    updatedQuarries[index] = {
                                      ...updatedQuarries[index],
                                      ccLevel2: updatedCcLevel2
                                    }
                                    saveToLocalStorage(
                                      updatedQuarries,
                                      null,
                                      COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                        !!checked
                                      )
                                    )
                                  }
                                }}
                                id={`quarries-${index}-ccLevel2-${lvl2Index}`}
                                name={`quarries.${index}.ccLevel2.${lvl2Index}`}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center" colSpan={3}>
                      <div className="flex flex-row justify-center gap-2">
                        {(quarry.ccLevel3 || [false, false, false]).map(
                          (checked, lvl3Index) => (
                            <div
                              key={`ccLevel3-${lvl3Index}`}
                              className="flex justify-center">
                              <Checkbox
                                checked={
                                  selectedSettlement?.quarries?.[index]
                                    ?.ccLevel3?.[lvl3Index] || false
                                }
                                onCheckedChange={(checked) => {
                                  if (checked !== 'indeterminate') {
                                    const updatedQuarries = [
                                      ...(selectedSettlement?.quarries || [])
                                    ]
                                    const updatedCcLevel3 = [
                                      ...(updatedQuarries[index]?.ccLevel3 || [
                                        false,
                                        false,
                                        false
                                      ])
                                    ]
                                    updatedCcLevel3[lvl3Index] = checked
                                    updatedQuarries[index] = {
                                      ...updatedQuarries[index],
                                      ccLevel3: updatedCcLevel3
                                    }
                                    saveToLocalStorage(
                                      updatedQuarries,
                                      null,
                                      COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                        !!checked
                                      )
                                    )
                                  }
                                }}
                                id={`quarries-${index}-ccLevel3-${lvl3Index}`}
                                name={`quarries.${index}.ccLevel3.${lvl3Index}`}
                              />
                            </div>
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
                  <TableHead className="text-sm font-bold">Nemesis</TableHead>
                  <TableHead className="text-center text-xs">
                    Lvl 1<br />3 CC
                  </TableHead>
                  <TableHead className="text-center text-xs">
                    Lvl 2<br />3 CC
                  </TableHead>
                  <TableHead className="text-center text-xs">
                    Lvl 3+
                    <br />3 CC
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedSettlement?.nemeses || []).map((nemesis, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm text-left pl-5">
                      {nemesis.name || 'Unnamed Nemesis'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={
                            selectedSettlement?.nemeses?.[index]?.ccLevel1 ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              const updatedNemeses = [
                                ...(selectedSettlement?.nemeses || [])
                              ]
                              updatedNemeses[index] = {
                                ...updatedNemeses[index],
                                ccLevel1: checked
                              }
                              saveToLocalStorage(
                                null,
                                updatedNemeses,
                                COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                  !!checked
                                )
                              )
                            }
                          }}
                          id={`nemesis-${index}-ccLevel1`}
                          name={`nemeses.${index}.ccLevel1`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={
                            selectedSettlement?.nemeses?.[index]?.ccLevel2 ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              const updatedNemeses = [
                                ...(selectedSettlement?.nemeses || [])
                              ]
                              updatedNemeses[index] = {
                                ...updatedNemeses[index],
                                ccLevel2: checked
                              }
                              saveToLocalStorage(
                                null,
                                updatedNemeses,
                                COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                  !!checked
                                )
                              )
                            }
                          }}
                          id={`nemesis-${index}-ccLevel2`}
                          name={`nemeses.${index}.ccLevel2`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={
                            selectedSettlement?.nemeses?.[index]?.ccLevel3 ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              const updatedNemeses = [
                                ...(selectedSettlement?.nemeses || [])
                              ]
                              updatedNemeses[index] = {
                                ...updatedNemeses[index],
                                ccLevel3: checked
                              }
                              saveToLocalStorage(
                                null,
                                updatedNemeses,
                                COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE(
                                  !!checked
                                )
                              )
                            }
                          }}
                          id={`nemesis-${index}-ccLevel3`}
                          name={`nemeses.${index}.ccLevel3`}
                        />
                      </div>
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
