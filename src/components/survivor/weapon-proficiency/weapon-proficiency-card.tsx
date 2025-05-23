'use client'

import { SelectWeaponType } from '@/components/menu/select-weapon-type'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { WeaponType } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
export function WeaponProficiencyCard(
  form: UseFormReturn<Survivor>
): ReactElement {
  const weaponProficiency = form.watch('weaponProficiency') || 0
  const weaponProficiencyType = form.watch('weaponProficiencyType')

  /**
   * Save weapon proficiency data to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedProficiency Updated weapon proficiency level
   * @param updatedType Updated weapon proficiency type
   */
  const saveToLocalStorage = (
    updatedProficiency: number,
    updatedType?: WeaponType
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          weaponProficiency: updatedProficiency,
          ...(updatedType && { weaponProficiencyType: updatedType })
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.survivors[survivorIndex].weaponProficiency = updatedProficiency
        if (updatedType)
          campaign.survivors[survivorIndex].weaponProficiencyType = updatedType
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (updatedProficiency === 3)
          toast.success('The survivor becomes a specialist in their craft.')
        else if (updatedProficiency === 8)
          toast.success('The survivor achieves mastery beyond mortal limits.')
      }
    } catch (error) {
      console.error('Weapon Proficiency Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handle weapon proficiency level checkbox change
   *
   * @param index Checkbox index (0-7)
   * @param checked Whether the checkbox is checked
   */
  const handleProficiencyChange = (index: number, checked: boolean) => {
    const newProficiency = checked ? index + 1 : index
    form.setValue('weaponProficiency', newProficiency)
    saveToLocalStorage(newProficiency)
  }

  /**
   * Handle weapon type selection change
   *
   * @param type Selected weapon type
   */
  const handleWeaponTypeChange = (type: string) => {
    const weaponType = type as WeaponType
    form.setValue('weaponProficiencyType', weaponType)
    saveToLocalStorage(weaponProficiency, weaponType)
    toast.success('The survivor turns their focus to a new weapon.')
  }

  return (
    <Card className="mt-2 border-2">
      <CardContent className="p-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-l">Weapon Proficiency</CardTitle>
            <SelectWeaponType
              value={weaponProficiencyType}
              onChange={handleWeaponTypeChange}
            />
          </div>
          <div className="flex flex-col pt-1">
            <div className="flex flex-row gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 flex items-center justify-center">
                  <Checkbox
                    checked={weaponProficiency > i}
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

            <hr className="mt-2 mb-2" />

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
                    <span className="text-sm">Specialist</span>
                  ) : (
                    <span className="text-sm">Master</span>
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
