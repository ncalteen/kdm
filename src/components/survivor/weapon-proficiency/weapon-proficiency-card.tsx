'use client'

import { SelectWeaponType } from '@/components/menu/select-weapon-type'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { WeaponType } from '@/lib/enums'
import { Survivor } from '@/schemas/survivor'
import { SwordsIcon } from 'lucide-react'
import { ReactElement, useCallback } from 'react'

/**
 * Weapon Proficiency Card Properties
 */
interface WeaponProficiencyCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Weapon Proficiency Card Component
 *
 * This component displays the weapon proficiency options for a survivor. It
 * includes a dropdown to select the weapon type and checkboxes to set the
 * proficiency level. The proficiency level can be set from 0 to 8, with
 * special notes for levels 3 and 8.
 *
 * @param form Form
 * @returns Weapon Proficiency Card Component
 */
export function WeaponProficiencyCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: WeaponProficiencyCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param updatedProficiency Updated weapon proficiency level
   * @param updatedType Updated weapon proficiency type
   */
  const saveToLocalStorage = useCallback(
    (
      updatedProficiency?: number,
      updatedType?: WeaponType,
      successMsg?: string
    ) => {
      const updateData: Partial<Survivor> = {}

      if (updatedProficiency !== undefined)
        updateData.weaponProficiency = updatedProficiency
      if (updatedType !== undefined)
        updateData.weaponProficiencyType = updatedType

      saveSelectedSurvivor(updateData, successMsg)
    },
    [saveSelectedSurvivor]
  )

  /**
   * Handle weapon proficiency level checkbox change
   *
   * @param index Checkbox index (0-7)
   * @param checked Whether the checkbox is checked
   */
  const handleProficiencyChange = (index: number, checked: boolean) => {
    const updatedProficiency = checked ? index + 1 : index

    saveToLocalStorage(
      updatedProficiency,
      undefined,
      updatedProficiency === 3
        ? 'The survivor becomes a specialist in their craft.'
        : updatedProficiency === 8
          ? 'The survivor achieves mastery beyond mortal limits.'
          : 'The survivor hones their weapon proficiency.'
    )
  }

  /**
   * Handle weapon type selection change
   *
   * @param type Selected weapon type
   */
  const handleWeaponTypeChange = (type: string) =>
    saveToLocalStorage(
      undefined,
      type as WeaponType,
      'The survivor turns their focus to a new weapon.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col justify-between">
            <CardTitle className="text-md flex flex-row items-center gap-1">
              <SwordsIcon className="h-4 w-4" />
              Weapon Proficiency
            </CardTitle>
            <SelectWeaponType
              value={selectedSurvivor?.weaponProficiencyType}
              onChange={handleWeaponTypeChange}
            />
          </div>
          <div className="flex flex-col pt-2">
            <div className="flex flex-row gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 flex items-center justify-center">
                  <Checkbox
                    checked={(selectedSurvivor?.weaponProficiency || 0) > i}
                    onCheckedChange={(checked) =>
                      handleProficiencyChange(i, !!checked)
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 7 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="my-3" />

            <div className="flex flex-row justify-between gap-2">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="flex items-center gap-1">
                  {Array.from({ length: i + 1 }, (_, j) => (
                    <Checkbox
                      key={j}
                      disabled
                      className="!bg-white border border-gray-300 h-3 w-3"
                    />
                  ))}
                  {i === 0 ? (
                    <span className="text-xs">Specialist</span>
                  ) : (
                    <span className="text-xs">Master</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
